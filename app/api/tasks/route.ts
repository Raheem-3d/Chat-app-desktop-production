

import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { emitToUser } from "@/lib/socket-server"
import { subDays, subHours,addMinutes  } from "date-fns"
import { sendEmail } from "@/lib/email"
import { getTenantWhereClause, getSessionUserWithPermissions } from "@/lib/org"
const crypto = require('crypto');

export async function GET(req: Request) {
  try {
    const { getSessionOrMobileUser } = await import('@/lib/mobile-auth')
    const user = await getSessionOrMobileUser(req as any)

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const status = searchParams.get("status")
    const priority = searchParams.get("priority")
    const assignedTo = searchParams.get("assignedTo")
    const createdBy = searchParams.get("createdBy")

    // Check if user is super admin
    const userWithPerms = await getSessionUserWithPermissions(req as any)
    const isSuperAdmin = userWithPerms.isSuperAdmin

    let whereClause: any = {}

    // Super admins can see all tasks
    // Regular users see only their organization's tasks
    if (!isSuperAdmin) {
      whereClause.organizationId = user?.organizationId || undefined
    }

    // If assignedTo is specified, filter by assignments
    if (assignedTo) {
      whereClause.assignments = {
        some: {
          userId: assignedTo,
        },
      }
    }
    // If createdBy is specified, filter by creator
    else if (createdBy) {
      whereClause.creatorId = createdBy
    }
    // Otherwise, for non-super-admins, show tasks user is involved in
    else if (!isSuperAdmin) {
      whereClause.OR = [
        { creatorId: user.id },
        {
          assignments: {
            some: {
              userId: user.id,
            },
          },
        },
      ]
    }

    // Add additional filters
    if (status) {
      whereClause.status = status
    }

    if (priority) {
      whereClause.priority = priority
    }

    const tasks = await db.task.findMany({
      where: whereClause,
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        organization: {
          select: {
            id: true,
            name: true,
          },
        },
        assignments: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
              },
            },
          },
        },
        channel: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: [
        {
          status: "asc",
        },
        {
          priority: "desc",
        },
        {
          deadline: "asc",
        },
      ],
    })

    return NextResponse.json(tasks)
  } catch (error) {
    console.error("Error fetching tasks:", error)
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 })
  }
}






export async function POST(req: Request) {
  try {
    const { getSessionOrMobileUser } = await import('@/lib/mobile-auth')
    const user = await getSessionOrMobileUser(req as any)

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // Read request body for task creation
    const { title, description, priority, deadline, assignees, clientEmails } = await req.json();

    // Check if user has permission to create projects (ORG_ADMIN or MANAGER only)
    if (!["ORG_ADMIN", "MANAGER"].includes(user?.role)) {
      return NextResponse.json(
        { message: "Forbidden: Only ORG_ADMIN and MANAGER can create projects" }, 
        { status: 403 }
      );
    }

    // Create task
    const task = await db.task.create({
      data: {
        title,
        description,
        priority,
        deadline: deadline ? new Date(deadline) : null,
        creatorId: user.id,
        organizationId: user?.organizationId || undefined,
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });

    // Get all users with role ORG_ADMIN or CLIENT
    const adminAndClientUsers = await db.user.findMany({
      where: {
        role: {
          in: ['ORG_ADMIN', 'CLIENT'],
        },
        organizationId: user?.organizationId || undefined,
      },
      select: {
        id: true,
      },
    });


  const onlyAdminRole = await db.user.findMany({
    where: {
      role: 'ORG_ADMIN',
      organizationId: user?.organizationId || undefined,
    },
    select: {
      id: true,
    },
  });

    // Create task thread channel
    const channelName = `Internal-${task.title}`;

    const channel = await db.channel.create({
      data: {
        name: channelName,
        description: `Discussion thread for task: ${title}`,
        isPublic: false,
        isTaskThread: true,
        taskId: task.id,
        creatorId: user.id,
        organizationId: user?.organizationId || undefined,
        members: {
          create: [
            {
              userId: user.id,
              isAdmin: true,
            },
            ...adminAndClientUsers
              .filter((u: any) => u.id !== user.id) // Avoid duplication
              .map((user: any) => ({
                userId: user.id,
                isAdmin: false,
              })),
          ],
        },
      },
    });


   const channelOnlyForAdmin = await db.channel.create({
      data: {
       name: `Task-${task.title}-OrgAdmin`,
       description: `Discussion thread for task: ${title} (Admins only)`,
       isPublic: false,
       isTaskThread: true,
       taskReferenceId: task.id,
       creatorId: user.id,
       organizationId: user?.organizationId || undefined,
       members: {
         create: [
           {
             userId: user.id,
             isAdmin: true,
           },
           ...onlyAdminRole
            .filter((u: any) => u.id !== user.id) // Avoid duplication
            .map((u: any) => ({
              userId: u.id,
               isAdmin: false,
             })),
         ],
       },
     },
   });

    // Handle assignees
    if (assignees && assignees.length > 0) {
      const assignmentPromises = assignees.map(async (assigneeId: string) => {
        // Create assignment
        const assignment = await db.taskAssignment.create({
          data: {
            taskId: task.id,
            userId: assigneeId,
          },
        });

        // Add to channel (idempotent)
        await db.channelMember.upsert({
          where: {
            userId_channelId: { userId: assigneeId, channelId: channel.id },
          },
          create: {
            userId: assigneeId,
            channelId: channel.id,
          },
          update: {},
        })

        // Create notification
        const notification = await db.notification.create({
          data: {
            type: "TASK_ASSIGNED",
            content: `You have been assigned to task: ${task.title}`,
            userId: assigneeId,
            taskId: task.id,
          },
        });

        // Emit via socket
        const notificationEmitted = emitToUser(assigneeId, "new-notification", notification);
        console.log("🔔 Socket notification emitted:", notificationEmitted);

        // Get assignee email
        const assignee = await db.user.findUnique({
          where: { id: assigneeId },
          select: { email: true },
        });

        console.log(assignee, 'assign');

        // Send email
        if (assignee?.email) {
          try {
            await sendEmail({
              to: assignee.email,
              subject: `🔔 TASK_ASSIGNED: ${task.title}`,
              html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                  <h2 style="color: #2563eb;">🔔 Task Assignment Notification</h2>
                  <div style="background: #f9fafb; padding: 16px; border-radius: 8px; margin-bottom: 16px;">
                    <h3 style="margin-top: 0; color: #111827;">${task.title}</h3>
                    <p><strong>Description:</strong> ${task.description || "No description provided"}</p>
                    <p><strong>Priority:</strong> ${task.priority}</p>
                    <p><strong>Deadline:</strong> ${task.deadline ? new Date(task.deadline).toLocaleString() : "No deadline"}</p>
                  </div>
                  <p style="color: #6b7280; font-size: 14px; text-align: center;">
                    This is an automated message from the Task Manager system.
                  </p>
                </div>
              `,
            })
          } catch (e) {
            console.error("Error sending assignment email:", e)
          }
        }

        return assignment;
      });

      await Promise.all(assignmentPromises);

      if (deadline) {
        await createAutomaticTaskReminders(
          task.id,
          task.title,
          new Date(deadline),
          assignees
        );
      }
    }

    // Handle client emails and create TaskInvitations
    if (clientEmails && clientEmails.length > 0) {
      const clientInvitationPromises = clientEmails.map(async (clientData: any) => {
        const { email, role, access } = clientData;

        // Check if user already exists
        let clientUser = await db.user.findUnique({
          where: { email: email.toLowerCase() },
        });

        // If user doesn't exist, create invitation
        if (!clientUser) {
          // Generate invitation token
          const token = await generateInvitationToken(email, task.id);

          // Create task invitation
          const invitation = await db.taskInvitation.create({
            data: {
              taskId: task.id,
              email: email.toLowerCase(),
              role: role || "CLIENT",
              accessLevel: access || "VIEW",
              invitedById: user.id,
              accepted: false,
            },
          });

          // Send invitation email
          const inviteLink = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/invite/${token}`;
          
          try {
            await sendEmail({
              to: email,
              subject: `🎯 You've been invited to collaborate on: ${task.title}`,
              html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                  <h2 style="color: #2563eb;">🎯 Task Collaboration Invitation</h2>
                  <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                    <h3 style="margin-top: 0; color: #111827;">${task.title}</h3>
                    <p><strong>Description:</strong> ${task.description || "No description provided"}</p>
                    <p><strong>Priority:</strong> ${task.priority}</p>
                    <p><strong>Deadline:</strong> ${task.deadline ? new Date(task.deadline).toLocaleString() : "No deadline"}</p>
                    <p><strong>Your Access Level:</strong> <span style="background: #dbeafe; padding: 4px 8px; border-radius: 4px; color: #1e40af;">${access}</span></p>
                  </div>
                  <div style="background: #eff6ff; padding: 16px; border-radius: 8px; margin-bottom: 20px;">
                    <p style="margin: 0 0 12px 0;"><strong>Access Permissions:</strong></p>
                    ${access === 'VIEW' ? '<p style="margin: 4px 0;">✓ View task details</p><p style="margin: 4px 0;">✗ Cannot edit or comment</p>' : ''}
                    ${access === 'COMMENT' ? '<p style="margin: 4px 0;">✓ View task details</p><p style="margin: 4px 0;">✓ Add comments</p><p style="margin: 4px 0;">✗ Cannot edit task</p>' : ''}
                    ${access === 'EDIT' ? '<p style="margin: 4px 0;">✓ View task details</p><p style="margin: 4px 0;">✓ Add comments</p><p style="margin: 4px 0;">✓ Edit task details</p>' : ''}
                  </div>
                  <div style="text-align: center; margin: 30px 0;">
                    <a href="${inviteLink}" style="background: #2563eb; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
                      Accept Invitation & View Task
                    </a>
                  </div>
                  <p style="color: #6b7280; font-size: 14px; text-align: center;">
                    This invitation will expire in 7 days.
                  </p>
                </div>
              `,
            })
          } catch (e) {
            console.error("Error sending client invitation email:", e)
          }

          console.log(`📧 Invitation email sent to ${email}`);
          return invitation;
        } else {
          // If user exists, create TaskClient relationship directly
          const taskClient = await db.taskClient.create({
            data: {
              taskId: task.id,
              userId: clientUser.id,
              role: role || "CLIENT",
              accessLevel: access || "VIEW",
            },
          });

          // Add client to task channel based on access level
          if (access === 'EDIT' || access === 'COMMENT') {
            try {
              await db.channelMember.create({
                data: {
                  userId: clientUser.id,
                  channelId: channel.id,
                  isAdmin: false,
                },
              });
            } catch (err) {
              // Ignore if already member
              console.log("Client already a channel member");
            }
          }

          // Create notification
          const notification = await db.notification.create({
            data: {
              type: "TASK_ASSIGNED",
              content: `You have been given ${access} access to task: ${task.title}`,
              userId: clientUser.id,
              taskId: task.id,
            },
          });

          // Emit socket notification
          emitToUser(clientUser.id, "new-notification", notification);

          // Send email notification
          try {
            await sendEmail({
              to: clientUser.email!,
              subject: `🎯 You've been added to: ${task.title}`,
              html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                  <h2 style="color: #2563eb;">🎯 Task Access Granted</h2>
                  <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                    <h3 style="margin-top: 0; color: #111827;">${task.title}</h3>
                    <p><strong>Description:</strong> ${task.description || "No description provided"}</p>
                    <p><strong>Priority:</strong> ${task.priority}</p>
                    <p><strong>Deadline:</strong> ${task.deadline ? new Date(task.deadline).toLocaleString() : "No deadline"}</p>
                    <p><strong>Your Access Level:</strong> <span style="background: #dbeafe; padding: 4px 8px; border-radius: 4px; color: #1e40af;">${access}</span></p>
                  </div>
                  <div style="background: #eff6ff; padding: 16px; border-radius: 8px; margin-bottom: 20px;">
                    <p style="margin: 0 0 12px 0;"><strong>You can:</strong></p>
                    ${access === 'VIEW' ? '<p style="margin: 4px 0;">✓ View task details</p>' : ''}
                    ${access === 'COMMENT' ? '<p style="margin: 4px 0;">✓ View and add comments</p>' : ''}
                    ${access === 'EDIT' ? '<p style="margin: 4px 0;">✓ View, edit, and comment</p>' : ''}
                  </div>
                  <div style="text-align: center; margin: 30px 0;">
                    <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard/tasks/${task.id}" style="background: #2563eb; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
                      View Task
                    </a>
                  </div>
                </div>
              `,
            })
          } catch (e) {
            console.error("Error sending client notification email:", e)
          }

          console.log(`📧 Notification email sent to existing user ${email}`);
          return taskClient;
        }
      });

      await Promise.all(clientInvitationPromises);
      console.log(`✅ Processed ${clientEmails.length} client invitations`);
    }

    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    console.error("Error creating task:", error);
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}

async function generateInvitationToken(email: string, taskId: string) {
  // Implement your token generation logic here
  // This could use JWT or a database-stored token
  // Example:
  const token = crypto.randomBytes(32).toString('hex');
  
  await db.invitationToken.create({
    data: {
      token,
      email,
      taskId,
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7 days
    }
  });

  return token;
}




async function createAutomaticTaskReminders(taskId: string, taskTitle: string, deadline: Date, assigneeIds: string[]) {
  const reminderIntervals = [
    { days: 4, hours: 0, label: "4 days before" },
    { days: 2, hours: 0, label: "2 days before" },
    { days: 1, hours: 0, label: "1 day before" },
    { days: 0, hours: 5, label: "5 hours before" },
    { days: 0, hours: 2, label: "2 hours before" },
  ]

  const reminderPromises = []

  for (const assigneeId of assigneeIds) {
    for (const interval of reminderIntervals) {
      let reminderTime = new Date(deadline)

      if (interval.days > 0) {
        reminderTime = subDays(reminderTime, interval.days)
      }
      if (interval.hours > 0) {
        reminderTime = subHours(reminderTime, interval.hours)
      }

      // Only create reminder if it's in the future
      if (reminderTime > new Date()) {
        reminderPromises.push(
          db.reminder.create({
            data: {
              title: `Task Deadline Reminder: ${taskTitle}`,
              description: `This is an automatic reminder for your task "${taskTitle}" which is due ${interval.label}.`,
              remindAt: reminderTime,
              priority: interval.days === 0 ? "HIGH" : "MEDIUM",
              type: "TASK_DEADLINE",
              creatorId: assigneeId, // System-created, but assigned to user
              assigneeId: assigneeId,
              isAutomatic: true,
            },
          }),
        )
      }
    }
  }

  if (reminderPromises.length > 0) {
    await Promise.all(reminderPromises)
    console.log(`Created ${reminderPromises.length} automatic reminders for task: ${taskTitle}`)
  }
}


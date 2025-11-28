import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { notificationHelperService } from '@/lib/services/notification-helper.service';
import { db } from '@/lib/db';

/**
 * POST /api/notifications/send-task
 * Send push notification when a task is assigned or updated
 */
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { taskId, notificationType, assigneeId } = body;

    if (!taskId || !notificationType) {
      return NextResponse.json(
        { message: 'taskId and notificationType are required' },
        { status: 400 }
      );
    }

    // Fetch task details
    const task = await db.task.findUnique({
      where: { id: taskId },
      include: {
        creator: { select: { id: true, name: true, email: true } },
        assignedTo: { select: { id: true, name: true, email: true } },
      },
    });

    if (!task) {
      return NextResponse.json(
        { message: 'Task not found' },
        { status: 404 }
      );
    }

    let sent = false;

    switch (notificationType) {
      case 'TASK_ASSIGNED': {
        // Notify assigned user
        const recipientId = assigneeId || task.assignedToId;
        if (recipientId) {
          sent = await notificationHelperService.notifyTaskAssignment(
            recipientId,
            task.title,
            task.creator.name || 'Someone',
            task.id
          );
        }
        break;
      }

      case 'TASK_DUE_SOON': {
        // Notify assignee about due date
        if (task.assignedToId) {
          const dueDateStr = task.dueDate?.toLocaleDateString() || 'Soon';
          sent = await notificationHelperService.notifyTaskDueSoon(
            task.assignedToId,
            task.title,
            dueDateStr,
            task.id
          );
        }
        break;
      }

      case 'TASK_STATUS_CHANGED': {
        // Notify assignee about status change
        if (task.assignedToId) {
          sent = await notificationHelperService.notifyTaskStatusChange(
            task.assignedToId,
            task.title,
            task.status || 'Updated',
            task.id,
            (session as any)?.user?.name || 'Someone'
          );
        }
        break;
      }

      default:
        return NextResponse.json(
          { message: 'Unknown notification type' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      message: `${notificationType} notification sent`,
      sent,
    });
  } catch (error) {
    console.error('Error sending task notifications:', error);
    return NextResponse.json(
      { message: 'Failed to send notifications' },
      { status: 500 }
    );
  }
}

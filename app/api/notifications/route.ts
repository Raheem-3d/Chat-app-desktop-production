import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET(req: Request) {
  try {
    const { getSessionOrMobileUser } = await import('@/lib/mobile-auth')
    const user: any = await getSessionOrMobileUser(req as any)
    if (!user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const notifications = await db.notification.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 20,
    })

    return NextResponse.json(notifications)
  } catch (error) {
    console.error("Error fetching notifications:", error)
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  try {
    const { getSessionOrMobileUser } = await import('@/lib/mobile-auth')
    const user: any = await getSessionOrMobileUser(req as any)
    if (!user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { id, read } = await req.json()

    const notification = await db.notification.update({
      where: {
        id,
        userId: user.id,
      },
      data: {
        read,
      },
    })

    return NextResponse.json(notification)
  } catch (error) {
    console.error("Error updating notification:", error)
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 })
  }
}



export async function DELETE(req: Request) {
  try {
    const { getSessionOrMobileUser } = await import('@/lib/mobile-auth')
    const user: any = await getSessionOrMobileUser(req as any)
    if (!user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { id } = await req.json()

    // Delete only if the notification belongs to the logged-in user
    const deletedNotification = await db.notification.deleteMany({
      where: {
        id,
        userId: user.id,
      },
    })

    if (deletedNotification.count === 0) {
      return NextResponse.json(
        { message: "Notification not found or not authorized" },
        { status: 404 }
      )
    }

    return NextResponse.json({ message: "Notification deleted successfully" })
  } catch (error) {
    console.error("Error deleting notification:", error)
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 })
  }
}
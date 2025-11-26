import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: { channelId: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

  const channelId = params.channelId
  const user: any = (session as any).user
    const searchParams = request.nextUrl.searchParams
    const limitParam = searchParams.get("limit")
    const beforeParam = searchParams.get("before")
    const limit = limitParam ? Math.min(500, Math.max(1, parseInt(limitParam, 10) || 0)) : undefined

  const where: any = { channelId, organizationId: user?.organizationId || undefined }
    if (beforeParam) {
      const beforeDate = new Date(beforeParam)
      if (!isNaN(beforeDate.getTime())) where.createdAt = { lt: beforeDate }
    }

    // Get channel messages newest-first; client will normalize order
    const messages = await db.message.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: limit ?? undefined,
      include: {
        sender: { select: { id: true, name: true, email: true, image: true } },
      },
    })

    return NextResponse.json(messages)
  } catch (error) {
    console.error("Error fetching channel messages:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

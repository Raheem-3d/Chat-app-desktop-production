
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { db } from "@/lib/db";
import DirectMessageClient from "@/components/DirectMessageClient";
// import { useSocket } from "@/hooks/use-socket"
// import DirectMessageClient from "@/components/direct-message-client" // your new component

export default async function DirectMessagePage({
  params,
}: {
  params: { userId: string };
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }
  const currentUserId = (session!.user as any).id as string

  const recipient = await db.user.findUnique({
    where: { id: params.userId },
    include: { department: true },
  });

  if (!recipient) notFound();

  const messages = await db.message.findMany({
    where: {
      OR: [
        { senderId: currentUserId, receiverId: params.userId },
        { senderId: params.userId, receiverId: currentUserId },
      ],
    },
    include: { sender: true },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  // The DB returned messages are newest-first because we ordered desc and took 50.
  // Reverse to chronological (oldest -> newest) for the UI.
  const initialMessages = messages.reverse()

  return <DirectMessageClient recipient={recipient} messages={initialMessages} />;
}

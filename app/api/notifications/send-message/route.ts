import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { notificationHelperService } from '@/lib/services/notification-helper.service';

/**
 * POST /api/notifications/send-message
 * Send push notification when a new message is created
 * This should be called after a message is saved to the database
 */
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { messageId } = body;

    if (!messageId) {
      return NextResponse.json(
        { message: 'messageId is required' },
        { status: 400 }
      );
    }

    // Fetch the message details
    const message = await db.message.findUnique({
      where: { id: messageId },
      include: {
        sender: { select: { id: true, name: true, email: true } },
        channel: { select: { id: true, name: true } },
        recipient: { select: { id: true, name: true, email: true } },
      },
    });

    if (!message) {
      return NextResponse.json(
        { message: 'Message not found' },
        { status: 404 }
      );
    }

    let results = { success: 0, failed: 0 };

    // If it's a channel message, notify all channel members except sender
    if (message.channelId) {
      results = await notificationHelperService.notifyChannelMembers(
        message.channelId,
        `New message from ${message.sender.name || 'Someone'}`,
        message.content?.substring(0, 100) || 'New message',
        message.senderId, // exclude sender
        {
          channelId: message.channelId,
          channelName: message.channel?.name,
          messageId: message.id,
          senderId: message.sender.id,
          senderName: message.sender.name,
        }
      );
    }

    // If it's a direct message, notify the recipient
    if (message.recipientId) {
      const sent = await notificationHelperService.notifyNewMessage(
        message.recipientId,
        message.sender.name || message.sender.email || 'Someone',
        undefined,
        undefined
      );
      if (sent) results.success++;
      else results.failed++;
    }

    return NextResponse.json({
      success: true,
      message: 'Notifications sent',
      results,
    });
  } catch (error) {
    console.error('Error sending message notifications:', error);
    return NextResponse.json(
      { message: 'Failed to send notifications' },
      { status: 500 }
    );
  }
}

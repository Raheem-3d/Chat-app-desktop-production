import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { Expo } from 'expo-server-sdk';

export async function POST(req: Request) {
  try {
    // Get user from mobile auth or session
    const { getSessionOrMobileUser } = await import('@/lib/mobile-auth');
    const user = await getSessionOrMobileUser(req as any);

    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { token } = body;

    if (!token) {
      return NextResponse.json(
        { message: 'Push token is required' },
        { status: 400 }
      );
    }

    // Validate token format
    if (!Expo.isExpoPushToken(token)) {
      return NextResponse.json(
        { message: 'Invalid push token format' },
        { status: 400 }
      );
    }

    // Update user's push token
    const updatedUser = await db.user.update({
      where: { id: user.id },
      data: { expoPushToken: token },
      select: {
        id: true,
        email: true,
        expoPushToken: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Push token saved successfully',
      data: updatedUser,
    });
  } catch (error) {
    console.error('Error saving push token:', error);
    return NextResponse.json(
      { message: 'Failed to save push token' },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    // Get user from mobile auth or session
    const { getSessionOrMobileUser } = await import('@/lib/mobile-auth');
    const user = await getSessionOrMobileUser(req as any);

    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Get user's current push token
    const userData = await db.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        email: true,
        expoPushToken: true,
      },
    });

    if (!userData) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: userData,
    });
  } catch (error) {
    console.error('Error fetching push token:', error);
    return NextResponse.json(
      { message: 'Failed to fetch push token' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    // Get user from mobile auth or session
    const { getSessionOrMobileUser } = await import('@/lib/mobile-auth');
    const user = await getSessionOrMobileUser(req as any);

    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Clear user's push token (logout/unsubscribe)
    await db.user.update({
      where: { id: user.id },
      data: { expoPushToken: null },
      select: { id: true },
    });

    return NextResponse.json({
      success: true,
      message: 'Push token cleared successfully',
    });
  } catch (error) {
    console.error('Error clearing push token:', error);
    return NextResponse.json(
      { message: 'Failed to clear push token' },
      { status: 500 }
    );
  }
}

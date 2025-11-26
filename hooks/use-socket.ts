// hooks/useSocket.ts
"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useSession } from "next-auth/react";
import { io, type Socket } from "socket.io-client";
import { toast } from "sonner";
import { tabNotifier } from "@/lib/tabBlinker";
// import { tabNotifier } from "@/utils/tabNotifier"
import dynamic from "next/dynamic";
// Sound Player Class

type ReactionUpdatePayload = {
  messageId: string;
  reactions: { emoji: string; userId: string; userName?: string }[];
};

type BuzzParams = { channelId?: string; receiverId?: string };

class SoundPlayer {
  private audioContext: AudioContext | null = null;
  private initialized = false;
  private buffer: AudioBuffer | null = null;

  async init() {
    if (this.initialized || typeof window === "undefined") return;
    try {
      this.audioContext = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
      const response = await fetch("/mixkit-correct-answer-tone-2870.wav");
      const arrayBuffer = await response.arrayBuffer();
      this.buffer = await this.audioContext.decodeAudioData(arrayBuffer);
      this.initialized = true;
    } catch (e) {
      console.error("Error initializing audio:", e);
    }
  }

  async play() {
    if (!this.initialized) await this.init();
    if (!this.audioContext || !this.buffer) return;
    const source = this.audioContext.createBufferSource();
    source.buffer = this.buffer;
    source.connect(this.audioContext.destination);
    source.start(0);
  }
}

export const soundPlayer = new SoundPlayer();

export function useSocket() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionAttempted, setConnectionAttempted] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [buzzerEnabled, setBuzzerEnabled] = useState(true);

  const prevOnlineUsersRef = useRef<string[]>([]);
  const { data: session } = useSession();
  const LAST_SEEN_STORAGE_KEY = "lastSeenMap";
  const GRACE_MS = 45_000; // 45s grace to avoid flapping
  const offlineTimers = new Map<string, number>(); // userId -> timeoutId

  // state (make sure it's string map, not Date)
  const [lastSeenMap, setLastSeenMap] = useState<Record<string, string>>(() => {
    if (typeof window === "undefined") return {};
    try {
      return JSON.parse(localStorage.getItem(LAST_SEEN_STORAGE_KEY) || "{}");
    } catch {
      return {};
    }
  });

  function persistLastSeen(next: Record<string, string>) {
    localStorage.setItem(LAST_SEEN_STORAGE_KEY, JSON.stringify(next));
  }

  // Request Notification Permission
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission().then((permission) => {
        console.log("Notification permission:", permission);
      });
    }
  }, []);

  useEffect(() => {
    if (!socket) return;
    const handler = (payload: {
      messageId: string;
      reactions: { emoji: string; userId: string; userName?: string }[];
    }) => {
      window.dispatchEvent(
        new CustomEvent("message:reaction-update", { detail: payload })
      );
    };
    socket.on("reaction:update", handler);
    // return () => socket.off("reaction:update", handler)
    return () => {
      socket.off("reaction:update", handler);
    };
  }, [socket]);

  const showNotification = useCallback(
    (title: string, body: string, icon?: string) => {
      // ✅ Electron
      if (
        typeof window !== "undefined" &&
        (window as any).electronAPI?.notify
      ) {
        (window as any).electronAPI.notify(title, body, icon);
        return;
      }

      // ✅ Browser
      if ("Notification" in window && Notification.permission === "granted") {
        const notification = new Notification(title, {
          body,
          icon: icon || "/favicon.ico",
          badge: "/favicon.ico",
        });
        notification.onclick = () => {
          window.focus();
          notification.close();
        };
        setTimeout(() => notification.close(), 7000);
      }
    },
    []
  );

  const playNotificationSound = useCallback(() => {
    if (!buzzerEnabled) return;
    soundPlayer.init();
    try {
      soundPlayer.play();
      if ("vibrate" in navigator) {
        navigator.vibrate([200, 100, 200]);
      }
    } catch (error) {
      console.error("Error playing notification sound:", error);
    }
  }, [buzzerEnabled]);

  const handleNewMessage = useCallback(
    (message: any) => {
      // console.log("📨 Received new message:", message)
      window.dispatchEvent(
        new CustomEvent("socket-message", { detail: message })
      );
      
      // Get current user ID from session
      const currentUserId = (session as any)?.user?.id;
      
      // Only play sound and show notifications if the message is NOT from the current user
      const isOwnMessage = message.senderId === currentUserId;
      
      if (!isOwnMessage) {
        playNotificationSound();
      }

      const notificationTitle = `New message from ${message.sender.name}`;
      const notificationBody = message.content || "Sent a file";

      // Handle tab/window states - only for messages from others
      if (!isOwnMessage) {
        if (document.visibilityState === "hidden") {
          if (tabNotifier.checkOtherTabs()) {
            // Blink in the existing tab
            tabNotifier.startNotification(notificationTitle);
          } else {
            // Open new window
            tabNotifier.focusOrOpenApp(
              `/messages/${message.channelId || message.sender.id}`
            );
          }
        } else if (!document.hasFocus()) {
          // Tab is visible but not focused
          tabNotifier.startNotification(notificationTitle);
        }
      }
    },
    [playNotificationSound, showNotification, session]
  );

  useEffect(() => {
    if (!socket) return;

    const onBuzz = (payload: {
      channelId?: string;
      fromUserId?: string;
      message?: string;
    }) => {
      const msg = payload?.message || "Buzz!";
      try {
        playNotificationSound();
      } catch {}

      // 🍞 toast
      toast.info(msg);
      
      // 🎯 target URL banayein
      const targetUrl = payload?.channelId
        ? `/dashboard/channels/${payload.channelId}`
        : `/dashboard/messages/${payload.fromUserId || ""}`;

      // On Electron desktop, request native buzz (restores window + notification + taskbar flash)
      if (typeof window !== "undefined" && (window as any).electronAPI?.buzz) {
        try {
          (window as any).electronAPI.buzz({ title: "Buzz!", body: msg });
        } catch {}
      } else {
        // 🪟 agar tab hidden ya unfocused hai => SW notification (click => focus/open)
        if (document.visibilityState === "hidden" || !document.hasFocus()) {
          showBuzzNotification("Buzz!", msg, targetUrl);
          // optional: title blink too
          tabNotifier.startNotification("Buzz!");
        }
      }

      // 📳 shake animation (body ya document)
      document.documentElement.classList.add("shake");
      setTimeout(() => document.documentElement.classList.remove("shake"), 600);
    };

    socket.on("buzz", onBuzz);
    return () => {
      socket.off("buzz", onBuzz);
    };
  }, [socket, playNotificationSound]);

  async function showBuzzNotification(
    title: string,
    body: string,
    url: string
  ) {
    if (!("serviceWorker" in navigator) || !("Notification" in window)) return;

    if (Notification.permission === "default") {
      try {
        await Notification.requestPermission();
      } catch {}
    }
    if (Notification.permission !== "granted") return;
    const reg = await navigator.serviceWorker.ready;
    await reg.showNotification(title, {
      body,
      tag: "buzz",
      requireInteraction: true, // stays until user acts
      data: { url }, // SW uses this to open/focus
      icon: "/icons/icon-192.png", // put real icon files
      badge: "/icons/badge.png",
      renotify: true,
    });
  }

  const toastIdFor = (n: any) => {
    if (n.type === "CHANNEL_MESSAGE" && n.messageId)
      return `chmsg:${n.messageId}`;
    if (n.type === "DIRECT_MESSAGE" && n.messageId) return `dm:${n.messageId}`;
    if (n.type === "TASK_ASSIGNED" && (n.taskId || n.id))
      return `task:${n.taskId ?? n.id}`;
    if (n.type === "CHANNEL" && (n.channelId || n.id))
      return `ch:${n.channelId ?? n.id}`;
     if (n.type === "CHANNEL_INVITE" && (n.channelId || n.id))
      return `ch:${n.channelId ?? n.id}`;
    if (n.type === "USER" && (n.senderId || n.id))
      return `usr:${n.senderId ?? n.id}`;
    if (n.type === "REMINDER" && n.id) return `rem:${n.id}`;
    // final fallback (content + type)
    return `${n.type}:${n.content}`;
  };

  const handleNewNotification = useCallback(
    (notification: any) => {
      window.dispatchEvent(
        new CustomEvent("socket-notification", { detail: notification })
      );
      playNotificationSound();

      const id = toastIdFor(notification);

      // console.log(notification,'notification llllllllll')

      toast.info(notification.content, {
        id,
        duration: 5000,
        action:
          notification.channelId || notification.userId || notification.taskId
            ? {
                label: "View",
                onClick: () => {
                  if (
                    notification.type === "CHANNEL_MESSAGE" &&
                    notification.channelId
                  ) {
                    window.location.href = `/dashboard/channels/${notification.channelId}`;
                  } else if (notification.type === "DIRECT_MESSAGE") {
                    if (
                      notification.senderId !== notification.userId &&
                      notification.messageId
                    ) {
                      window.location.href = `/dashboard/messages/${notification.messageId}`;
                    } else if (notification.receiverId) {
                      window.location.href = `/dashboard/messages/${notification.receiverId}`;
                    }
                  } else if (notification.type === "TASK_ASSIGNED") {
                    const taskId = notification.taskId || notification.id;
                    if (taskId)
                      window.location.href = `/dashboard/tasks/${taskId}`;
                  } else if (notification.type === "CHANNEL") {
                    const channelId = notification.channelId || notification.id;
                    if (channelId)
                      window.location.href = `/dashboard/channels/${channelId}`;
                  }else if (notification.type === "CHANNEL_INVITE") {
                    const channelId = notification.channelId || notification.id;
                    if (channelId)
                      window.location.href = `/dashboard/channels/${channelId}`;
                  } else if (notification.type === "USER") {
                    const userId = notification.senderId || notification.id;
                    if (userId)
                      window.location.href = `/dashboard/messages/${userId}`;
                  } else if (notification.type === "REMINDER") {
                    window.location.href = `/dashboard/reminders`;
                  } else {
                    window.location.href = `/dashboard`;
                  }
                },
              }
            : undefined,
      });

      if (document.visibilityState === "hidden") {
        showNotification("New Notification", notification.content);
      }
    },
    [playNotificationSound, showNotification]
  );

  useEffect(() => {
    if (!session?.user?.id) return;

    console.log("🔌 Initializing Socket.io connection...");
    setConnectionAttempted(true);

    const initializeAndConnect = async () => {
      try {
        await fetch("/api/socket/init");
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const socketInstance = io({
          path: "/api/socket",
          transports: ["polling"],
          forceNew: true,
          timeout: 10000,
        });

        socketInstance.on("connect", () => {
          setIsConnected(true);
          setSocket(socketInstance);
          socketInstance.emit("user-join", session.user.id);
          // toast.success("Connected to real-time updates", { duration: 2000 })
        });

        socketInstance.on("connect_error", (error) => {
          console.error("❌ Socket.io connection error:", error);
          setIsConnected(false);
          toast.error("Failed to connect to real-time updates", {
            description: "Some features may not work properly",
            duration: 5000,
          });
        });

        socketInstance.on("disconnect", (reason) => {
          console.log("🔌 Socket.io disconnected:", reason);
          setIsConnected(false);
          // toast.warning("Disconnected from real-time updates", { duration: 3000 })
        });

        socketInstance.on("users-online", (users: string[]) => {
          const prevUsers = prevOnlineUsersRef.current;

          // 1) Any user reported online now: cancel pending offline timer
          for (const id of users) {
            const t = offlineTimers.get(id);
            if (t) {
              clearTimeout(t);
              offlineTimers.delete(id);
            }
          }

          const maybeOffline = prevUsers.filter((id) => !users.includes(id));

          for (const id of maybeOffline) {
            if (offlineTimers.has(id)) continue; // already scheduled
            const timeoutId = window.setTimeout(() => {
              // After grace window, if still not online, stamp lastSeen
              if (!prevOnlineUsersRef.current.includes(id)) {
                const iso = new Date().toISOString();
                setLastSeenMap((prev) => {
                  const next = { ...prev, [id]: iso };
                  persistLastSeen(next);
                  return next;
                });
              }
              offlineTimers.delete(id);
            }, GRACE_MS);
            offlineTimers.set(id, timeoutId);
          }

          // 3) Update online list and snapshot for next tick
          setOnlineUsers(users);
          prevOnlineUsersRef.current = users;
        });

        socketInstance.on("new-message", handleNewMessage);

        socketInstance.on("new-notification", handleNewNotification);

        socketInstance.on(
          "message-status-updated",
          ({ messageId, userId, status }) => {
            // legacy event for some consumers
            window.dispatchEvent(
              new CustomEvent("update-message-status", {
                detail: { messageId, userId, status },
              })
            );
            // standard event other components listen for
            window.dispatchEvent(
              new CustomEvent("message:status-update", {
                detail: { messageId, status },
              })
            );
          }
        );

        socketInstance.on("user-last-seen", ({ userId, timestamp }) => {
          window.dispatchEvent(
            new CustomEvent("update-user-last-seen", {
              detail: { userId, timestamp },
            })
          );
        });

        // socketInstance.on("buzz:sent", ({ userId }) => {
        //   if (userId !== session?.user?.id) {
        //     toast.success("New buzz received 🚀");
        //   }
        // })

        return socketInstance;
      } catch (error) {
        console.error("Failed to initialize Socket.io:", error);
        setIsConnected(false);
        return null;
      }
    };

    const socketPromise = initializeAndConnect();

    return () => {
      socketPromise.then((socketInstance) => {
        if (socketInstance) {
          socketInstance.emit("user-offline", session.user.id);
          socketInstance.off("new-message", handleNewMessage);
          socketInstance.off("new-notification", handleNewNotification);
          socketInstance.disconnect();
        }
      });
    };
  }, [session?.user?.id, handleNewMessage, handleNewNotification]);

  const joinChannel = useCallback(
    (channelId: string) => {
      if (socket && isConnected) {
        socket.emit("join-channel", channelId);
        console.log("📺 Joined channel:", channelId);
      }
    },
    [socket, isConnected]
  );

  const joinMessageRoom = useCallback(
    (messageId: string) => {
      socket?.emit("join-message", { messageId });
    },
    [socket]
  );

  const leaveChannel = useCallback(
    (channelId: string) => {
      if (socket && isConnected) {
        socket.emit("leave-channel", channelId);
        console.log("📺 Left channel:", channelId);
      }
    },
    [socket, isConnected]
  );

  const sendMessage = useCallback(
    (message: any) => {
      if (socket && isConnected) {
        socket.emit("send-message", message);
        console.log("📨 Sent message via socket:", message.id);
      }
    },
    [socket, isConnected]
  );

  const sendNotification = useCallback(
    (notification: any) => {
      if (socket && isConnected) {
        socket.emit("send-notification", notification);
        console.log("🔔 Sent notification via socket:", notification.id);
      }
    },
    [socket, isConnected]
  );

  const toggleBuzzer = useCallback(() => {
    setBuzzerEnabled((prev) => !prev);
    toast.info(`Buzzer ${buzzerEnabled ? "disabled" : "enabled"}`);
  }, [buzzerEnabled]);

  // In your useSocket hook
  const addReaction = useCallback(
    async (messageId: string, emoji: string): Promise<boolean> => {
      if (!socket || !isConnected || !session?.user?.id) return false;
      return new Promise((resolve) => {
        socket.emit(
          "add-reaction",
          {
            messageId,
            emoji,
            userId: session.user.id,
            userName: session.user.name || "Unknown",
          },

          (response: {
            success: boolean;
            reactions?: ReactionUpdatePayload["reactions"];
          }) => {
            if (response.success && response.reactions) {
              window.dispatchEvent(
                new CustomEvent("message:reaction-update", {
                  detail: { messageId, reactions: response.reactions },
                })
              );
            }
            resolve(response.success);
          }
        );
      });
    },
    [socket, isConnected, session?.user?.id, session?.user?.name]
  );

  const removeReaction = useCallback(
    async (messageId: string, emoji: string): Promise<boolean> => {
      if (!socket || !isConnected || !session?.user?.id) return false;
      return new Promise((resolve) => {
        socket.emit(
          "remove-reaction",
          { messageId, emoji, userId: session.user.id },
          (response: {
            success: boolean;
            reactions?: ReactionUpdatePayload["reactions"];
          }) => {
            if (response.success && response.reactions) {
              window.dispatchEvent(
                new CustomEvent("message:reaction-update", {
                  detail: { messageId, reactions: response.reactions },
                })
              );
            }
            resolve(response.success);
          }
        );
      });
    },
    [socket, isConnected, session?.user?.id]
  );

  const sendBuzz = useCallback(
    ({ channelId, receiverId }: BuzzParams) => {
      if (!socket || !isConnected || !session?.user?.id)
        return Promise.resolve(false);

      // safety timeout so UI spinner kabhi atka na rahe
      return new Promise<boolean>((resolve) => {
        let settled = false;
        const t = setTimeout(() => {
          if (!settled) resolve(false);
        }, 8000);

        socket.emit(
          "buzz:send",
          { channelId, receiverId },
          (resp: { ok: boolean; reason?: string }) => {
            settled = true;
            clearTimeout(t);
            if (!resp?.ok && resp?.reason === "rate_limited") {
              toast.error("Too many buzzes. Try later.");
            }
            resolve(!!resp?.ok);
          }
        );
      });
    },
    [socket, isConnected, session?.user?.id]
  );

  return {
    socket,
    isConnected,
    connectionAttempted,
    onlineUsers,
    lastSeenMap,
    buzzerEnabled,
    toggleBuzzer,
    joinChannel,
    leaveChannel,
    sendMessage,
    sendNotification,
    addReaction,
    removeReaction,
    joinMessageRoom,
    sendBuzz,
  };
}

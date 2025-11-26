// main.js (defensive, debug-friendly)
const {
  app,
  BrowserWindow,
  Notification,
  ipcMain,
  Tray,
  Menu,
  dialog,
  clipboard,
  nativeImage,
  net,
} = require("electron");

const path = require("path");
const fs = require("fs");
const { session } = require("electron");
const { autoUpdater } = require("electron-updater");

let mainWindow;
let tray = null;
let bounceId = null;
let isQuitting = false;
let splash = null; // ensure splash is declared
let updateInterval = null;

function log(...args) {
  console.log(new Date().toISOString(), ...args);
}

app.on("before-quit", async () => {
  try {
    const cookies = await session.defaultSession.cookies.get({});
    console.log("COOKIES BEFORE QUIT:", cookies);
  } catch (e) {
    console.error(e);
  }
});

// Global error handlers
process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION:", err && err.stack ? err.stack : err);
});
process.on("unhandledRejection", (reason) => {
  console.error("UNHANDLED REJECTION:", reason);
});

// Ensure a single running instance; focus existing on second launch
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
} else {
  app.on("second-instance", (event, argv, workingDirectory) => {
    // Someone tried to run a second instance, focus/restore existing window
    showMainWindow();
  });
}

function createSplash() {
  // Small frameless splash with a simple CSS spinner (data URL so no extra file)
  const splashHtml = `
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>Loading…</title>
        <style>
          html,body{height:100%;margin:0;display:flex;align-items:center;justify-content:center;background:#fff;font-family:system-ui;}
          .box{display:flex;flex-direction:column;align-items:center;gap:12px}
          .spinner{
            width:56px;height:56px;border-radius:50%;border:6px solid rgba(0,0,0,0.08);border-top-color:rgba(0,0,0,0.6);
            animation:spin 1s linear infinite;
          }
          @keyframes spin{to{transform:rotate(360deg)}}
          .text{font-size:13px;color:#333}
        </style>
      </head>
      <body>
        <div class="box">
          <div class="spinner" aria-hidden="true"></div>
          <div class="text">Loading application…</div>
        </div>
      </body>
    </html>
  `;
  splash = new BrowserWindow({
    width: 360,
    height: 220,
    frame: false,
    alwaysOnTop: true,
    resizable: false,
    movable: true,
    center: true,
    show: true,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  splash.loadURL(
    "data:text/html;charset=utf-8," + encodeURIComponent(splashHtml)
  );
}

function createWindow() {
  try {
    // first show splash
    createSplash();

    const preloadPath = path.join(__dirname, "preload.js");
    if (!fs.existsSync(preloadPath)) {
      console.warn(
        "preload.js not found at",
        preloadPath,
        "renderer preload will not be available"
      );
    }

    // create main window but keep it hidden (show: false)
    mainWindow = new BrowserWindow({
      width: 1200,
      height: 800,
      show: false, // important: hidden until loaded
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        preload: preloadPath,
        webSecurity: false,
        partition: "persist:jamure",
      },
    });

    // Log cookies and localStorage after load (same as yours)
    mainWindow.webContents.on("did-finish-load", async () => {
      try {
        const cookies = await session
          .fromPartition("persist:jamure")
          .cookies.get({});
        console.log("cookies after load:", cookies);
        const ls = await mainWindow.webContents.executeJavaScript(
          "JSON.stringify(localStorage)"
        );
        console.log("localStorage after load:", ls);
      } catch (e) {
        console.error(e);
      }

      // Close splash and show main window
      try {
        if (splash && !splash.isDestroyed()) {
          splash.close();
          splash = null;
        }
      } catch (err) {
        console.warn("could not close splash:", err);
      }

      // now show the main window
      if (mainWindow && !mainWindow.isDestroyed() && !mainWindow.isVisible()) {
        mainWindow.show();
      }
    });

    // handle failed loads (network error etc)
    mainWindow.webContents.on(
      "did-fail-load",
      (event, errorCode, errorDescription, validatedURL, isMainFrame) => {
        console.error(
          "did-fail-load:",
          errorCode,
          errorDescription,
          validatedURL,
          isMainFrame
        );
        // you can show an error page in mainWindow, or keep splash and show a message
        // simplest: show mainWindow so user can see devtools/errors
        if (mainWindow && !mainWindow.isVisible()) mainWindow.show();
        if (splash && !splash.isDestroyed()) {
          splash.close();
          splash = null;
        }
      }
    );

    // optional: open devtools in dev mode
    if (!app.isPackaged) {
      mainWindow.webContents.openDevTools({ mode: "detach" });
    }

    const urlToLoad = "http://10.0.9.63:3000";
    console.log("loading URL:", urlToLoad);
    mainWindow.loadURL(urlToLoad).catch((err) => {
      console.error("loadURL rejected:", err);
      // show window so you can see errors
      if (mainWindow && !mainWindow.isVisible()) mainWindow.show();
      if (splash && !splash.isDestroyed()) {
        splash.close();
        splash = null;
      }
    });

    // Window focus/blur handlers
    mainWindow.on("focus", () => {
      console.log("mainWindow focused");
      stopAttention();
    });

    mainWindow.on("blur", () => {
      console.log("mainWindow blurred");
    });

    // Prefer normal minimize (keep in taskbar). If you want close-to-tray only, keep close handler below.
    mainWindow.on("minimize", () => {
      try {
        // Ensure it remains in the taskbar
        mainWindow.setSkipTaskbar(false);
      } catch (err) {
        console.warn("minimize handler error:", err);
      }
    });

    // Close-to-tray: comment out to actually quit on close, or keep to hide-to-tray
    mainWindow.on("close", (e) => {
      if (!isQuitting) {
        e.preventDefault();
        try {
          // Keep visible in taskbar instead of hiding completely
          mainWindow.minimize();
          mainWindow.setSkipTaskbar(false);
        } catch (err) {
          console.warn("close handler error:", err);
        }
      }
    });

    mainWindow.on("closed", () => {
      console.log("mainWindow closed");
      mainWindow = null;
    });
  } catch (e) {
    console.error("createWindow failed:", e && e.stack ? e.stack : e);
    if (splash && !splash.isDestroyed()) {
      splash.close();
      splash = null;
    }
  }
}

function createTray() {
  log("createTray called");
  try {
    const iconPath = path.join(__dirname, "public", "Desktopicon.ico");

    if (!fs.existsSync(iconPath)) {
      console.warn(
        "Tray icon not found at",
        iconPath,
        "- skipping tray creation to avoid crashes"
      );
      return;
    }

    tray = new Tray(iconPath);

    const contextMenu = Menu.buildFromTemplate([
      { label: "Open App", click: () => showMainWindow() },
      {
        label: "Quit",
        click: () => {
          isQuitting = true;
          app.quit();
        },
      },
    ]);
    tray.setToolTip("Jamure App");
    tray.setContextMenu(contextMenu);
    tray.on("double-click", () => showMainWindow());
    tray.on("click", () => showMainWindow());
  } catch (e) {
    // don't let tray errors kill the app
    console.error(
      "createTray failed (continuing without tray):",
      e && e.stack ? e.stack : e
    );
  }
}

function showMainWindow() {
  log("showMainWindow called");
  try {
    if (!mainWindow) {
      createWindow(true);
    } else {
      if (mainWindow.isMinimized()) mainWindow.restore();
      if (!mainWindow.isVisible()) mainWindow.show();
      // Ensure it appears in the taskbar again
      try { mainWindow.setSkipTaskbar(false); } catch { }
      mainWindow.focus();
    }
    stopAttention();
  } catch (e) {
    console.error("showMainWindow error:", e && e.stack ? e.stack : e);
  }
}

// Restore or show and optionally flash if not focused
function restoreOrRevealWindow() {
  try {
    if (!mainWindow || mainWindow.isDestroyed()) {
      createWindow();
      return;
    }
    if (mainWindow.isMinimized()) mainWindow.restore();
    if (!mainWindow.isVisible()) mainWindow.show();
    try { mainWindow.setSkipTaskbar(false); } catch { }
  } catch (e) {
    console.warn("restoreOrRevealWindow error", e);
  }
}

function startAttention() {
  log("startAttention");
  if (process.platform === "darwin") {
    try {
      bounceId = app.dock && app.dock.bounce && app.dock.bounce();
    } catch (e) {
      console.warn("dock.bounce failed", e);
    }
  } else {
    if (mainWindow) {
      try {
        mainWindow.flashFrame(true);
      } catch (e) {
        console.warn(e);
      }
    } else {
      createWindow(false);
      if (mainWindow) {
        try {
          mainWindow.flashFrame(true);
        } catch (e) {
          console.warn(e);
        }
      }
    }
  }
}

function stopAttention() {
  log("stopAttention");
  if (process.platform === "darwin") {
    try {
      if (bounceId !== null) {
        app.dock.cancelBounce(bounceId);
        bounceId = null;
      }
    } catch (e) {
      console.warn(e);
    }
  } else {
    if (mainWindow) {
      try {
        mainWindow.flashFrame(false);
      } catch (e) {
        console.warn(e);
      }
    }
  }
}

ipcMain.on("show-notification", (event, { title, body, icon }) => {
  log("ipc show-notification", title);
  const notif = new Notification({
    title: title || "Notification",
    body: body || "",
    icon: icon || path.join(__dirname, "public", "Desktopicon.ico"),
  });
  notif.on("click", () => {
    showMainWindow();
  });
  notif.show();

  const needsAttention = !mainWindow || !mainWindow.isVisible();
  if (needsAttention) startAttention();
});

// Unified buzz handler: show/restore, notify, and request attention if not focused
function handleBuzz({ title = "Buzz", body = "You have an important message.", icon } = {}) {
  try {
    const focused = mainWindow && mainWindow.isFocused && mainWindow.isFocused();
    const visible = mainWindow && mainWindow.isVisible && mainWindow.isVisible();

    // Ensure the app is visible or created
    if (!mainWindow || mainWindow.isDestroyed() || !visible) {
      restoreOrRevealWindow();
    }

    // If not focused, request attention
    if (!focused) {
      startAttention();
    }

    // Show a system notification
    const notif = new Notification({
      title,
      body,
      icon: icon || path.join(__dirname, "public", "Desktopicon.ico"),
      silent: false,
    });
    notif.on("click", () => showMainWindow());
    notif.show();
  } catch (e) {
    console.error("handleBuzz error", e);
  }
}

// Allow buzz from renderer
ipcMain.on("buzz", (event, payload) => handleBuzz(payload || {}));

// Allow buzz from the app (e.g., background timers, sockets in main)
app.on("buzz", (payload) => handleBuzz(payload || {}));

function enableAutoLaunch() {
  log(
    "enableAutoLaunch called, packaged=",
    app.isPackaged,
    "execPath=",
    process.execPath
  );
  try {
    if (!app.isPackaged) {
      console.warn(
        "Skipping auto-launch in dev mode to avoid starting electron.exe at login."
      );
      return;
    }

    if (process.platform === "win32") {
      app.setLoginItemSettings({
        openAtLogin: true,
        path: process.execPath,
        args: ["--background-start"],
      });
    } else {
      app.setLoginItemSettings({ openAtLogin: true });
    }
  } catch (e) {
    console.warn("enableAutoLaunch failed", e);
  }
}

ipcMain.handle("copy-text", (event, text) => {
  try {
    clipboard.writeText(text);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle("copy-image", async (event, imageUrl) => {
  try {
    // Handle file:// URLs
    if (imageUrl.startsWith("file://")) {
      const image = nativeImage.createFromPath(imageUrl.replace("file://", ""));
      if (!image.isEmpty()) {
        clipboard.writeImage(image);
        return { success: true };
      }
    }

    // Handle http/https URLs and base64
    if (imageUrl.startsWith("http") || imageUrl.startsWith("data:")) {
      const response = await net.fetch(imageUrl);
      const buffer = await response.arrayBuffer();
      const image = nativeImage.createFromBuffer(Buffer.from(buffer));

      if (!image.isEmpty()) {
        clipboard.writeImage(image);
        return { success: true };
      }
    }

    return { success: false, error: "Invalid image format" };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

app.whenReady().then(() => {
  log("app.whenReady start");
  const startedInBackground = process.argv.includes("--background-start");

  // On Windows, set AppUserModelId so notifications display with app identity
  if (process.platform === "win32") {
    try { app.setAppUserModelId("com.jamure.chatapp"); } catch { }
  }

  // create window and tray
  createWindow(startedInBackground ? false : true);
  createTray();
  enableAutoLaunch();

  if (!startedInBackground) {
    if (mainWindow && !mainWindow.isVisible()) mainWindow.show();
  }

  // --------- AUTO-UPDATER START ---------
  const isDev = process.env.NODE_ENV === "development" || !app.isPackaged;
  if (!isDev) {
    // Only run auto-update in production
    try {
      autoUpdater.autoDownload = false; // prompt before download

      // Forward updater events to renderer for optional UI
      const sendToRenderer = (channel, payload) => {
        try {
          if (mainWindow && mainWindow.webContents) {
            mainWindow.webContents.send(channel, payload);
          }
        } catch { }
      };

      autoUpdater.on("checking-for-update", () => {
        log("Updater: checking-for-update");
        sendToRenderer("updater:checking", {});
      });
      autoUpdater.on("update-available", (info) => {
        log("Updater: update-available", info && info.version);
        sendToRenderer("updater:available", info);
        // Native prompt for download
        const result = dialog.showMessageBoxSync(mainWindow, {
          type: "info",
          buttons: ["Download", "Later"],
          title: "Update Available",
          message: `Version ${info.version} is available. Download now?`,
        });
        if (result === 0) autoUpdater.downloadUpdate();
      });
      autoUpdater.on("update-not-available", (info) => {
        log("Updater: update-not-available");
        sendToRenderer("updater:not-available", info);
      });
      autoUpdater.on("download-progress", (progress) => {
        sendToRenderer("updater:download-progress", progress);
      });
      autoUpdater.on("update-downloaded", (info) => {
        log("Updater: update-downloaded", info && info.version);
        sendToRenderer("updater:downloaded", info);
        const result = dialog.showMessageBoxSync(mainWindow, {
          type: "info",
          buttons: ["Install & Restart", "Later"],
          title: "Update Ready",
          message: `Version ${info.version} downloaded. Install now?`,
        });
        if (result === 0) autoUpdater.quitAndInstall();
      });
      autoUpdater.on("error", (err) => {
        log("Updater: error", err);
        sendToRenderer("updater:error", { message: String(err) });
      });

      // Initial check on startup
      autoUpdater.checkForUpdates();

      // Periodic checks (every 4 hours)
      updateInterval = setInterval(() => {
        try { autoUpdater.checkForUpdates(); } catch { }
      }, 4 * 60 * 60 * 1000);
    } catch (e) {
      log("Auto-updater setup failed:", e);
    }
  }
  // --------- AUTO-UPDATER END ---------

  // Attach will-download after ready (safer)
  try {
    session.defaultSession.on("will-download", (event, item, webContents) => {
      try {
        const url = item.getURL();
        const filename = item.getFilename();
        log("will-download", { url, filename });

        const savePath = path.join(app.getPath("downloads"), filename);
        item.setSavePath(savePath);

        try {
          webContents.send("download-started", { filename, url, savePath });
        } catch (e) { }

        item.on("updated", (e, state) => {
          if (state === "interrupted") {
            log("Download interrupted for", filename);
            try {
              webContents.send("download-progress", {
                filename,
                state: "interrupted",
              });
            } catch (e) { }
          } else if (state === "progressing") {
            if (item.isPaused()) {
              log("Download paused:", filename);
              try {
                webContents.send("download-progress", {
                  filename,
                  state: "paused",
                });
              } catch (e) { }
            } else {
              const received = item.getReceivedBytes();
              const total = item.getTotalBytes();
              try {
                webContents.send("download-progress", {
                  filename,
                  received,
                  total,
                });
              } catch (e) { }
            }
          }
        });

        item.once("done", (e, state) => {
          if (state === "completed") {
            log("Download completed:", savePath);
            try {
              webContents.send("download-done", {
                filename,
                savePath,
                success: true,
              });
            } catch (e) { }
          } else {
            log("Download failed:", state);
            try {
              webContents.send("download-done", {
                filename,
                savePath,
                success: false,
                state,
              });
            } catch (e) { }
          }
        });
      } catch (err) {
        console.error("Error in will-download handler", err);
      }
    });
  } catch (e) {
    console.error(
      "Failed to attach will-download:",
      e && e.stack ? e.stack : e
    );
  }

  log("app.whenReady done");
});

// simple ipc to trigger download
ipcMain.on("download-file", (event, { url, filename }) => {
  log("IPC download-file received", { url, filename });
  if (mainWindow && mainWindow.webContents) {
    mainWindow.webContents.downloadURL(url);
  } else {
    log("No mainWindow available to start download");
    try {
      event.sender.send("download-done", {
        filename,
        savePath: null,
        success: false,
        state: "no-main-window",
      });
    } catch (e) { }
  }
});

ipcMain.handle("save-blob", async (event, { name, bufferBase64 }) => {
  try {
    const { canceled, filePath } = await dialog.showSaveDialog({
      title: "Save file",
      defaultPath: path.join(app.getPath("downloads"), name || "file"),
    });
    if (canceled || !filePath) return { success: false, reason: "canceled" };

    const buffer = Buffer.from(bufferBase64, "base64");
    fs.writeFileSync(filePath, buffer);
    console.log("save-blob: wrote file to", filePath);
    return { success: true, filePath };
  } catch (err) {
    console.error("save-blob failed", err);
    return { success: false, error: String(err) };
  }
});

ipcMain.on("renderer-ready", () => {
  if (splash && !splash.isDestroyed()) splash.close();
  if (mainWindow && !mainWindow.isVisible()) mainWindow.show();
});

app.on("activate", () => {
  log("app activate");
  if (!mainWindow) createWindow(true);
  else showMainWindow();
});

// Consolidate before-quit handler
app.on("before-quit", () => {
  log("before-quit");
  isQuitting = true;
});

app.on("window-all-closed", () => {
  log("window-all-closed, isQuitting=", isQuitting);
  if (process.platform !== "darwin" && isQuitting) {
    app.quit();
  }
});

// -------- IPC: Updater controls from renderer --------
ipcMain.handle("updater:check", async () => {
  try {
    await autoUpdater.checkForUpdates();
    return { ok: true };
  } catch (e) {
    return { ok: false, error: String(e) };
  }
});

ipcMain.handle("updater:download", async () => {
  try {
    await autoUpdater.downloadUpdate();
    return { ok: true };
  } catch (e) {
    return { ok: false, error: String(e) };
  }
});

ipcMain.handle("updater:install", async () => {
  try {
    // quitAndInstall will not return
    autoUpdater.quitAndInstall();
    return { ok: true };
  } catch (e) {
    return { ok: false, error: String(e) };
  }
});

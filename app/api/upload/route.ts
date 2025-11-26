

// app/api/upload/route.ts (or similar)
// Requires Node.js server runtime (default) — not edge runtime
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { mkdir } from "fs/promises";
import { createWriteStream } from "fs";
import { join, resolve } from "path";
import { v4 as uuidv4 } from "uuid";
import { pipeline } from "stream/promises";

const MAX_FILES = 50;
const LOCAL_MAX_BYTES = 5 * 1024 * 1024 * 1024; // 5GB

export async function POST(req: Request) {
  try {
    // Require session
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const formData = await req.formData();

    let incoming = formData.getAll("files") as File[];
    if (incoming.length === 0) {
      const single = formData.get("file") as File | null;
      if (single) incoming = [single];
    }

    if (incoming.length === 0) {
      return NextResponse.json({ success: false, message: "No file(s) provided" }, { status: 400 });
    }
    if (incoming.length > MAX_FILES) {
      return NextResponse.json({ success: false, message: `Too many files. Max ${MAX_FILES} per request.` }, { status: 400 });
    }

    const perFileLimit = LOCAL_MAX_BYTES;
    const oversized = incoming.filter(f => f.size > perFileLimit);
    if (oversized.length) {
      return NextResponse.json({
        success: false,
        message: `Some files exceed the size limit (5GB).`,
        details: oversized.map(f => ({ name: f.name, size: f.size })),
      }, { status: 400 });
    }

    const uploadsDir = resolve(process.cwd(), "public", "uploads");
    await mkdir(uploadsDir, { recursive: true });

    const origin = new URL('http://10.0.9.63:3000/').origin;

    const results = await Promise.allSettled(incoming.map(async (file) => {
      const ext = file.name.includes('.') ? file.name.split('.').pop()?.toLowerCase() ?? 'bin' : 'bin';
      const fileName = `${uuidv4()}.${ext}`;
      const outPath = join(uploadsDir, fileName);

      // stream from the incoming File to disk (no full buffer)
      const readStream = (file as any).stream(); // File.stream() — web standard
      const writeStream = createWriteStream(outPath, { flags: 'w' });

      // pipeline will throw on errors
      await pipeline(readStream, writeStream);

      const fileUrl = `${origin}/u/${fileName}`;
      console.log('Wrote file to:', outPath);

      return {
        fileUrl,
        fileName: file.name,
        fileType: file.type || "application/octet-stream",
        localName: fileName,
        size: file.size,
      };
    }));

    const files = results.filter(r => r.status === "fulfilled").map((r: any) => r.value);
    const failed = results.filter(r => r.status === "rejected").map((r: any, idx) => ({
      name: incoming[idx]?.name ?? 'unknown',
      reason: r.reason?.message ?? 'Upload failed'
    }));

    const status = failed.length === incoming.length ? 500 : 200;
    return NextResponse.json({ success: failed.length === 0, files, failed }, { status });
  } catch (error) {
    console.error("Error uploading files:", error);
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}

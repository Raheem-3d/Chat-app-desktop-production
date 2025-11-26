// app/u/[...path]/route.ts
import { NextResponse } from 'next/server';
import { resolve } from 'path';
import { createReadStream, statSync, existsSync } from 'fs';
import { lookup } from 'mime-types';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

function safeJoin(base: string, parts: string[]) {
  const p = require('path').resolve(base, ...parts);
  if (!p.startsWith(base)) throw new Error('Path traversal blocked');
  return p;
}

export async function GET(
  _req: Request,
  { params }: { params: { path: string[] } }
) {
  try {
    const segments = (params.path || []).filter(Boolean);
    const base = resolve(process.cwd(), 'public', 'uploads');
    const filePath = safeJoin(base, segments);

    console.log('Serving upload:', segments.join('/')); // 🔎 debug

    if (!existsSync(filePath)) {
      return new NextResponse('Not found', { status: 404 });
    }

    const stat = statSync(filePath);
    const stream = createReadStream(filePath);
    const mime = (lookup(filePath) as string) || 'application/octet-stream';

    return new NextResponse(stream as any, {
      status: 200,
      headers: {
        'Content-Type': mime,
        'Content-Length': String(stat.size),
        'Cache-Control': 'public, max-age=3600, immutable',
      },
    });
  } catch (e) {
    console.error('Upload serve error:', e);
    return new NextResponse('Not found', { status: 404 });
  }
}

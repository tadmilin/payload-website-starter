import { NextResponse } from 'next/server';
import payload from 'payload';
import { initPayload } from '@/lib/payload';
import { corsHeaders } from '@/lib/cors';
import type { BasePayload } from 'payload';

// ขยาย type ให้ global object เพื่อรองรับ payload
declare global {
  // eslint-disable-next-line no-var
  var payload: { client: BasePayload | null; promise: Promise<BasePayload> | null } | undefined;
}

// กำหนด default ให้ cached เสมอ ไม่ให้เป็น undefined
if (!global.payload) {
  global.payload = { client: null, promise: null };
}
const cached = global.payload as {
  client: BasePayload | null;
  promise: Promise<BasePayload> | null;
};

async function getPayloadClient(): Promise<BasePayload> {
  if (cached.client) return cached.client;
  if (!cached.promise) {
    cached.promise = (async () => {
      if (!payload.db) await initPayload();
      return payload;
    })();
  }
  cached.client = await cached.promise;
  return cached.client;
}

// Validate email ด้วย regex
function isValidEmail(email: string): boolean {
  return /^[\w-.]+@[\w-]+\.[a-zA-Z]{2,}$/.test(email);
}

export async function GET(_req: Request) {
  return new NextResponse(
    JSON.stringify({
      message: 'Forgot password API endpoint is active',
      note: 'Please use POST method to request password reset',
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    },
  );
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}

export async function POST(req: Request) {
  try {
    const { email } = (await req.json()) as { email?: string };

    if (!email || !isValidEmail(email)) {
      return NextResponse.json(
        { message: 'กรุณาระบุอีเมลที่ถูกต้องสำหรับรีเซ็ตรหัสผ่าน' },
        { status: 400, headers: corsHeaders },
      );
    }

    const payloadClient = await getPayloadClient();
    const users = await payloadClient.find({
      collection: 'users',
      where: { email: { equals: email } },
      limit: 1,
    });

    if (!users?.totalDocs || users.totalDocs === 0) {
      return NextResponse.json(
        { message: 'หากมีบัญชีอยู่ในระบบ เราจะส่งลิงก์รีเซ็ตรหัสผ่านไปยังอีเมลของคุณ' },
        { status: 200, headers: corsHeaders },
      );
    }

    await payloadClient.forgotPassword({
      collection: 'users',
      data: { email },
    });

    return NextResponse.json(
      {
        message: 'หากมีบัญชีอยู่ในระบบ เราจะส่งลิงก์รีเซ็ตรหัสผ่านไปยังอีเมลของคุณ',
        success: true,
      },
      { status: 200, headers: corsHeaders },
    );
  } catch (error: unknown) {
    return NextResponse.json(
      {
        message: 'เกิดข้อผิดพลาดในการส่งอีเมลรีเซ็ตรหัสผ่าน กรุณาลองใหม่ในภายหลัง',
        error:
          error instanceof Error ? error.message : 'ไม่สามารถส่งอีเมลรีเซ็ตรหัสผ่านได้ในขณะนี้',
      },
      { status: 500, headers: corsHeaders },
    );
  }
}

/**
 * CORS middleware สำหรับ Next.js API routes
 */
import type { NextRequest, NextResponse } from 'next/server';

/**
 * ประเภทของ HTTP method ที่รองรับ
 */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'OPTIONS' | 'HEAD';

/**
 * Options สำหรับการตั้งค่า CORS
 */
export interface CorsOptions {
  allowedOrigins?: string[] | '*';
  allowedMethods?: HttpMethod[];
  allowedHeaders?: string[];
  exposedHeaders?: string[];
  maxAge?: number;
  allowCredentials?: boolean;
}

/**
 * ค่าเริ่มต้นสำหรับ CORS
 */
export const defaultCorsOptions: CorsOptions = {
  allowedOrigins: '*',
  allowedMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'],
  allowedHeaders: [
    'X-CSRF-Token',
    'X-Requested-With',
    'Accept',
    'Accept-Version',
    'Content-Length',
    'Content-Type',
    'Date',
    'X-Api-Version',
    'Authorization',
    'Origin',
    'X-Api-Key',
    'Cache-Control',
    'Pragma',
    'Expires',
    'X-Auth-Token',
  ],
  exposedHeaders: ['Content-Length', 'X-Rate-Limit'],
  maxAge: 86400,
  allowCredentials: true,
};

/**
 * CORS Headers ที่สามารถใช้ได้โดยตรง
 */
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS, PATCH',
  'Access-Control-Allow-Headers':
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-Type, Date, X-Api-Version, Authorization, Origin, X-Api-Key, Cache-Control, Pragma, Expires, X-Auth-Token',
  'Access-Control-Max-Age': '86400',
  'Access-Control-Allow-Credentials': 'true',
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
  Pragma: 'no-cache',
  Expires: '0',
  'Surrogate-Control': 'no-store',
};

/**
 * เพิ่ม CORS headers ใน response และจัดการ preflight request
 */
export function setCorsHeaders(
  request: NextRequest,
  response: NextResponse,
  options: CorsOptions = {},
): NextResponse {
  const mergedOptions: CorsOptions = { ...defaultCorsOptions, ...options };
  const { origin } = request.headers;
  const requestMethod = request.method.toUpperCase() as HttpMethod;

  // ตรวจสอบว่า origin ได้รับอนุญาตหรือไม่
  let isAllowedOrigin = mergedOptions.allowedOrigins === '*';

  if (!isAllowedOrigin && origin && Array.isArray(mergedOptions.allowedOrigins)) {
    isAllowedOrigin = mergedOptions.allowedOrigins.includes(origin);
  }

  // เพิ่ม CORS headers
  if (isAllowedOrigin) {
    const headers = new Headers(response.headers);

    headers.set('Access-Control-Allow-Origin', origin || '*');

    if (mergedOptions.allowCredentials) {
      headers.set('Access-Control-Allow-Credentials', 'true');
    }

    if (mergedOptions.exposedHeaders && mergedOptions.exposedHeaders.length > 0) {
      headers.set('Access-Control-Expose-Headers', mergedOptions.exposedHeaders.join(', '));
    }

    // สำหรับ preflight request (OPTIONS)
    if (requestMethod === 'OPTIONS') {
      if (mergedOptions.allowedMethods && mergedOptions.allowedMethods.length > 0) {
        headers.set('Access-Control-Allow-Methods', mergedOptions.allowedMethods.join(', '));
      }

      if (mergedOptions.allowedHeaders && mergedOptions.allowedHeaders.length > 0) {
        headers.set('Access-Control-Allow-Headers', mergedOptions.allowedHeaders.join(', '));
      }

      if (mergedOptions.maxAge) {
        headers.set('Access-Control-Max-Age', mergedOptions.maxAge.toString());
      }

      // No-cache headers สำหรับ OPTIONS request
      headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
      headers.set('Pragma', 'no-cache');
      headers.set('Expires', '0');
      headers.set('Surrogate-Control', 'no-store');

      // สร้าง response ใหม่สำหรับ preflight request
      return new NextResponse(null, {
        status: 204,
        headers,
      });
    }

    // สร้าง response ใหม่ด้วย headers ที่อัปเดตแล้ว
    return NextResponse.next({
      request: {
        headers: request.headers,
      },
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  }

  return response;
}

/**
 * CORS middleware สำหรับ Next.js API routes
 */
export function withCors(handler: Function, options: CorsOptions = {}) {
  return async (request: NextRequest, ...args: any[]) => {
    if (request.method === 'OPTIONS') {
      // จัดการ preflight request
      const response = new NextResponse(null, { status: 204 });
      return setCorsHeaders(request, response, options);
    }

    // ดำเนินการกับ request และเพิ่ม CORS headers
    let response;

    try {
      response = await handler(request, ...args);
    } catch (error) {
      response = new NextResponse(
        JSON.stringify({
          message: error instanceof Error ? error.message : 'Internal Server Error',
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } },
      );
    }

    return setCorsHeaders(request, response, options);
  };
}

export const dynamic = 'force-static';

import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#01121f] text-white flex-col px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <h2 className="text-2xl mb-6">ไม่พบหน้าที่คุณกำลังค้นหา</h2>
        <p className="mb-8">หน้าเว็บที่คุณพยายามเข้าถึงอาจถูกย้าย ลบออกไป หรือไม่เคยมีอยู่</p>
        <Link href="/home" className="bg-[#0078FF] text-white px-6 py-2 rounded-md inline-block">
          กลับสู่หน้าหลัก
        </Link>
      </div>
    </div>
  );
}

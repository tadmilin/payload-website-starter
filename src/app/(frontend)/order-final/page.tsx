'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function OrderFinalPage() {
  const router = useRouter()
  
  const handlePayment = () => {
    router.push('/payment-success')
  }
  
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Navbar - สีดำเหมือนหน้าก่อนหน้า */}
      <div className="fixed top-0 left-0 w-full z-50 bg-white border-b border-gray-200">
        <div className="px-4 py-3 flex justify-between items-center">
          {/* โลโก้ */}
          <div className="text-black font-bold">
            <Link href="/" className="flex items-center">
              <span className="text-lg mr-1">☀️</span>
              <span className="text-sm tracking-wider">SOLARLAA</span>
            </Link>
          </div>
          
          {/* ปุ่ม Menu */}
          <div className="relative">
            <Link 
              href="/home"
              className="px-5 py-1.5 bg-[#233544] text-white text-xs font-medium rounded-sm"
            >
              Menu
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="pt-16 pb-6 px-5 max-w-md mx-auto w-full">
        {/* Back Button */}
        <div className="mb-4">
          <Link href="/order-summary" className="text-gray-500 text-sm flex items-center">
            <span>&#8592;</span>
            <span className="ml-1">กลับ</span>
          </Link>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-800 mb-5">สรุปคำสั่งซื้อ</h1>

        {/* Installation Details */}
        <div className="mb-5 bg-gray-50 p-4 rounded-md">
          <h3 className="font-semibold text-gray-800 mb-2">รายละเอียดการติดตั้ง</h3>
          <div className="text-sm text-gray-600 space-y-1">
            <p>วันที่: 15 มิถุนายน 2024</p>
            <p>เวลา: 9:00 น.</p>
            <p>ที่อยู่: 278/12 เอกมัย คอมเพล็กซ์, สุขุมวิท 63, 10110</p>
            <p>ชื่อ: นายสมชาย ใจดี</p>
            <p>โทร: 080-123-4567</p>
          </div>
        </div>

        {/* Order Items */}
        <div className="mb-5">
          <h3 className="font-semibold text-gray-800 mb-3">รายการสินค้า</h3>
          
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-gray-800 font-medium">SOLARLAA Kit M10w</div>
              <div className="text-gray-500 text-sm">1 ชุด</div>
            </div>
            <div className="text-gray-800 font-medium">120,000 ฿</div>
          </div>

          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-gray-800 font-medium">บริการติดตั้ง</div>
              <div className="text-gray-500 text-sm">แพ็คเกจมาตรฐาน</div>
            </div>
            <div className="text-gray-800 font-medium">15,000 ฿</div>
          </div>

          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-gray-800 font-medium">ระบบติดตาม</div>
              <div className="text-gray-500 text-sm">สมาชิก 1 ปี</div>
            </div>
            <div className="text-gray-800 font-medium">5,000 ฿</div>
          </div>
        </div>

        <div className="h-px bg-gray-200 my-5"></div>

        {/* Total */}
        <div className="mb-5">
          <div className="flex justify-between mb-2">
            <div className="text-gray-600">ยอดรวม</div>
            <div className="text-gray-800">140,000 ฿</div>
          </div>
          <div className="flex justify-between mb-2">
            <div className="text-gray-600">ภาษี (7%)</div>
            <div className="text-gray-800">0 ฿</div>
          </div>
          <div className="flex justify-between mb-2">
            <div className="font-bold text-gray-800">ยอดสุทธิ</div>
            <div className="font-bold text-gray-800">140,000 ฿</div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="mb-6">
          <h3 className="font-semibold text-gray-800 mb-3">ตัวเลือกการชำระเงิน</h3>
          <div className="space-y-2">
            <div className="border border-gray-300 rounded-md p-3 flex items-center">
              <input type="radio" id="fullPayment" name="payment" className="mr-3" defaultChecked />
              <label htmlFor="fullPayment" className="text-gray-800">ชำระเต็มจำนวน</label>
            </div>
            <div className="border border-gray-300 rounded-md p-3 flex items-center">
              <input type="radio" id="installment" name="payment" className="mr-3" />
              <label htmlFor="installment" className="text-gray-800">ผ่อนชำระ (12 เดือน)</label>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 mt-6">
          <button 
            onClick={handlePayment}
            className="block w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 text-center rounded-md"
          >
            ดำเนินการชำระเงิน
          </button>
          <Link href="/order-summary" className="block w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 text-center rounded-md">
            ยกเลิก
          </Link>
        </div>
      </div>
    </div>
  )
} 
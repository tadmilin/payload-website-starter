'use client'

import React, { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function PaymentSuccessPage() {
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  
  // ปิดเมนูเมื่อคลิกนอกพื้นที่เมนู
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Navbar */}
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
          <div className="relative" ref={menuRef}>
            <button 
              onClick={toggleMenu}
              className="px-5 py-1.5 bg-[#233544] text-white text-xs font-medium rounded-sm"
            >
              Menu
            </button>
            
            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-[#233544] rounded-sm shadow-lg py-1 z-50">
                <Link 
                  href="/home" 
                  className="block px-4 py-2 text-sm text-white hover:bg-[#344554]"
                  onClick={() => setIsMenuOpen(false)}
                >
                  หน้าหลัก
                </Link>
                <Link 
                  href="/simulator" 
                  className="block px-4 py-2 text-sm text-white hover:bg-[#344554]"
                  onClick={() => setIsMenuOpen(false)}
                >
                  จำลองการติดตั้ง
                </Link>
                <Link 
                  href="/shop" 
                  className="block px-4 py-2 text-sm text-white hover:bg-[#344554]"
                  onClick={() => setIsMenuOpen(false)}
                >
                  สั่งซื้อสินค้า
                </Link>
                <Link 
                  href="/monitor" 
                  className="block px-4 py-2 text-sm text-white hover:bg-[#344554]"
                  onClick={() => setIsMenuOpen(false)}
                >
                  ติดตามการใช้งาน
                </Link>
                <div className="border-t border-[#455565] my-1"></div>
                <Link 
                  href="/for-home" 
                  className="block px-4 py-2 text-sm text-white hover:bg-[#344554]"
                  onClick={() => setIsMenuOpen(false)}
                >
                  สำหรับบ้าน
                </Link>
                <Link 
                  href="/for-business" 
                  className="block px-4 py-2 text-sm text-white hover:bg-[#344554]"
                  onClick={() => setIsMenuOpen(false)}
                >
                  สำหรับธุรกิจ
                </Link>
                <Link 
                  href="/about-us" 
                  className="block px-4 py-2 text-sm text-white hover:bg-[#344554]"
                  onClick={() => setIsMenuOpen(false)}
                >
                  เกี่ยวกับเรา
                </Link>
                <Link 
                  href="/contact" 
                  className="block px-4 py-2 text-sm text-white hover:bg-[#344554]"
                  onClick={() => setIsMenuOpen(false)}
                >
                  ติดต่อเรา
                </Link>
                <div className="border-t border-[#455565] my-1"></div>
                <Link 
                  href="/login" 
                  className="block px-4 py-2 text-sm text-white hover:bg-[#344554]"
                  onClick={() => setIsMenuOpen(false)}
                >
                  เข้าสู่ระบบ
                </Link>
                <Link 
                  href="/consultation" 
                  className="block px-4 py-2 text-sm text-white hover:bg-[#344554] font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  ขอคำปรึกษาฟรี
                </Link>
                <div className="border-t border-[#455565] my-1"></div>
                <div className="px-4 py-2">
                  <button 
                    className="text-sm text-white hover:text-yellow-400 transition-colors font-medium"
                    onClick={() => {
                      document.dispatchEvent(
                        new CustomEvent('toggle-language', { detail: {} })
                      );
                      setIsMenuOpen(false);
                    }}
                  >
                    เปลี่ยนภาษา: TH/EN
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="pt-20 pb-6 px-5 max-w-md mx-auto w-full text-center">
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
        
        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-800 mb-2">ขอบคุณสำหรับการสั่งซื้อ!</h1>
        
        {/* Description */}
        <p className="text-gray-500 mb-8">
          การชำระเงินของคุณสำเร็จแล้ว ทีมงานของเราจะติดต่อกลับเพื่อยืนยันการติดตั้งอีกครั้ง
        </p>
        
        {/* Order Information */}
        <div className="bg-gray-50 rounded-lg p-5 mb-6 text-left">
          <h3 className="font-semibold text-gray-800 mb-3">ข้อมูลคำสั่งซื้อ</h3>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">หมายเลขคำสั่งซื้อ:</span>
              <span className="text-gray-900 font-medium">#SOL12345</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">วันที่สั่งซื้อ:</span>
              <span className="text-gray-900">{new Date().toLocaleDateString('th-TH')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">ยอดรวม:</span>
              <span className="text-gray-900 font-medium">140,000 ฿</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">ช่องทางการชำระเงิน:</span>
              <span className="text-gray-900">บัตรเครดิต</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">สถานะการชำระเงิน:</span>
              <span className="text-green-600 font-medium">สำเร็จ</span>
            </div>
          </div>
        </div>
        
        {/* Installation Details */}
        <div className="bg-gray-50 rounded-lg p-5 mb-8 text-left">
          <h3 className="font-semibold text-gray-800 mb-3">รายละเอียดการติดตั้ง</h3>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">วันที่ติดตั้ง:</span>
              <span className="text-gray-900">15 มิถุนายน 2024</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">เวลา:</span>
              <span className="text-gray-900">9:00 น.</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">สถานที่:</span>
              <span className="text-gray-900">278/12 เอกมัย คอมเพล็กซ์, สุขุมวิท 63</span>
            </div>
          </div>
        </div>
        
        {/* Actions */}
        <div className="space-y-3">
          <Link 
            href="/home" 
            className="block w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 rounded-md"
          >
            กลับสู่หน้าหลัก
          </Link>
          <Link 
            href="/order-tracking" 
            className="block w-full bg-white border border-gray-300 text-gray-800 font-medium py-3 rounded-md"
          >
            ติดตามคำสั่งซื้อ
          </Link>
        </div>
      </div>
    </div>
  )
}
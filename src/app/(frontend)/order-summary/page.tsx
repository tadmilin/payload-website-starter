'use client'

import React, { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'

export default function OrderSummaryPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    // ปิดเมนูเมื่อคลิกนอกพื้นที่เมนู
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
        <div className="px-4 py-3 flex justify-between items-center max-w-6xl mx-auto">
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
              <div className="absolute right-0 mt-2 w-48 bg-[#233544] rounded-sm shadow-lg z-50">
                <Link 
                  href="/"
                  className="block px-4 py-3 text-sm text-white hover:bg-[#344554] border-b border-gray-700"
                  onClick={() => setIsMenuOpen(false)}
                >
                  หน้าหลัก
                </Link>
                <Link 
                  href="/จำลองการติดตั้ง"
                  className="block px-4 py-3 text-sm text-white hover:bg-[#344554] border-b border-gray-700"
                  onClick={() => setIsMenuOpen(false)}
                >
                  จำลองการติดตั้ง
                </Link>
                <Link 
                  href="/ร้านค้า"
                  className="block px-4 py-3 text-sm text-white hover:bg-[#344554] border-b border-gray-700"
                  onClick={() => setIsMenuOpen(false)}
                >
                  ร้านค้า
                </Link>
                <Link 
                  href="/ติดตามระบบ"
                  className="block px-4 py-3 text-sm text-white hover:bg-[#344554] border-b border-gray-700"
                  onClick={() => setIsMenuOpen(false)}
                >
                  ติดตามระบบ
                </Link>
                <Link 
                  href="/สำหรับบ้าน"
                  className="block px-4 py-3 text-sm text-white hover:bg-[#344554] border-b border-gray-700"
                  onClick={() => setIsMenuOpen(false)}
                >
                  สำหรับบ้าน
                </Link>
                <Link 
                  href="/สำหรับธุรกิจ"
                  className="block px-4 py-3 text-sm text-white hover:bg-[#344554] border-b border-gray-700"
                  onClick={() => setIsMenuOpen(false)}
                >
                  สำหรับธุรกิจ
                </Link>
                <Link 
                  href="/เกี่ยวกับเรา"
                  className="block px-4 py-3 text-sm text-white hover:bg-[#344554] border-b border-gray-700"
                  onClick={() => setIsMenuOpen(false)}
                >
                  เกี่ยวกับเรา
                </Link>
                <Link 
                  href="/ติดต่อเรา"
                  className="block px-4 py-3 text-sm text-white hover:bg-[#344554] border-b border-gray-700"
                  onClick={() => setIsMenuOpen(false)}
                >
                  ติดต่อเรา
                </Link>
                <Link 
                  href="/เข้าสู่ระบบ"
                  className="block px-4 py-3 text-sm text-white hover:bg-[#344554] border-b border-gray-700"
                  onClick={() => setIsMenuOpen(false)}
                >
                  เข้าสู่ระบบ
                </Link>
                <Link 
                  href="/ขอคำปรึกษาฟรี"
                  className="block px-4 py-3 text-sm text-white hover:bg-[#344554]"
                  onClick={() => setIsMenuOpen(false)}
                >
                  ขอคำปรึกษาฟรี
                </Link>
                <div className="px-4 py-2 text-xs text-white/70 border-t border-gray-700">
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
      <div className="pt-16 pb-6 px-4 sm:px-6 md:px-8 max-w-md mx-auto w-full">
        {/* Back Button */}
        <div className="mb-4">
          <Link href="/order-home" className="text-gray-500 text-sm flex items-center">
            <span>&#8592;</span>
            <span className="ml-1">Back</span>
          </Link>
        </div>

        {/* Title */}
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-5">Recommended System</h1>

        {/* Solar Panel Info */}
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-gray-800 font-medium">SOLARLAA Kit M10w</div>
            <div className="text-gray-500 text-sm">Estimated: 1 kit needed</div>
          </div>
          <div className="w-16 h-16 relative">
            <Image
              src="/images/5.png"
              alt="Solar Panel"
              fill
              style={{ objectFit: 'contain' }}
              sizes="(max-width: 640px) 64px, 64px"
            />
          </div>
        </div>

        {/* Address */}
        <div className="flex justify-between items-center mb-5">
          <div className="text-sm text-gray-600">
            278/12 Ekkamai Complex,<br />
            Sukhumvit 63 10110
          </div>
          <button className="text-blue-500 text-sm font-medium">
            Edit
          </button>
        </div>

        <div className="h-px bg-gray-200 my-5"></div>

        {/* Savings Info */}
        <div className="mb-2">
          <div className="text-gray-800 font-medium">Save Est. 2,000 baht/month</div>
          <div className="text-gray-500 text-sm">On Your Monthly Electric Bill</div>
        </div>
        
        {/* Chart */}
        <div className="my-5">
          <div className="text-center text-xs text-gray-500 mb-2">2,000 baht saved</div>
          <div className="flex items-end h-28 sm:h-32 mb-2">
            <div className="w-1/2 flex justify-center">
              <div className="w-16 sm:w-24 bg-blue-500 h-24 sm:h-28"></div>
            </div>
            <div className="w-1/2 flex justify-center">
              <div className="w-16 sm:w-24 bg-gray-200 h-20 sm:h-24"></div>
            </div>
          </div>
          <div className="flex text-xs text-gray-500">
            <div className="w-1/2 text-center">
              <div>With SOLARLAA</div>
            </div>
            <div className="w-1/2 text-center">
              <div>Current bill</div>
              <div>5,000 baht/month</div>
            </div>
          </div>
        </div>

        <div className="h-px bg-gray-200 my-5"></div>

        {/* Total and Payback */}
        <div className="mb-5">
          <div className="flex justify-between mb-2">
            <div className="font-bold text-gray-800">Total</div>
            <div className="font-bold text-gray-800">140,000 baht</div>
          </div>
          <div className="text-sm text-gray-600">Payback Period: Just 5 years</div>
          <div className="text-sm text-gray-600">No hidden fees. Free consultation included</div>
        </div>

        {/* View order summary */}
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">View order Summary</h2>
          <p className="text-sm text-gray-600">
            Continue to view pricing summary and order your system
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 mt-6">
          <Link href="/order-final" className="block w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 text-center rounded-md">
            Continue to Order Summary
          </Link>
          <button className="block w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 text-center rounded-md">
            Save
          </button>
        </div>
      </div>
    </div>
  )
} 
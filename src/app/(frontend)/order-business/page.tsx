'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Navbar } from '../../../components/Navbar'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function OrderBusinessPage() {
  const router = useRouter()
  const [businessAddress, setBusinessAddress] = useState('')
  const [electricBill, setElectricBill] = useState('')
  const [selectedSize, setSelectedSize] = useState('')
  const [usage, setUsage] = useState('')
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

  const handleSubmit = (e) => {
    e.preventDefault()
    router.push('/order-summary')
  }

  // ฟังก์ชันเลือกขนาดพื้นที่
  const selectSize = (size, event) => {
    if (event) event.preventDefault() // ป้องกันการส่งฟอร์ม
    setSelectedSize(size)
  }

  // ฟังก์ชันเลือกระดับการใช้งาน
  const selectUsage = (usageLevel, event) => {
    if (event) event.preventDefault() // ป้องกันการส่งฟอร์ม
    setUsage(usageLevel)
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Navbar - แก้ไขสีให้เป็นสีดำเฉพาะหน้านี้ */}
      <div className="fixed top-0 left-0 w-full z-50 bg-[#01121f] border-b border-white/10">
        <div className="px-4 py-3 flex justify-between items-center">
          {/* โลโก้ */}
          <div className="text-white font-bold">
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
                  href="/"
                  className="block px-4 py-3 text-sm text-white hover:bg-[#344554] border-b border-gray-700"
                  onClick={() => setIsMenuOpen(false)}
                >
                  หน้าหลัก
                </Link>
                <Link 
                  href="/simulator"
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
                      const event = new CustomEvent('toggle-language', { detail: {} });
                      document.dispatchEvent(event);
                      console.log('Language toggle event dispatched');
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

      {/* Main Content */}
      <div className="flex flex-col md:flex-row pt-[60px]">
        {/* Image Column - Hidden on mobile, shown on larger screens */}
        <div className="hidden md:block md:w-1/2 lg:w-3/5 relative" style={{ height: 'calc(100vh - 120px)' }}>
          <Image 
            src="/images/5.png" 
            alt="Solar Business" 
            fill 
            style={{ objectFit: 'contain' }}
            priority
          />
        </div>

        {/* Form Column */}
        <div className="w-full md:w-1/2 lg:w-2/5 max-w-md mx-auto md:mx-0 px-6 md:px-8 py-6 flex flex-col justify-center" style={{ height: 'calc(100vh - 120px)' }}>
          {/* Image for mobile only */}
          <div className="relative w-full h-64 md:hidden mb-6">
            <Image 
              src="/images/5.png" 
              alt="Solar Business" 
              fill 
              style={{ objectFit: 'contain' }}
              priority
            />
          </div>

          <h1 className="text-2xl font-semibold text-gray-800 mb-2">Business Solar Estimate</h1>
          <p className="text-gray-600 text-sm mb-6">
            Enter your business address and electric bill. We&apos;ll calculate a rough cost — free, fast, no pressure
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="businessAddress" className="block text-sm font-medium text-gray-700 mb-1">
                Business Address
              </label>
              <input
                type="text"
                id="businessAddress"
                value={businessAddress}
                onChange={(e) => setBusinessAddress(e.target.value)}
                className="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder=""
              />
            </div>

            <div>
              <label htmlFor="electricBill" className="block text-sm font-medium text-gray-700 mb-1">
                Average Electric Bill
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="electricBill"
                  value={electricBill}
                  onChange={(e) => setElectricBill(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-500 pr-16"
                  placeholder=""
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500 text-sm">
                  /month
                </div>
              </div>
            </div>

            <div className="mb-4">
              <h2 className="text-lg font-bold mb-2">ขนาดพื้นที่ที่ต้องการติดตั้ง</h2>
              <p className="text-sm text-gray-600 mb-3">
                โปรดเลือกขนาดพื้นที่สำหรับธุรกิจของคุณที่ต้องการติดตั้งแผงโซลาร์เซลล์
              </p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  className={`p-3 border rounded-md text-center ${
                    selectedSize === 'small' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedSize('small');
                  }}
                >
                  <div className="font-medium mb-1">พื้นที่ขนาดเล็ก</div>
                  <div className="text-sm text-gray-600">น้อยกว่า 100 ตร.ม.</div>
                </button>
                <button
                  className={`p-3 border rounded-md text-center ${
                    selectedSize === 'medium' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedSize('medium');
                  }}
                >
                  <div className="font-medium mb-1">พื้นที่ขนาดกลาง</div>
                  <div className="text-sm text-gray-600">100-500 ตร.ม.</div>
                </button>
                <button
                  className={`p-3 border rounded-md text-center ${
                    selectedSize === 'large' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedSize('large');
                  }}
                >
                  <div className="font-medium mb-1">พื้นที่ขนาดใหญ่</div>
                  <div className="text-sm text-gray-600">500-1,000 ตร.ม.</div>
                </button>
                <button
                  className={`p-3 border rounded-md text-center ${
                    selectedSize === 'xlarge' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedSize('xlarge');
                  }}
                >
                  <div className="font-medium mb-1">พื้นที่ขนาดใหญ่มาก</div>
                  <div className="text-sm text-gray-600">มากกว่า 1,000 ตร.ม.</div>
                </button>
              </div>
            </div>

            {/* Usage */}
            <div className="mb-5">
              <h2 className="text-lg font-bold mb-2">การใช้ไฟฟ้าของคุณ</h2>
              <p className="text-sm text-gray-600 mb-3">
                ค่าไฟฟ้าโดยประมาณต่อเดือนของธุรกิจของคุณ
              </p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  className={`p-3 border rounded-md text-center ${
                    usage === 'low' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    setUsage('low');
                  }}
                >
                  <div className="font-medium mb-1">ต่ำ</div>
                  <div className="text-sm text-gray-600">น้อยกว่า 15,000 บาท/เดือน</div>
                </button>
                <button
                  className={`p-3 border rounded-md text-center ${
                    usage === 'medium' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    setUsage('medium');
                  }}
                >
                  <div className="font-medium mb-1">ปานกลาง</div>
                  <div className="text-sm text-gray-600">15,000-50,000 บาท/เดือน</div>
                </button>
                <button
                  className={`p-3 border rounded-md text-center ${
                    usage === 'high' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    setUsage('high');
                  }}
                >
                  <div className="font-medium mb-1">สูง</div>
                  <div className="text-sm text-gray-600">50,000-100,000 บาท/เดือน</div>
                </button>
                <button
                  className={`p-3 border rounded-md text-center ${
                    usage === 'very-high' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    setUsage('very-high');
                  }}
                >
                  <div className="font-medium mb-1">สูงมาก</div>
                  <div className="text-sm text-gray-600">มากกว่า 100,000 บาท/เดือน</div>
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#89b4fa] hover:bg-[#74a0f1] text-white font-medium py-3.5 px-4 rounded transition-colors"
            >
              Next
            </button>
          </form>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center text-white/70 text-xs py-4 border-t border-white/10 bg-[#01121f] mt-auto">
        <p className="mb-4">SOLARLAA. All right reserved. © 2025</p>
        <div className="px-6">
          <Link 
            href="/consultation" 
            className="block w-full bg-[#232f3e] text-white py-2 px-4 rounded text-center"
          >
            Schedule a Free Consultation Today
          </Link>
        </div>
      </footer>
    </div>
  )
} 
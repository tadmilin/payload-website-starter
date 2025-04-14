'use client'

import React, { useState } from 'react'
import { Navbar } from '../../../components/Navbar'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function OrderHomePage() {
  const [address, setAddress] = useState('');
  const [electricBill, setElectricBill] = useState('');
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    // เราสามารถใส่ validation ได้ตรงนี้ถ้าต้องการ
    router.push('/order-summary');
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Navbar - แก้ไขสีให้เป็นสีดำเฉพาะหน้านี้ */}
      <div className="fixed top-0 left-0 w-full z-50">
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

      {/* Main Content */}
      <div className="flex flex-col md:flex-row pt-[60px]">
        {/* Image Column - Hidden on mobile, shown on larger screens */}
        <div className="hidden md:block md:w-1/2 lg:w-3/5 relative" style={{ height: 'calc(100vh - 120px)' }}>
          <Image 
            src="/images/5.png" 
            alt="Solar House" 
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
              alt="Solar House" 
              fill 
              style={{ objectFit: 'contain' }}
              priority
            />
          </div>

          <h1 className="text-2xl font-semibold text-gray-800 mb-2">Free Solar Estimate</h1>
          <p className="text-gray-600 text-sm mb-6">
            Enter your address and electric bill. We'll calculate a rough cost — free, fast, no pressure
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="homeAddress" className="block text-sm font-medium text-gray-700 mb-1">
                Home Address
              </label>
              <input
                type="text"
                id="homeAddress"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
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
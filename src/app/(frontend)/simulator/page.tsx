'use client'

import React from 'react'
import { Navbar } from '../../../components/Navbar.tsx'

export default function SimulatorPage() {
  return (
    <div className="min-h-screen">
      {/* ใช้ Navbar Component */}
      <Navbar />

      {/* Content */}
      <div className="pt-24 pb-20">
        <div className="container mx-auto px-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            จำลองการติดตั้งโซลาร์เซลล์
          </h1>
          
          <div className="bg-white p-8 rounded-lg shadow-sm">
            <p className="text-gray-700 mb-6">
              เครื่องมือจำลองการติดตั้งโซลาร์เซลล์จะพร้อมให้บริการเร็วๆ นี้...
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 
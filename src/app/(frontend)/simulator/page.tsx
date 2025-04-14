'use client'

import React from 'react'
import { Navbar } from '../../../components/Navbar'
import DesignTool from '@/components/DesignTool/DesignTool'

export default function SimulatorPage() {
  return (
    <div className="min-h-screen">
      {/* ใช้ Navbar Component */}
      <Navbar />

      {/* Content */}
      <div className="pt-24 pb-20">
        <div className="container mx-auto px-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            จำลองการติดตั้งโซลาร์เซลล์ !!! ห้าม hard code แบบนี้ ต้องสามารถปรับได้ในหน้า admin
          </h1>

          <div className="bg-white p-8 rounded-lg shadow-sm">
            <div className="text-gray-700 mb-6">
              <DesignTool />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

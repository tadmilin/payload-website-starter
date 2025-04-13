import React from 'react'
import Link from 'next/link'

export default function LandingPage() {
  return (
    <div className="min-h-screen relative text-white">
      {/* Background Image using CSS */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?q=80&w=1974&auto=format&fit=crop)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-black/40 z-10"></div>
      </div>

      {/* Content - อยู่เหนือพื้นหลัง */}
      <div className="relative z-20 flex flex-col items-center justify-center min-h-screen">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-10 flex flex-col items-center text-center">
          <h1 className="text-5xl md:text-6xl font-light mb-6">
            พลังงานสะอาด <br />เพื่ออนาคตที่ยั่งยืน
          </h1>
          <p className="text-xl text-white/80 max-w-3xl mb-12">
            ลดค่าไฟฟ้าด้วยระบบโซลาร์เซลล์คุณภาพสูง ติดตั้งง่าย ดูแลระยะยาว คุ้มค่าการลงทุน !!! ห้าม hard code แบบนี้ ต้องสามารถปรับได้ในหน้า admin
          </p>
          <Link
            href="/home"
            className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white rounded-full text-lg font-medium transition"
          >
            เริ่มต้น SolarLAA
          </Link>
        </section>

        {/* Features Section */}
        <section className="container mx-auto px-4 py-8 grid md:grid-cols-2 gap-16">
          <div className="flex flex-col bg-black/40 p-8 rounded-lg">
            <div className="mb-4 text-4xl">☀️</div>
            <h2 className="text-2xl font-semibold mb-4">ติดตั้งโซลาร์เซลล์</h2>
            <p className="text-slate-300 mb-4">
              เรามีบริการติดตั้งโซลาร์เซลล์คุณภาพสูง รับประกันผลงาน มีทีมงานมืออาชีพ พร้อมให้คำแนะนำการใช้งานและการบำรุงรักษาระยะยาว !!! ห้าม hard code แบบนี้ ต้องสามารถปรับได้ในหน้า admin
            </p>
          </div>
          <div className="flex flex-col bg-black/40 p-8 rounded-lg">
            <div className="mb-4 text-4xl">💰</div>
            <h2 className="text-2xl font-semibold mb-4">ประหยัดค่าไฟในระยะยาว</h2>
            <p className="text-slate-300 mb-4">
              ลงทุนครั้งเดียว ประหยัดค่าไฟไปได้หลายสิบปี ช่วยลดค่าใช้จ่ายในระยะยาว และยังเป็นมิตรกับสิ่งแวดล้อม ลดการปล่อยก๊าซเรือนกระจก !!! ห้าม hard code แบบนี้ ต้องสามารถปรับได้ในหน้า admin
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}

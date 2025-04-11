'use client'

import * as React from 'react'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Navbar } from '../../../components/Navbar'
import { useTranslation } from '@/utils/TranslationContext'
import { useLanguage } from '@/providers/LanguageProvider/context'

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentProductCategory, setCurrentProductCategory] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const { locale } = useLanguage();
  const { t } = useTranslation();
  
  // รูปภาพสำหรับสไลด์
  const slides = [
    'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1611365892117-bce27f64d32e?w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1592833159718-53539b8ddd3e?w=1600&auto=format&fit=crop'
  ];

  // ข้อมูลสินค้าประเภทต่างๆ
  const productCategories = [
    {
      title: "Inverters",
      image: "https://images.unsplash.com/photo-1594818379496-da1e345388c0?w=800&auto=format&fit=crop",
      description: "อินเวอร์เตอร์คุณภาพสูง เปลี่ยนพลังงานไฟฟ้ากระแสตรงเป็นกระแสสลับ"
    },
    {
      title: "Solar Panels",
      image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&auto=format&fit=crop",
      description: "แผงโซลาร์เซลล์ประสิทธิภาพสูง ทนทานต่อทุกสภาพอากาศ"
    },
    {
      title: "Accessories",
      image: "https://images.unsplash.com/photo-1627163439134-7a8c47e08208?w=800&auto=format&fit=crop",
      description: "อุปกรณ์เสริมสำหรับระบบโซลาร์เซลล์ครบวงจร"
    }
  ];

  // เปลี่ยนสไลด์อัตโนมัติ
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  // ฟังก์ชันเลื่อนสไลด์สินค้า
  const navigateProduct = (direction: 'next' | 'prev') => {
    if (direction === 'next') {
      setCurrentProductCategory((prev) => 
        prev === productCategories.length - 1 ? 0 : prev + 1
      );
    } else {
      setCurrentProductCategory((prev) => 
        prev === 0 ? productCategories.length - 1 : prev - 1
      );
    }
  };

  return (
    <div className="min-h-screen">
      {/* ใช้ Navbar Component แทน Navbar เดิม */}
      <Navbar />

      {/* Hero Section พร้อมสไลด์รูปภาพ */}
      <section className="relative h-screen">
        {/* รูปภาพสไลด์ */}
        <div className="absolute inset-0 overflow-hidden">
          <div 
            className="absolute inset-0 w-full h-full bg-cover bg-center transform transition-transform duration-700 ease-in-out"
            style={{ 
              backgroundImage: `url(${slides[currentSlide]})`, 
              transform: `scale(${scrolled ? 1.05 : 1})` 
            }}
          ></div>
          {/* เพิ่มรูปภาพซ้ำๆ เป็นพื้นหลัง */}
          <div className="absolute inset-0 opacity-20 bg-repeat z-0" 
            style={{ 
              backgroundImage: `url('/images/solar-windmill.jpg')`,
              backgroundSize: '300px', 
              backgroundBlendMode: 'overlay',
              mixBlendMode: 'overlay' 
            }}>
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40"></div>
        </div>
        
        {/* เนื้อหา Hero */}
        <div className="container mx-auto px-6 h-full flex items-center relative z-10">
          <div className="w-full max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-200">
              {t('solar_title')}
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-xl">
              {t('solar_desc')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/simulator" className="bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-white font-medium py-3 px-8 rounded-md shadow-lg transform hover:-translate-y-1 transition-all duration-300 text-center">
                {t('start_simulation')}
              </Link>
              <Link href="/shop" className="bg-white/20 backdrop-blur-sm text-white border border-white/30 hover:bg-white/30 font-medium py-3 px-8 rounded-md shadow-lg transform hover:-translate-y-1 transition-all duration-300 text-center">
                {t('view_products')}
              </Link>
            </div>
          </div>
        </div>
        
        {/* ไฟ indicator สไลด์ */}
        <div className="absolute bottom-6 left-0 right-0 flex justify-center space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-all ${
                currentSlide === index 
                  ? 'bg-yellow-400 w-8' 
                  : 'bg-white/50 hover:bg-white/70'
              }`}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>
      </section>

      {/* สถิติการประหยัดพลังงาน - ปรับปรุงให้เรียบหรูขึ้น */}
      <section className="py-16 bg-gradient-to-r from-gray-900 to-gray-800">
        <div className="container mx-auto px-10 md:px-20 max-w-6xl">
          <div className="flex flex-col md:flex-row items-center justify-between mb-10 md:mb-16">
            <div className="md:w-1/2 text-left md:pr-10 mb-8 md:mb-0">
              <h2 className="text-2xl md:text-3xl font-light text-white mb-2">
                SOLARLAA <span className="font-semibold">{t('energy_saving_stats')}</span>
              </h2>
              <div className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-300 to-yellow-500 mb-4">
                12,188,044 บาท
              </div>
              <div className="h-1 w-24 bg-gradient-to-r from-amber-300 to-yellow-500 rounded"></div>
            </div>
            
            <div className="md:w-1/2 md:pl-10">
              <h3 className="text-xl font-medium text-white mb-6 text-center md:text-left">
                ประหยัดพลังงาน
              </h3>
              
              <div className="grid grid-cols-2 gap-4 sm:gap-6">
                <div className="bg-black/30 backdrop-blur-sm p-5 rounded-lg border border-gray-700">
                  <div className="text-sm font-medium text-gray-400 mb-2">{t('total_electricity')}</div>
                  <div className="flex justify-center md:justify-start">
                    <div className="flex gap-1">
                      {[0,3,9,4,9].map((num, i) => (
                        <div key={i} className="bg-black/50 text-amber-300 w-8 h-9 rounded flex items-center justify-center text-lg font-medium">{num}</div>
                      ))}
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 mt-2 text-center md:text-left">กิโลวัตต์ชั่วโมง</div>
                </div>
                
                <div className="bg-black/30 backdrop-blur-sm p-5 rounded-lg border border-gray-700">
                  <div className="text-sm font-medium text-gray-400 mb-2">{t('total_consumption')}</div>
                  <div className="flex justify-center md:justify-start">
                    <div className="flex gap-1">
                      {[0,3,4,3,1].map((num, i) => (
                        <div key={i} className="bg-black/50 text-amber-300 w-8 h-9 rounded flex items-center justify-center text-lg font-medium">{num}</div>
                      ))}
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 mt-2 text-center md:text-left">กิโลวัตต์ชั่วโมง</div>
                </div>
                
                <div className="bg-black/30 backdrop-blur-sm p-5 rounded-lg border border-gray-700">
                  <div className="text-sm font-medium text-gray-400 mb-2">{t('total_projects')}</div>
                  <div className="flex justify-center md:justify-start">
                    <div className="flex gap-1">
                      {[0,3,8].map((num, i) => (
                        <div key={i} className="bg-black/50 text-amber-300 w-8 h-9 rounded flex items-center justify-center text-lg font-medium">{num}</div>
                      ))}
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 mt-2 text-center md:text-left">โครงการ</div>
                </div>
                
                <div className="bg-black/30 backdrop-blur-sm p-5 rounded-lg border border-gray-700">
                  <div className="text-sm font-medium text-gray-400 mb-2">{t('total_capacity')}</div>
                  <div className="flex justify-center md:justify-start">
                    <div className="flex gap-1">
                      {[0,6,3,9,5].map((num, i) => (
                        <div key={i} className="bg-black/50 text-amber-300 w-8 h-9 rounded flex items-center justify-center text-lg font-medium">{num}</div>
                      ))}
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 mt-2 text-center md:text-left">กิโลวัตต์(ติดตั้ง)</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* วิธีการทำงาน 4 ขั้นตอน - ดีไซน์เรียบหรู */}
      <section className="py-20 bg-gray-50 relative overflow-hidden">
        {/* เพิ่ม background ลายน้ำ */}
        <div className="absolute inset-0 bg-[url('/images/solar-windmill.jpg')] bg-cover bg-center bg-no-repeat opacity-15"></div>
        <div className="container mx-auto px-6 max-w-6xl relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-600 mb-3">วิธีการทำงาน</h2>
            <div className="h-0.5 w-24 bg-gradient-to-r from-emerald-400 to-blue-500 mx-auto mb-4 rounded-full"></div>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">เพียง 4 ขั้นตอนง่ายๆ</p>
          </div>
          
          <div className="relative">
            {/* เส้นเชื่อมต่อระหว่างไอคอน (แสดงเฉพาะบนจอขนาดกลางขึ้นไป) */}
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-cyan-200 -translate-y-1/2 z-0" style={{ width: '70%', margin: '0 auto' }}></div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-10 relative z-10">
              {/* ขั้นตอนที่ 1 */}
              <div className="flex flex-col items-center">
                <div className="relative mb-6">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                    </svg>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 text-center">เลือกรูปแบบการติดตั้ง</h3>
                <p className="text-gray-600 text-sm text-center">หลังคาบ้าน หรือ โรงงาน</p>
              </div>
              
              {/* ขั้นตอนที่ 2 */}
              <div className="flex flex-col items-center">
                <div className="relative mb-6">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"></path>
                    </svg>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 text-center">เลือกขนาดพื้นที่ติดตั้ง</h3>
                <p className="text-gray-600 text-sm text-center">ตารางเมตร และ บิดตั้ง</p>
              </div>
              
              {/* ขั้นตอนที่ 3 */}
              <div className="flex flex-col items-center">
                <div className="relative mb-6">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 text-center">เลือกสถานที่</h3>
                <p className="text-gray-600 text-sm text-center">จังหวัด - อำเภอ</p>
              </div>
              
              {/* ขั้นตอนที่ 4 */}
              <div className="flex flex-col items-center">
                <div className="relative mb-6">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
                    </svg>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 text-center">ซื้อสินค้า</h3>
                <p className="text-gray-600 text-sm text-center"></p>
              </div>
            </div>
            
            {/* ปุ่มสำเร็จด้านขวา */}
            <div className="mt-16 flex justify-center">
              <div className="w-28 h-28 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 flex items-center justify-center shadow-lg">
                <span className="text-xl font-bold text-white">สำเร็จ!</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* สินค้าของเรา - แบบใหม่ที่เรียบง่ายกว่า */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="mb-8 flex justify-between items-center">
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">สินค้าของเรา</h2>
            <div className="flex space-x-2">
              <button 
                onClick={() => navigateProduct('prev')} 
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                </svg>
              </button>
              <button 
                onClick={() => navigateProduct('next')} 
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </button>
            </div>
          </div>
          
          <div className="relative overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-in-out" 
              style={{ transform: `translateX(-${currentProductCategory * 100}%)` }}
            >
              {/* Inverters */}
              <div className="min-w-full grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="relative overflow-hidden rounded-lg shadow-lg group h-72">
                  <div 
                    className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                    style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1594818379496-da1e345388c0?w=800&auto=format&fit=crop")' }}
                  ></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/20"></div>
                  <div className="absolute inset-0 flex flex-col justify-end p-6">
                    <h3 className="text-3xl font-bold text-white mb-2">INVERTERS</h3>
                    <p className="text-white/80 mb-4">อินเวอร์เตอร์คุณภาพสูงสำหรับระบบโซลาร์เซลล์</p>
                    <button className="bg-white hover:bg-white/80 text-black py-2 px-6 rounded-md inline-block w-fit font-medium shadow-md transition-all">
                      Shop Now
                    </button>
                  </div>
                </div>

                {/* Solar Panels */}
                <div className="relative overflow-hidden rounded-lg shadow-lg group h-72">
                  <div 
                    className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                    style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&auto=format&fit=crop")' }}
                  ></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/20"></div>
                  <div className="absolute inset-0 flex flex-col justify-end p-6">
                    <h3 className="text-3xl font-bold text-white mb-2">SOLAR PANELS</h3>
                    <p className="text-white/80 mb-4">แผงโซลาร์เซลล์ประสิทธิภาพสูง ทนทานต่อทุกสภาพอากาศ</p>
                    <button className="bg-white hover:bg-white/80 text-black py-2 px-6 rounded-md inline-block w-fit font-medium shadow-md transition-all">
                      Shop Now
                    </button>
                  </div>
                </div>

                {/* Accessories */}
                <div className="relative overflow-hidden rounded-lg shadow-lg group h-72">
                  <div 
                    className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                    style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1627163439134-7a8c47e08208?w=800&auto=format&fit=crop")' }}
                  ></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/20"></div>
                  <div className="absolute inset-0 flex flex-col justify-end p-6">
                    <h3 className="text-3xl font-bold text-white mb-2">ACCESSORIES</h3>
                    <p className="text-white/80 mb-4">อุปกรณ์เสริมสำหรับระบบโซลาร์เซลล์ครบวงจร</p>
                    <button className="bg-white hover:bg-white/80 text-black py-2 px-6 rounded-md inline-block w-fit font-medium shadow-md transition-all">
                      Shop Now
                    </button>
                  </div>
                </div>

                {/* ETC */}
                <div className="relative overflow-hidden rounded-lg shadow-lg group h-72">
                  <div 
                    className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                    style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1566093097221-ac2335b09e70?w=800&auto=format&fit=crop")' }}
                  ></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/20"></div>
                  <div className="absolute inset-0 flex flex-col justify-end p-6">
                    <h3 className="text-3xl font-bold text-white mb-2">ETC</h3>
                    <p className="text-white/80 mb-4">สินค้าอื่นๆ ที่เกี่ยวข้องกับระบบโซลาร์เซลล์</p>
                    <button className="bg-white hover:bg-white/80 text-black py-2 px-6 rounded-md inline-block w-fit font-medium shadow-md transition-all">
                      Shop Now
                    </button>
                  </div>
                </div>
              </div>
              
              {/* หมวดหมู่อื่นๆ (สามารถเพิ่มได้ตามต้องการ) */}
              <div className="min-w-full grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* Energy Storage */}
                <div className="relative overflow-hidden rounded-lg shadow-lg group h-72">
                  <div 
                    className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                    style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1569511166187-95789a4555e8?w=800&auto=format&fit=crop")' }}
                  ></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/20"></div>
                  <div className="absolute inset-0 flex flex-col justify-end p-6">
                    <h3 className="text-3xl font-bold text-white mb-2">ENERGY STORAGE</h3>
                    <p className="text-white/80 mb-4">ระบบกักเก็บพลังงานสำหรับโซลาร์เซลล์</p>
                    <button className="bg-white hover:bg-white/80 text-black py-2 px-6 rounded-md inline-block w-fit font-medium shadow-md transition-all">
                      Shop Now
                    </button>
                  </div>
                </div>

                {/* Smart Home */}
                <div className="relative overflow-hidden rounded-lg shadow-lg group h-72">
                  <div 
                    className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                    style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1558002038-1055907df827?w=800&auto=format&fit=crop")' }}
                  ></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/20"></div>
                  <div className="absolute inset-0 flex flex-col justify-end p-6">
                    <h3 className="text-3xl font-bold text-white mb-2">SMART HOME</h3>
                    <p className="text-white/80 mb-4">อุปกรณ์บ้านอัจฉริยะที่ทำงานร่วมกับระบบโซลาร์เซลล์</p>
                    <button className="bg-white hover:bg-white/80 text-black py-2 px-6 rounded-md inline-block w-fit font-medium shadow-md transition-all">
                      Shop Now
                    </button>
                  </div>
                </div>

                {/* Monitoring */}
                <div className="relative overflow-hidden rounded-lg shadow-lg group h-72">
                  <div 
                    className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                    style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1551703599-3d5639c88f72?w=800&auto=format&fit=crop")' }}
                  ></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/20"></div>
                  <div className="absolute inset-0 flex flex-col justify-end p-6">
                    <h3 className="text-3xl font-bold text-white mb-2">MONITORING</h3>
                    <p className="text-white/80 mb-4">อุปกรณ์ตรวจสอบและติดตามการทำงานของระบบโซลาร์เซลล์</p>
                    <button className="bg-white hover:bg-white/80 text-black py-2 px-6 rounded-md inline-block w-fit font-medium shadow-md transition-all">
                      Shop Now
                    </button>
                  </div>
                </div>

                {/* Special Offers */}
                <div className="relative overflow-hidden rounded-lg shadow-lg group h-72">
                  <div 
                    className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                    style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1607516211623-fa15ecc89822?w=800&auto=format&fit=crop")' }}
                  ></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/20"></div>
                  <div className="absolute inset-0 flex flex-col justify-end p-6">
                    <h3 className="text-3xl font-bold text-white mb-2">SPECIAL OFFERS</h3>
                    <p className="text-white/80 mb-4">โปรโมชั่นและชุดสินค้าราคาพิเศษ</p>
                    <button className="bg-white hover:bg-white/80 text-black py-2 px-6 rounded-md inline-block w-fit font-medium shadow-md transition-all">
                      Shop Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* ตัวบอกตำแหน่งสไลด์ */}
          <div className="flex justify-center mt-8 space-x-2">
            <button 
              className={`w-3 h-3 rounded-full transition-colors ${currentProductCategory === 0 ? 'bg-blue-600' : 'bg-gray-300'}`}
              onClick={() => setCurrentProductCategory(0)}
            />
            <button 
              className={`w-3 h-3 rounded-full transition-colors ${currentProductCategory === 1 ? 'bg-blue-600' : 'bg-gray-300'}`}
              onClick={() => setCurrentProductCategory(1)}
            />
          </div>
        </div>
      </section>

      {/* ส่วนเนื้อหาเพิ่มเติม */}
      <section className="py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-yellow-400 mb-12 text-center">
            บริการของเรา
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-lg shadow-sm hover:shadow-md transition border border-white/10">
              <div className="text-4xl mb-4 text-yellow-400">☀️</div>
              <h3 className="text-xl font-bold mb-4 text-white">ระบบโซลาร์เซลล์บ้าน</h3>
              <p className="text-gray-300 mb-6">ประหยัดค่าไฟฟ้าในครัวเรือนด้วยระบบโซลาร์เซลล์คุณภาพสูง รับประกันยาวนาน</p>
              <a href="#" className="text-yellow-400 font-medium hover:text-yellow-300">ดูเพิ่มเติม →</a>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-lg shadow-sm hover:shadow-md transition border border-white/10">
              <div className="text-4xl mb-4 text-yellow-400">🏢</div>
              <h3 className="text-xl font-bold mb-4 text-white">โซลาร์เซลล์เชิงพาณิชย์</h3>
              <p className="text-gray-300 mb-6">โซลูชั่นพลังงานแสงอาทิตย์สำหรับธุรกิจและโรงงาน ช่วยลดต้นทุนในระยะยาว</p>
              <a href="#" className="text-yellow-400 font-medium hover:text-yellow-300">ดูเพิ่มเติม →</a>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-lg shadow-sm hover:shadow-md transition border border-white/10">
              <div className="text-4xl mb-4 text-yellow-400">🔋</div>
              <h3 className="text-xl font-bold mb-4 text-white">ระบบกักเก็บพลังงาน</h3>
              <p className="text-gray-300 mb-6">เพิ่มประสิทธิภาพการใช้พลังงานโซลาร์เซลล์ด้วยแบตเตอรี่กักเก็บพลังงานที่ทันสมัย</p>
              <a href="#" className="text-yellow-400 font-medium hover:text-yellow-300">ดูเพิ่มเติม →</a>
            </div>
          </div>
        </div>
      </section>

      {/* วิดีโอแนะนำการใช้งาน */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-500 mb-3">แนะนำการใช้งาน</h2>
            <div className="h-0.5 w-24 bg-gradient-to-r from-purple-400 to-indigo-500 mx-auto mb-4 rounded-full"></div>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-8">เรียนรู้การใช้งานโซลาร์เซลล์อย่างมีประสิทธิภาพ</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="aspect-w-16 aspect-h-9 rounded-xl overflow-hidden shadow-xl">
              <iframe 
                className="w-full h-full" 
                src="https://www.youtube.com/embed/SshVreaayjo" 
                title="แนะนำการใช้งานโซลาร์เซลล์" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
              ></iframe>
            </div>
            <div className="aspect-w-16 aspect-h-9 rounded-xl overflow-hidden shadow-xl">
              <iframe 
                className="w-full h-full" 
                src="https://www.youtube.com/embed/kKvbfxxRCi0" 
                title="การติดตั้งโซลาร์เซลล์" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      {/* แผนที่และสถิติการใช้งาน */}
      <section className="relative w-full h-[70vh]">
        {/* แผนที่พื้นหลัง */}
        <div className="absolute inset-0 w-full h-full">
          <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: 'url("/images/map-background.jpg")' }}></div>
        </div>

        {/* แถบเมนูด้านบนของแผนที่ */}
        <div className="absolute top-0 left-0 right-0 bg-white/90 backdrop-blur-sm z-10 shadow-sm">
          <div className="container mx-auto px-4">
            <div className="flex items-center">
              <button className="py-3 px-6 border-b-2 border-blue-500 font-medium text-gray-900">แผนที่</button>
              <button className="py-3 px-6 text-gray-600 hover:text-gray-900">ดาวเทียม</button>
            </div>
          </div>
        </div>

        {/* กล่องข้อมูลการใช้งาน */}
        <div className="absolute right-8 top-1/2 transform -translate-y-1/2 max-w-lg w-full bg-white/95 backdrop-blur-md rounded-xl shadow-2xl overflow-hidden z-20">
          <div className="p-8">
            <h2 className="text-xl font-medium text-gray-800 mb-2">ปัจจุบันมีการใช้งาน</h2>
            <h1 className="text-5xl font-bold text-gray-900 mb-3">SOLARLAA</h1>
            <div className="mb-8">
              <div className="text-[9rem] font-bold text-gray-900 leading-none">579</div>
              <div className="text-gray-600 font-medium">เมกะ/ชั่วโมง</div>
            </div>
            <p className="text-xl font-medium text-gray-800">ในประเทศไทย</p>
          </div>
        </div>
      </section>

      {/* ส่วน Footer */}
      <footer className="bg-white border-t border-gray-200">
        <div className="container mx-auto py-4 px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-6 mb-4 md:mb-0">
              <Link href="/terms" className="text-gray-600 hover:text-gray-900 text-sm">เงื่อนไขการใช้บริการ</Link>
              <span className="text-gray-400">|</span>
              <Link href="/privacy" className="text-gray-600 hover:text-gray-900 text-sm">ความเป็นส่วนตัว</Link>
              <span className="text-gray-400">|</span>
              <Link href="/about" className="text-gray-600 hover:text-gray-900 text-sm">เกี่ยวกับเรา</Link>
            </div>
            <div className="flex items-center space-x-4">
              <a href="https://apps.apple.com" target="_blank" rel="noopener noreferrer">
                <Image src="/images/app-store.png" alt="App Store" width={120} height={40} className="h-8 w-auto" />
              </a>
              <a href="https://play.google.com" target="_blank" rel="noopener noreferrer">
                <Image src="/images/play-store.png" alt="Play Store" width={120} height={40} className="h-8 w-auto" />
              </a>
            </div>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <a href="https://instagram.com" className="text-gray-600 hover:text-pink-500">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="https://facebook.com" className="text-gray-600 hover:text-blue-600">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="bg-blue-500 text-white rounded-full p-1.5 hover:bg-blue-600">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.51 20h-.08a10.87 10.87 0 0 1-4.65-1.09A1.38 1.38 0 0 1 3 17.47a1.41 1.41 0 0 1 .39-.93l.12-.08a2.42 2.42 0 0 0 .54-.54A3.55 3.55 0 0 0 4.5 14a9.83 9.83 0 0 0-.33-3.81 10 10 0 0 1 17.66 0A9.86 9.86 0 0 0 21.5 14a3.59 3.59 0 0 0 .45 1.94 2.5 2.5 0 0 0 .54.54l.11.08a1.58 1.58 0 0 1 .4.93 1.38 1.38 0 0 1-.77 1.33A10.72 10.72 0 0 1 17.58 20h-.08a10.86 10.86 0 0 1-9 0z"></path>
                </svg>
              </a>
            </div>
          </div>
          <div className="mt-4 text-center text-xs text-gray-500">
            © 2016 Nortis Rise Co., Ltd. ALL RIGHTS RESERVED
          </div>
        </div>
      </footer>
    </div>
  )
} 
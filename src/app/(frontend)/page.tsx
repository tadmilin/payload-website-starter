'use client'

import React, { useEffect, useState, useRef } from 'react'
import Link from 'next/link'

export default function HomePage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    setIsLoaded(true);

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
    <div className="flex flex-col min-h-screen bg-[#01121f] text-white overflow-hidden">
      {/* Header */}
      <header className={`p-4 flex justify-between items-center transition-opacity duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'} absolute top-0 left-0 right-0 z-50`}>
        <div className="flex items-center">
          <div className="text-lg font-bold">
            <span className="flex items-center">
              <span className="text-lg mr-1">☀️</span>
              <span className="text-sm tracking-wider">SOLARLAA</span>
            </span>
          </div>
        </div>
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
              <Link 
                href="/consultation" 
                className="block px-4 py-2 text-sm text-white hover:bg-[#344554] font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                ขอคำปรึกษาฟรี
              </Link>
            </div>
          )}
        </div>
      </header>

      {/* Main Content - 4 equal sections stacked vertically */}
      <div className="flex flex-col">
        {/* Hero Section - Solar made simple */}
        <section className={`relative h-screen w-full transition-all duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: "linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(1,18,31,0.6)), url('/images/1.png')",
              backgroundPosition: "center",
              backgroundSize: "cover"
            }}
          ></div>

          <div className="relative z-10 h-full flex flex-col items-center justify-between text-center px-6">
            <div className="mt-32">
              <h1 className={`text-3xl font-semibold mb-1 transition-all duration-1000 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                Solar made simple
              </h1>
              <p className={`text-sm text-white/90 transition-all duration-1000 delay-300 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                Fast calculation, seamless installation
              </p>
            </div>

            <div className="w-full mb-8">
              <Link 
                href="/consultation" 
                className={`w-full bg-[#0078ff] hover:bg-blue-600 text-white font-medium py-3 px-6 rounded text-center block transition-all duration-1000 delay-500 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
              >
                Free Online Consultation
              </Link>
            </div>
          </div>
        </section>

        {/* For Your Home Section */}
        <section className={`relative h-screen w-full transition-all duration-1000 delay-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: "linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.4)), url('/images/2.png')",
              backgroundPosition: "center",
              backgroundSize: "cover"
            }}
          ></div>

          <div className="relative z-10 h-full flex flex-col items-center justify-between text-center px-6">
            <div className="mt-32">
              <h2 className="text-3xl font-semibold mb-1">
                For Your Home
              </h2>
              <p className="text-sm text-white/90">
                Schedule a Free Online Consultation
              </p>
            </div>
            
            <div className="w-full mb-8">
              <div className="flex space-x-4 w-full">
                <Link 
                  href="/order-home" 
                  className="flex-1 bg-[#0078ff] hover:bg-blue-600 text-white font-medium py-3 px-6 rounded text-center"
                >
                  Order Now
                </Link>
                <Link 
                  href="/learn-home" 
                  className="flex-1 bg-white hover:bg-gray-100 text-gray-800 font-medium py-3 px-6 rounded text-center"
                >
                  Learn more
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* For Business Section */}
        <section className={`relative h-screen w-full transition-all duration-1000 delay-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: "linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.4)), url('/images/3.png')",
              backgroundPosition: "center",
              backgroundSize: "cover"
            }}
          ></div>

          <div className="relative z-10 h-full flex flex-col items-center justify-between text-center px-6">
            <div className="mt-32">
              <h2 className="text-3xl font-semibold mb-1">
                For Business
              </h2>
            </div>
            
            <div className="w-full mb-8">
              <div className="flex space-x-4 w-full">
                <Link 
                  href="/order-business" 
                  className="flex-1 bg-[#0078ff] hover:bg-blue-600 text-white font-medium py-3 px-6 rounded text-center"
                >
                  Order Now
                </Link>
                <Link 
                  href="/learn-business" 
                  className="flex-1 bg-white hover:bg-gray-100 text-gray-800 font-medium py-3 px-6 rounded text-center"
                >
                  Learn more
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* We are SOLARLAA Section */}
        <section className={`relative h-screen w-full transition-all duration-1000 delay-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: "linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.4)), url('/images/4.png')",
              backgroundPosition: "center",
              backgroundSize: "cover"
            }}
          ></div>

          <div className="relative z-10 h-full flex flex-col items-center justify-between text-center px-6">
            <div className="mt-32">
              <h2 className="text-3xl font-semibold mb-1">
                We are<br />SOLARLAA
              </h2>
              <p className="text-sm text-white/90">
                Trusted by 579+ communities across Thailand
              </p>
            </div>
            
            <div className="w-full mb-8">
              <Link 
                href="/about-us" 
                className="w-full bg-white hover:bg-gray-100 text-gray-800 font-medium py-3 px-6 rounded text-center block"
              >
                Get to know us
              </Link>
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className={`text-center text-white/70 text-xs py-4 border-t border-white/10 transition-all duration-1000 delay-700 ${isLoaded ? 'opacity-100' : 'opacity-0'} mt-auto`}>
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

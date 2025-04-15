'use client'

import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

// ข้อมูลสินค้าอย่างง่าย
const PRODUCTS = [
  {
    id: 1,
    name: 'Solar Panel 450W',
    price: 15000,
    imageUrl: '/images/solar-windmill.jpg',
    description: 'แผงโซลาร์เซลล์ประสิทธิภาพสูง กำลังไฟ 450 วัตต์',
    category: 'แผงโซลาร์เซลล์',
    rating: 4.8,
    stock: 20
  },
  {
    id: 2,
    name: 'Inverter 5kW',
    price: 35000,
    imageUrl: '/images/solar-field.jpg',
    description: 'อินเวอร์เตอร์ขนาด 5 กิโลวัตต์ สำหรับระบบโซลาร์เซลล์',
    category: 'อินเวอร์เตอร์',
    rating: 4.5,
    stock: 15
  },
  {
    id: 3,
    name: 'แบตเตอรี่ลิเธียม 5kWh',
    price: 45000,
    imageUrl: '/images/solar-farm.jpg',
    description: 'แบตเตอรี่ลิเธียมไอออนความจุสูง สำหรับกักเก็บพลังงานโซลาร์',
    category: 'แบตเตอรี่',
    rating: 4.7,
    stock: 10
  },
  {
    id: 4,
    name: 'ชุดโซลาร์เซลล์ขนาดเล็ก 2kW',
    price: 65000,
    imageUrl: '/images/night-home.jpg',
    description: 'ชุดโซลาร์เซลล์สำหรับบ้านขนาดเล็ก ครบชุดพร้อมติดตั้ง',
    category: 'ชุดติดตั้ง',
    rating: 4.9,
    stock: 5
  },
  {
    id: 5,
    name: 'Solar Panel 550W Premium',
    price: 18500,
    imageUrl: '/images/solar-windmill.jpg',
    description: 'แผงโซลาร์เซลล์รุ่นพรีเมียมประสิทธิภาพสูง กำลังไฟ 550 วัตต์',
    category: 'แผงโซลาร์เซลล์',
    rating: 4.9,
    stock: 12
  },
  {
    id: 6,
    name: 'อินเวอร์เตอร์ 10kW สำหรับธุรกิจ',
    price: 55000,
    imageUrl: '/images/solar-field.jpg',
    description: 'อินเวอร์เตอร์ขนาด 10 กิโลวัตต์ เหมาะสำหรับการใช้งานเชิงพาณิชย์',
    category: 'อินเวอร์เตอร์',
    rating: 4.6,
    stock: 8
  }
];

// รายการหมวดหมู่สินค้า
const CATEGORIES = [
  'ทั้งหมด',
  'แผงโซลาร์เซลล์',
  'อินเวอร์เตอร์',
  'แบตเตอรี่',
  'ชุดติดตั้ง'
];

// รายการช่วงราคา
const PRICE_RANGES = [
  { label: 'ทั้งหมด', min: 0, max: Infinity },
  { label: 'ต่ำกว่า 10,000 บาท', min: 0, max: 10000 },
  { label: '10,000 - 30,000 บาท', min: 10000, max: 30000 },
  { label: '30,001 - 50,000 บาท', min: 30001, max: 50000 },
  { label: '50,001 บาทขึ้นไป', min: 50001, max: Infinity }
];

// รายการการเรียงลำดับ
const SORT_OPTIONS = [
  { label: 'ราคา: ต่ำไปสูง', value: 'price-asc' },
  { label: 'ราคา: สูงไปต่ำ', value: 'price-desc' },
  { label: 'ชื่อสินค้า: A-Z', value: 'name-asc' },
  { label: 'การให้คะแนน: สูงสุด', value: 'rating-desc' },
  { label: 'สินค้าคงเหลือ: มากสุด', value: 'stock-desc' }
];

// เพิ่มข้อมูลภาษาสำหรับแสดงผลในหน้าร้านค้า
const translations = {
  th: {
    shopTitle: 'ร้านค้าอุปกรณ์โซลาร์เซลล์',
    shopDesc: 'เลือกซื้ออุปกรณ์คุณภาพสูงสำหรับระบบพลังงานแสงอาทิตย์ของคุณ',
    categoryLabel: 'ประเภทสินค้า',
    priceRangeLabel: 'ช่วงราคา',
    sortByLabel: 'เรียงตาม',
    stockLabel: 'สินค้าคงเหลือ',
    piecesLabel: 'ชิ้น',
    addToCartButton: 'หยิบใส่ตะกร้า',
    addedToCart: 'เพิ่ม {name} ลงในตะกร้าแล้ว',
    menuText: 'เมนู',
    copyright: '© 2024 SOLARLAA',
    freeConsultation: 'ขอคำปรึกษาฟรี',
    changeLanguage: 'เปลี่ยนภาษา: TH/EN',
    bath: 'บาท'
  },
  en: {
    shopTitle: 'Solar Equipment Shop',
    shopDesc: 'Choose high-quality equipment for your solar energy system',
    categoryLabel: 'Product Category',
    priceRangeLabel: 'Price Range',
    sortByLabel: 'Sort By',
    stockLabel: 'Stock',
    piecesLabel: 'pcs',
    addToCartButton: 'Add to Cart',
    addedToCart: 'Added {name} to cart',
    menuText: 'Menu',
    copyright: '© 2024 SOLARLAA',
    freeConsultation: 'Free Consultation',
    changeLanguage: 'Change Language: EN/TH',
    bath: 'THB'
  }
};

// แปลหมวดหมู่สินค้า
const categoryTranslations = {
  th: {
    'ทั้งหมด': 'ทั้งหมด',
    'แผงโซลาร์เซลล์': 'แผงโซลาร์เซลล์',
    'อินเวอร์เตอร์': 'อินเวอร์เตอร์',
    'แบตเตอรี่': 'แบตเตอรี่',
    'ชุดติดตั้ง': 'ชุดติดตั้ง'
  },
  en: {
    'ทั้งหมด': 'All',
    'แผงโซลาร์เซลล์': 'Solar Panels',
    'อินเวอร์เตอร์': 'Inverters',
    'แบตเตอรี่': 'Batteries',
    'ชุดติดตั้ง': 'Installation Kits'
  }
};

// แปลช่วงราคา
const priceRangeTranslations = {
  th: {
    'ทั้งหมด': 'ทั้งหมด',
    'ต่ำกว่า 10,000 บาท': 'ต่ำกว่า 10,000 บาท',
    '10,000 - 30,000 บาท': '10,000 - 30,000 บาท',
    '30,001 - 50,000 บาท': '30,001 - 50,000 บาท',
    '50,001 บาทขึ้นไป': '50,001 บาทขึ้นไป'
  },
  en: {
    'ทั้งหมด': 'All',
    'ต่ำกว่า 10,000 บาท': 'Under 10,000 THB',
    '10,000 - 30,000 บาท': '10,000 - 30,000 THB',
    '30,001 - 50,000 บาท': '30,001 - 50,000 THB',
    '50,001 บาทขึ้นไป': 'Above 50,001 THB'
  }
};

// แปลตัวเลือกการเรียงลำดับ
const sortOptionTranslations = {
  th: {
    'price-asc': 'ราคา: ต่ำไปสูง',
    'price-desc': 'ราคา: สูงไปต่ำ',
    'name-asc': 'ชื่อสินค้า: A-Z',
    'rating-desc': 'การให้คะแนน: สูงสุด',
    'stock-desc': 'สินค้าคงเหลือ: มากสุด'
  },
  en: {
    'price-asc': 'Price: Low to High',
    'price-desc': 'Price: High to Low',
    'name-asc': 'Name: A-Z',
    'rating-desc': 'Rating: Highest',
    'stock-desc': 'Stock: Most Available'
  }
};

export default function ShopPage() {
  // State
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('ทั้งหมด');
  const [selectedPriceRange, setSelectedPriceRange] = useState('ทั้งหมด');
  const [selectedSort, setSelectedSort] = useState('price-asc');
  const [cart, setCart] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState(PRODUCTS);
  const [currentLang, setCurrentLang] = useState('en');
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  const menuRef = useRef(null);
  const cartRef = useRef(null);
  
  // Effects
  useEffect(() => {
    setIsLoaded(true);
    
    // ตั้งค่าภาษาเริ่มต้นเป็น EN
    if (typeof window !== 'undefined' && !localStorage.getItem('language')) {
      localStorage.setItem('language', 'en');
      document.documentElement.setAttribute('data-lang', 'en');
    }
    
    // โหลดภาษาปัจจุบันจาก localStorage
    const currentLanguage = localStorage.getItem('language') || 'en';
    setCurrentLang(currentLanguage);
    
    // โหลดตะกร้าสินค้าจาก localStorage
    try {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    } catch (error) {
      console.error('ไม่สามารถโหลดตะกร้าสินค้าได้:', error);
    }
    
    // ปิดเมนูและตะกร้าเมื่อคลิกนอกพื้นที่
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
      if (cartRef.current && !cartRef.current.contains(event.target)) {
        setIsCartOpen(false);
      }
    };

    // ฟังก์ชันรับเหตุการณ์เปลี่ยนภาษา
    const handleLanguageChange = (event: CustomEvent) => {
      if (event.detail?.language) {
        setCurrentLang(event.detail.language);
      }
    };

    // เพิ่ม event listeners
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('toggle-language', handleLanguageChange as EventListener);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('toggle-language', handleLanguageChange as EventListener);
    };
  }, []);

  // ฟังก์ชันอ้างอิงข้อความแปลตามภาษาปัจจุบัน
  const t = (key) => {
    return translations[currentLang]?.[key] || translations.en[key];
  };

  // ฟังก์ชันแปลหมวดหมู่
  const translateCategory = (category) => {
    return categoryTranslations[currentLang]?.[category] || category;
  };

  // ฟังก์ชันแปลช่วงราคา
  const translatePriceRange = (range) => {
    return priceRangeTranslations[currentLang]?.[range] || range;
  };

  // ฟังก์ชันแปลตัวเลือกการเรียงลำดับ
  const translateSortOption = (option) => {
    return sortOptionTranslations[currentLang]?.[option] || option;
  };

  // Effect สำหรับการกรองและเรียงลำดับสินค้า
  useEffect(() => {
    // กรองตามหมวดหมู่
    let filtered = PRODUCTS;
    if (selectedCategory !== 'ทั้งหมด') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // กรองตามช่วงราคา
    const priceRange = PRICE_RANGES.find(range => range.label === selectedPriceRange);
    if (priceRange) {
      filtered = filtered.filter(product => 
        product.price >= priceRange.min && product.price <= priceRange.max
      );
    }

    // เรียงลำดับตามตัวเลือก
    switch (selectedSort) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'rating-desc':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'stock-desc':
        filtered.sort((a, b) => b.stock - a.stock);
        break;
      default:
        break;
    }

    setFilteredProducts(filtered);
  }, [selectedCategory, selectedPriceRange, selectedSort]);

  // Handlers
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLanguageToggle = () => {
    const newLang = currentLang === 'en' ? 'th' : 'en';
    
    // บันทึกลงใน localStorage
    localStorage.setItem('language', newLang);
    
    // อัพเดต DOM
    document.documentElement.setAttribute('data-lang', newLang);
    
    // อัพเดต state
    setCurrentLang(newLang);
    
    // อัพเดต cookies
    document.cookie = `locale=${newLang};path=/;max-age=31536000`;
    document.cookie = `NEXT_LOCALE=${newLang};path=/;max-age=31536000`;
    
    console.log('เปลี่ยนภาษาเป็น:', newLang);
    
    // ปิดเมนู
    setIsMenuOpen(false);
  };

  const addToCart = (product) => {
    setCart(prevCart => {
      // ตรวจสอบว่าสินค้านี้อยู่ในตะกร้าแล้วหรือไม่
      const existingItem = prevCart.find(item => item.id === product.id);
      
      let updatedCart;
      if (existingItem) {
        // เพิ่มจำนวนหากมีอยู่แล้ว
        updatedCart = prevCart.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      } else {
        // เพิ่มสินค้าใหม่พร้อมจำนวน 1
        updatedCart = [...prevCart, { ...product, quantity: 1 }];
      }
      
      // บันทึกตะกร้าลง localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('cart', JSON.stringify(updatedCart));
      }
      
      return updatedCart;
    });
    
    // แสดงตะกร้าสินค้าหลังจากเพิ่มสินค้า
    setIsCartOpen(true);
  };

  const removeFromCart = (productId) => {
    setCart(prevCart => {
      const updatedCart = prevCart.filter(item => item.id !== productId);
      
      // บันทึกตะกร้าที่อัปเดตลง localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('cart', JSON.stringify(updatedCart));
      }
      
      return updatedCart;
    });
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    
    setCart(prevCart => {
      const updatedCart = prevCart.map(item => 
        item.id === productId 
          ? { ...item, quantity: newQuantity } 
          : item
      );
      
      // บันทึกตะกร้าที่อัปเดตลง localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('cart', JSON.stringify(updatedCart));
      }
      
      return updatedCart;
    });
  };

  // เพิ่มฟังก์ชันดำเนินการชำระเงิน
  const proceedToCheckout = () => {
    // บันทึกตะกร้าลง localStorage เพื่อให้หน้า order-summary สามารถเข้าถึงได้
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // นำทางไปยังหน้า order-summary
    window.location.href = '/order-summary';
  };

  // คำนวณราคารวมของสินค้าในตะกร้า
  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  // เพิ่มฟังก์ชันตรวจสอบภาษาปัจจุบัน
  const getCurrentLanguage = () => {
    return currentLang;
  };

  // Render components
  const renderNavbar = () => (
    <div className="fixed top-0 left-0 w-full z-50 bg-white shadow-sm">
      <div className="px-4 py-3 flex justify-between items-center">
        {/* โลโก้ */}
        <div className="text-black font-bold">
          <Link href="/" className="flex items-center">
            <span className="text-lg mr-1">☀️</span>
            <span className="text-sm tracking-wider">SOLARLAA</span>
          </Link>
        </div>
        
        {/* ตะกร้าสินค้าและปุ่มเมนู */}
        <div className="flex items-center gap-4">
          <button className="relative" onClick={() => setIsCartOpen(!isCartOpen)}>
            <span className="text-xl">🛒</span>
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {cart.reduce((total, item) => total + item.quantity, 0)}
              </span>
            )}
          </button>
          
          {/* ตะกร้าสินค้าแบบ Dropdown */}
          {isCartOpen && (
            <div 
              ref={cartRef}
              className="absolute top-12 right-4 w-80 bg-white rounded-lg shadow-lg z-50 overflow-hidden"
            >
              <div className="p-4 border-b">
                <h3 className="font-semibold">ตะกร้าสินค้า ({cart.reduce((total, item) => total + item.quantity, 0)} รายการ)</h3>
              </div>
              
              {cart.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  ไม่มีสินค้าในตะกร้า
                </div>
              ) : (
                <>
                  <div className="max-h-72 overflow-y-auto">
                    {cart.map(item => (
                      <div key={item.id} className="p-3 border-b flex items-center gap-2">
                        <div className="w-12 h-12 relative flex-shrink-0">
                          <Image
                            src={item.imageUrl}
                            alt={item.name}
                            fill
                            style={{ objectFit: 'cover' }}
                            className="rounded"
                          />
                        </div>
                        <div className="flex-grow">
                          <p className="text-sm font-medium line-clamp-1">{item.name}</p>
                          <p className="text-sm text-gray-500">{item.price.toLocaleString()} {t('bath')} x {item.quantity}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-6 h-6 bg-gray-100 rounded flex items-center justify-center text-gray-600"
                          >
                            -
                          </button>
                          <span className="w-6 text-center">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-6 h-6 bg-gray-100 rounded flex items-center justify-center text-gray-600"
                          >
                            +
                          </button>
                          <button 
                            onClick={() => removeFromCart(item.id)}
                            className="ml-1 text-red-500"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="p-3 border-t">
                    <div className="flex justify-between mb-3">
                      <span className="font-semibold">รวมทั้งสิ้น:</span>
                      <span className="font-bold text-blue-600">{calculateTotal().toLocaleString()} {t('bath')}</span>
                    </div>
                    <button 
                      onClick={proceedToCheckout}
                      className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors"
                    >
                      ดำเนินการสั่งซื้อ
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
          
          {/* ปุ่ม Menu */}
          <button 
            onClick={toggleMenu}
            className="text-black"
            suppressHydrationWarning
          >
            <span className="text-sm mr-1" suppressHydrationWarning>{t('menuText')}</span>
          </button>
        </div>
      </div>

      {/* Dropdown menu */}
      {isMenuOpen && (
        <div ref={menuRef} className="absolute top-12 right-4 w-48 bg-white rounded-lg shadow-lg z-50 overflow-hidden">
          <div className="p-2">
            <Link 
              href="/" 
              className="block px-3 py-2 text-sm rounded hover:bg-gray-100"
            >
              Home
            </Link>
            <Link 
              href="/shop" 
              className="block px-3 py-2 text-sm rounded hover:bg-gray-100"
            >
              Shop
            </Link>
            <Link 
              href="/order-home" 
              className="block px-3 py-2 text-sm rounded hover:bg-gray-100"
            >
              Order
            </Link>
            <Link 
              href="/contact" 
              className="block px-3 py-2 text-sm rounded hover:bg-gray-100"
            >
              Contact Us
            </Link>
            <hr className="my-1" />
            <button 
              onClick={handleLanguageToggle}
              className="w-full text-left px-3 py-2 text-sm rounded hover:bg-gray-100"
            >
              {t('changeLanguage')}
            </button>
          </div>
        </div>
      )}
    </div>
  );

  const renderHeader = () => (
    <div className="mb-8">
      <h1 className="text-3xl font-bold mb-2">{t('shopTitle')}</h1>
      <p className="text-gray-600">{t('shopDesc')}</p>
    </div>
  );

  const renderFilters = () => (
    <div className="mb-8 bg-gray-100 p-4 rounded-lg">
      <div className="flex flex-wrap gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('categoryLabel')}</label>
          <select 
            className="bg-white border border-gray-300 rounded px-3 py-2 text-sm"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {CATEGORIES.map(category => (
              <option key={category} value={category}>{translateCategory(category)}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('priceRangeLabel')}</label>
          <select 
            className="bg-white border border-gray-300 rounded px-3 py-2 text-sm"
            value={selectedPriceRange}
            onChange={(e) => setSelectedPriceRange(e.target.value)}
          >
            {PRICE_RANGES.map(range => (
              <option key={range.label} value={range.label}>{translatePriceRange(range.label)}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('sortByLabel')}</label>
          <select 
            className="bg-white border border-gray-300 rounded px-3 py-2 text-sm"
            value={selectedSort}
            onChange={(e) => setSelectedSort(e.target.value)}
          >
            {SORT_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>{translateSortOption(option.value)}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );

  const renderProductGrid = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {filteredProducts.map(product => (
        <div 
          key={product.id} 
          className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="relative h-52">
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              style={{ objectFit: 'cover' }}
            />
            {/* แสดงหมวดหมู่ */}
            <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
              {translateCategory(product.category)}
            </div>
          </div>
          <div className="p-4">
            <h3 className="font-semibold text-lg mb-1 line-clamp-2">{product.name}</h3>
            <p className="text-gray-500 text-sm mb-2 line-clamp-2">{product.description}</p>
            <div className="flex items-center justify-between mb-2">
              <p className="font-bold text-blue-600">{product.price.toLocaleString()} {t('bath')}</p>
              <div className="flex items-center">
                <span className="text-yellow-400 mr-1">★</span>
                <span className="text-sm text-gray-700">{product.rating}</span>
              </div>
            </div>
            <div className="text-sm text-gray-500 mb-3">
              {t('stockLabel')}: {product.stock} {t('piecesLabel')}
            </div>
            <button 
              onClick={() => addToCart(product)}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors"
            >
              {t('addToCartButton')}
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  const renderFooter = () => (
    <footer className="bg-[#01121f] text-white py-4 mt-auto">
      <div className="container mx-auto px-4 text-center">
        <p className="text-sm text-gray-400">{t('copyright')}</p>
        <div className="mt-2">
          <Link 
            href="/ขอคำปรึกษาฟรี"
            className="text-sm text-blue-400 hover:text-blue-300"
          >
            {t('freeConsultation')}
          </Link>
        </div>
      </div>
    </footer>
  );

  // Main render
  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-900">
      {renderNavbar()}

      {/* หน้าร้านค้า */}
      <div className="container mx-auto px-4 pt-20 pb-12">
        {renderHeader()}
        {renderFilters()}
        {renderProductGrid()}
      </div>

      {renderFooter()}
    </div>
  )
} 
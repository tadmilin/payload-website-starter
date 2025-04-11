'use client'

// เพิ่ม polyfills สำหรับ hooks ที่ react-i18next ใช้งาน
import React from 'react'

// Export hooks ที่ react-i18next พยายามใช้งาน
export const useContext = React.useContext
export const createContext = React.createContext
export const useRef = React.useRef

// Export ค่าเริ่มต้นเพื่อป้องกันการ import error
export default {
  useContext,
  createContext,
  useRef
} 
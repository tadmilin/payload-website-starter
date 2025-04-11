'use client'

import React from 'react'

// ช่วยแก้ปัญหา hooks ใน react-i18next ที่พยายาม import จาก 'react'
export const useContext = React.useContext
export const createContext = React.createContext
export const useRef = React.useRef
export const useReducer = React.useReducer
export const useState = React.useState
export const useCallback = React.useCallback
export const useEffect = React.useEffect
export const useMemo = React.useMemo

// ส่งออกเป็นค่าเริ่มต้น
export default {
  useContext,
  createContext,
  useRef,
  useReducer,
  useState,
  useCallback,
  useEffect,
  useMemo
} 
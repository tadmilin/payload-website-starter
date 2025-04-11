// สร้างเพื่อใช้เป็น Webpack module alias
import * as React from 'react'

// นำออก hooks ที่ react-i18next ต้องการ
export const {
  useContext,
  createContext,
  useRef,
  useReducer,
  useState,
  useCallback,
  useEffect,
  useMemo
} = React

// ส่งออกเป็นค่าเริ่มต้น
export default React 
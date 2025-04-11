'use client'

// Override React hooks to prevent import error
import React from 'react'

if (typeof window !== 'undefined') {
  window.React = React
  window.__REACT_PROVIDED__ = true
} 
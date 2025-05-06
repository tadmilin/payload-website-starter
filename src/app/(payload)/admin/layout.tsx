import { UploadHandlersProvider } from '@/providers/UploadHandlersProvider';
import React from 'react';
import { Providers } from './providers';

/**
 * Layout สำหรับ admin route
 * จำเป็นต้องเพิ่ม UploadHandlersProvider เพื่อแก้ไขปัญหา
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <UploadHandlersProvider>
      <Providers>{children}</Providers>
    </UploadHandlersProvider>
  );
}

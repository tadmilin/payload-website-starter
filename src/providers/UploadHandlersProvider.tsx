'use client';

/**
 * Provider สำหรับแก้ไขปัญหา useUploadHandlers ในหน้า admin
 * เนื่องจากเกิดข้อผิดพลาด: useUploadHandlers must be used within UploadHandlersProvider
 */
import React, { createContext, useContext, useState } from 'react';

interface UploadHandler {
  id: string;
  handleUpload: (files: File[]) => Promise<any>;
}

interface UploadHandlersContextType {
  handlers: Record<string, UploadHandler>;
  registerHandler: (handler: UploadHandler) => void;
  unregisterHandler: (id: string) => void;
}

const UploadHandlersContext = createContext<UploadHandlersContextType | null>(null);

export const useUploadHandlers = (): UploadHandlersContextType => {
  const context = useContext(UploadHandlersContext);
  if (!context) {
    throw new Error('useUploadHandlers must be used within UploadHandlersProvider');
  }
  return context;
};

export const UploadHandlersProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [handlers, setHandlers] = useState<Record<string, UploadHandler>>({});

  const registerHandler = (handler: UploadHandler) => {
    setHandlers((prev) => ({
      ...prev,
      [handler.id]: handler,
    }));
  };

  const unregisterHandler = (id: string) => {
    setHandlers((prev) => {
      const newHandlers = { ...prev };
      delete newHandlers[id];
      return newHandlers;
    });
  };

  return (
    <UploadHandlersContext.Provider
      value={{
        handlers,
        registerHandler,
        unregisterHandler,
      }}
    >
      {children}
    </UploadHandlersContext.Provider>
  );
};

export default UploadHandlersProvider;

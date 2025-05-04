"use client";

import { createContext, useContext, useState, ReactNode } from 'react';

type UIContextType = {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
};

const UIContext = createContext<UIContextType | undefined>(undefined);

type UIProviderProps = {
  children: ReactNode;
};

export function UIProvider({ children }: UIProviderProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <UIContext.Provider value={{ isModalOpen, setIsModalOpen }}>
      {children}
    </UIContext.Provider>
  );
}

export const useUI = () => {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
};

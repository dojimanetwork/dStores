import React, { createContext, useContext, useState } from 'react';

interface GeneratedLayout {
  id: string;
  timestamp: number;
  layoutHTML: string;
  brand: string;
  industry: string;
  theme: string;
}

interface LayoutContextType {
  recentLayouts: GeneratedLayout[];
  addLayout: (layout: Omit<GeneratedLayout, 'id' | 'timestamp'>) => void;
  getLayout: (id: string) => GeneratedLayout | undefined;
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export function LayoutProvider({ children }: { children: React.ReactNode }) {
  const [recentLayouts, setRecentLayouts] = useState<GeneratedLayout[]>([]);

  const addLayout = (layout: Omit<GeneratedLayout, 'id' | 'timestamp'>) => {
    const newLayout: GeneratedLayout = {
      ...layout,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
    };

    setRecentLayouts(prev => {
      const updated = [newLayout, ...prev].slice(0, 2);
      return updated;
    });
  };

  const getLayout = (id: string) => {
    return recentLayouts.find(layout => layout.id === id);
  };

  return (
    <LayoutContext.Provider value={{ recentLayouts, addLayout, getLayout }}>
      {children}
    </LayoutContext.Provider>
  );
}

export const useLayout = () => {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error('useLayout must be used within a LayoutProvider');
  }
  return context;
}; 
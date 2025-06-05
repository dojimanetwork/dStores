import React, { createContext, useContext, useState, useEffect } from 'react';

type TemplateType = 'template' | 'ai' | null;

interface Product {
  id: string;
  name: string;
  price: number;
  image?: string;
  source?: 'manual' | 'dstores' | 'amazon' | 'alibaba';
}

interface StoreData {
  templateOption: TemplateType;
  products: Product[];
  shippingProvider: string | null;
  paymentProviders: string[];
  domainName: string;
}

interface StoreContextType extends StoreData {
  setTemplateOption: (option: TemplateType) => void;
  addProduct: (product: Product) => void;
  setShippingProvider: (provider: string) => void;
  setPaymentProviders: (providers: string[]) => void;
  setDomainName: (domain: string) => void;
  isLoaded: boolean;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [templateOption, setTemplateOption] = useState<TemplateType>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [shippingProvider, setShippingProvider] = useState<string | null>(null);
  const [paymentProviders, setPaymentProviders] = useState<string[]>([]);
  const [domainName, setDomainName] = useState<string>('');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Mark as loaded after first render to handle SSR
    setIsLoaded(true);
    
    // Load from localStorage if available
    try {
      const savedData = localStorage.getItem('storeData');
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        setTemplateOption(parsedData.templateOption || null);
        setProducts(parsedData.products || []);
        setShippingProvider(parsedData.shippingProvider || null);
        setPaymentProviders(parsedData.paymentProviders || []);
        setDomainName(parsedData.domainName || '');
      }
    } catch (error) {
      console.warn('Failed to load store data from localStorage:', error);
    }
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    if (isLoaded) {
      try {
        const dataToSave = {
          templateOption,
          products,
          shippingProvider,
          paymentProviders,
          domainName
        };
        localStorage.setItem('storeData', JSON.stringify(dataToSave));
      } catch (error) {
        console.warn('Failed to save store data to localStorage:', error);
      }
    }
  }, [isLoaded, templateOption, products, shippingProvider, paymentProviders, domainName]);

  const addProduct = (product: Product) => {
    setProducts((prev) => {
      const exists = prev.find(p => p.id === product.id);
      if (exists) {
        return prev.map(p => p.id === product.id ? product : p);
      }
      return [...prev, product];
    });
  };

  const contextValue: StoreContextType = {
    templateOption,
    products,
    shippingProvider,
    paymentProviders,
    domainName,
    setTemplateOption,
    addProduct,
    setShippingProvider,
    setPaymentProviders,
    setDomainName,
    isLoaded
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = (): StoreContextType => {
  const context = useContext(StoreContext);
  
  if (!context) {
    // More detailed error with suggestions
    const error = new Error(
      'useStore must be used within a StoreProvider. ' +
      'Make sure your component is wrapped with <StoreProvider> or accessed through the proper app structure.'
    );
    console.error('StoreContext Error:', {
      error: error.message,
      suggestion: 'Check that _app.tsx includes StoreProvider and you\'re not accessing this outside the React tree'
    });
    throw error;
  }
  
  return context;
};

// Safe hook that returns null if provider is not available (for optional usage)
export const useStoreOptional = (): StoreContextType | null => {
  try {
    return useContext(StoreContext) || null;
  } catch {
    return null;
  }
};

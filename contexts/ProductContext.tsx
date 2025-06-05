import React, { createContext, useContext, useState } from 'react';

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
}

interface ProductContextType {
  products: Product[];
  addProduct: (product: Product) => void;
  removeProduct: (id: string) => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function ProductProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);

  const addProduct = (product: Product) => {
    setProducts([...products, product]);
  };

  const removeProduct = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
  };

  return (
    <ProductContext.Provider value={{ products, addProduct, removeProduct }}>
      {children}
    </ProductContext.Provider>
  );
}

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) throw new Error('useProducts must be used within ProductProvider');
  return context;
}; 
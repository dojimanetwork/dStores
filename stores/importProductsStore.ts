import { create } from 'zustand';

export interface ImportedProduct {
    id: string;
    title: string;
    price: number;
    image: string;
    description: string;
    link: string;
    source: string;
}

interface ImportProductsState {
    importedProducts: ImportedProduct[];
    setImportedProducts: (products: ImportedProduct[]) => void;
    clearImportedProducts: () => void;
}

export const useImportProductsStore = create<ImportProductsState>((set) => ({
    importedProducts: [],
    setImportedProducts: (products) => set({ importedProducts: products }),
    clearImportedProducts: () => set({ importedProducts: [] }),
})); 
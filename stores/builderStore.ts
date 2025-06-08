import { create } from 'zustand';

// Component configuration interface
interface ComponentConfig {
  id: string;
  type: string;
  props: Record<string, any>;
  children?: ComponentConfig[];
  position: { x: number; y: number };
  size: { width: number; height: number };
}

// Theme configuration interface
interface Theme {
  id: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
    border: string;
  };
  fonts: {
    heading: string;
    body: string;
    sizes: {
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
    };
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  borderRadius: {
    none: string;
    sm: string;
    md: string;
    lg: string;
    full: string;
  };
}

// Page configuration interface
interface PageConfig {
  id: string;
  name: string;
  slug: string;
  components: ComponentConfig[];
  theme: Theme;
  meta: {
    title: string;
    description: string;
  };
}

// Store interface
interface BuilderState {
  // Current page being edited
  currentPage: PageConfig | null;
  
  // Available pages
  pages: PageConfig[];
  
  // Available themes
  themes: Theme[];
  
  // Current theme
  currentTheme: Theme;
  
  // Selected component
  selectedComponent: string | null;
  
  // Editing mode
  isEditing: boolean;
  
  // Preview mode
  isPreview: boolean;
  
  // User's products (fetched dynamically)
  products: any[];
  
  // Shopping cart state
  cart: {
    items: any[];
    isOpen: boolean;
    totalItems: number;
    totalPrice: number;
  };
  
  // Search state
  search: {
    query: string;
    results: any[];
    isOpen: boolean;
  };
  
  // Store info
  storeInfo: {
    name: string;
    description: string;
    email: string;
    phone: string;
    address: string;
    socialLinks: {
      facebook: string;
      instagram: string;
      twitter: string;
    };
  };
  
  // Navigation state
  currentView: 'home' | 'products' | 'about' | 'contact' | 'search' | 'cart';
  
  // Actions
  setCurrentPage: (page: PageConfig) => void;
  addComponent: (component: ComponentConfig) => void;
  updateComponent: (id: string, props: Partial<ComponentConfig>) => void;
  removeComponent: (id: string) => void;
  selectComponent: (id: string | null) => void;
  setTheme: (theme: Theme) => void;
  toggleEditing: () => void;
  togglePreview: () => void;
  savePages: () => void;
  loadPages: () => void;
  setProducts: (products: any[]) => void;
  duplicateComponent: (id: string) => void;
  moveComponent: (id: string, newPosition: { x: number; y: number }) => void;
  reorderComponents: (startIndex: number, endIndex: number) => void;
  moveComponentUp: (id: string) => void;
  moveComponentDown: (id: string) => void;
  
  // Cart actions
  addToCart: (product: any) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  toggleCart: () => void;
  clearCart: () => void;
  
  // Search actions
  setSearchQuery: (query: string) => void;
  performSearch: () => void;
  toggleSearch: () => void;
  
  // Navigation actions
  setCurrentView: (view: 'home' | 'products' | 'about' | 'contact' | 'search' | 'cart') => void;
  
  // Store info actions
  updateStoreInfo: (info: Partial<any>) => void;
}

// Default themes
const defaultThemes: Theme[] = [
  {
    id: 'modern',
    name: 'Modern Blue',
    colors: {
      primary: '#2563eb',
      secondary: '#64748b',
      accent: '#f59e0b',
      background: '#ffffff',
      text: '#1f2937',
      border: '#e5e7eb'
    },
    fonts: {
      heading: 'Inter, sans-serif',
      body: 'Inter, sans-serif',
      sizes: {
        xs: '0.75rem',
        sm: '0.875rem',
        md: '1rem',
        lg: '1.125rem',
        xl: '1.25rem'
      }
    },
    spacing: {
      xs: '0.25rem',
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '3rem'
    },
    borderRadius: {
      none: '0',
      sm: '0.125rem',
      md: '0.375rem',
      lg: '0.5rem',
      full: '9999px'
    }
  },
  {
    id: 'elegant',
    name: 'Elegant Dark',
    colors: {
      primary: '#7c3aed',
      secondary: '#6b7280',
      accent: '#ef4444',
      background: '#111827',
      text: '#f9fafb',
      border: '#374151'
    },
    fonts: {
      heading: 'Playfair Display, serif',
      body: 'Inter, sans-serif',
      sizes: {
        xs: '0.75rem',
        sm: '0.875rem',
        md: '1rem',
        lg: '1.125rem',
        xl: '1.25rem'
      }
    },
    spacing: {
      xs: '0.25rem',
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '3rem'
    },
    borderRadius: {
      none: '0',
      sm: '0.125rem',
      md: '0.375rem',
      lg: '0.5rem',
      full: '9999px'
    }
  },
  {
    id: 'minimal',
    name: 'Minimal Clean',
    colors: {
      primary: '#000000',
      secondary: '#6b7280',
      accent: '#10b981',
      background: '#fafafa',
      text: '#111827',
      border: '#d1d5db'
    },
    fonts: {
      heading: 'Helvetica Neue, sans-serif',
      body: 'Helvetica Neue, sans-serif',
      sizes: {
        xs: '0.75rem',
        sm: '0.875rem',
        md: '1rem',
        lg: '1.125rem',
        xl: '1.25rem'
      }
    },
    spacing: {
      xs: '0.25rem',
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '3rem'
    },
    borderRadius: {
      none: '0',
      sm: '0.125rem',
      md: '0.375rem',
      lg: '0.5rem',
      full: '9999px'
    }
  }
];

export const useBuilderStore = create<BuilderState>((set, get) => ({
  currentPage: null,
  pages: [],
  themes: defaultThemes,
  currentTheme: defaultThemes[0],
  selectedComponent: null,
  isEditing: false,
  isPreview: false,
  products: [],
  cart: {
    items: [],
    isOpen: false,
    totalItems: 0,
    totalPrice: 0
  },
  search: {
    query: '',
    results: [],
    isOpen: false
  },
  storeInfo: {
    name: '',
    description: '',
    email: '',
    phone: '',
    address: '',
    socialLinks: {
      facebook: '',
      instagram: '',
      twitter: ''
    }
  },
  currentView: 'home',

  setCurrentPage: (page) => set({ currentPage: page }),

  addComponent: (component) => set((state) => {
    if (!state.currentPage) {
      // If no current page, create a default page first
      const defaultPage = {
        id: 'home',
        name: 'Home Page',
        slug: 'home',
        components: [component],
        theme: state.currentTheme,
        meta: {
          title: 'My Store',
          description: 'Welcome to my store'
        }
      };
      return { currentPage: defaultPage };
    }
    
    return {
      currentPage: {
        ...state.currentPage,
        components: [...state.currentPage.components, component]
      }
    };
  }),

  updateComponent: (id, updates) => set((state) => {
    if (!state.currentPage || !state.currentPage.components) return state;

    const updateComponentRecursive = (components: ComponentConfig[]): ComponentConfig[] => {
      return components.map(component => {
        if (component.id === id) {
          return { ...component, ...updates };
        }
        if (component.children) {
          return {
            ...component,
            children: updateComponentRecursive(component.children)
          };
        }
        return component;
      });
    };

    return {
      currentPage: {
        ...state.currentPage,
        components: updateComponentRecursive(state.currentPage.components)
      }
    };
  }),

  removeComponent: (id) => set((state) => {
    if (!state.currentPage || !state.currentPage.components) return state;

    const removeComponentRecursive = (components: ComponentConfig[]): ComponentConfig[] => {
      return components.filter(component => {
        if (component.id === id) return false;
        if (component.children) {
          component.children = removeComponentRecursive(component.children);
        }
        return true;
      });
    };

    return {
      currentPage: {
        ...state.currentPage,
        components: removeComponentRecursive(state.currentPage.components)
      }
    };
  }),

  selectComponent: (id) => set({ selectedComponent: id }),

  setTheme: (theme) => set((state) => ({
    currentTheme: theme,
    currentPage: state.currentPage ? {
      ...state.currentPage,
      theme
    } : null
  })),

  toggleEditing: () => set((state) => ({ isEditing: !state.isEditing })),

  togglePreview: () => set((state) => ({ isPreview: !state.isPreview })),

  savePages: () => {
    const state = get();
    localStorage.setItem('builderPages', JSON.stringify(state.pages));
    localStorage.setItem('currentPage', JSON.stringify(state.currentPage));
    localStorage.setItem('storeInfo', JSON.stringify(state.storeInfo));
  },

  loadPages: () => {
    try {
      const savedPages = localStorage.getItem('builderPages');
      const savedCurrentPage = localStorage.getItem('currentPage');
      const savedStoreInfo = localStorage.getItem('storeInfo');
      
      if (savedPages) {
        const pages = JSON.parse(savedPages);
        set({ pages });
      }
      
      if (savedCurrentPage) {
        const currentPage = JSON.parse(savedCurrentPage);
        set({ currentPage });
      }
      
      if (savedStoreInfo) {
        const storeInfo = JSON.parse(savedStoreInfo);
        set({ storeInfo });
      }
    } catch (error) {
      console.error('Error loading pages:', error);
    }
  },

  setProducts: (products) => set({ products: Array.isArray(products) ? products : [] }),

  duplicateComponent: (id) => set((state) => {
    if (!state.currentPage || !state.currentPage.components) return state;

    const findAndDuplicateComponent = (components: ComponentConfig[]): ComponentConfig[] => {
      const newComponents = [...components];
      for (let i = 0; i < components.length; i++) {
        if (components[i].id === id) {
          const duplicated = {
            ...components[i],
            id: `${components[i].id}_copy_${Date.now()}`,
            position: {
              x: components[i].position.x + 20,
              y: components[i].position.y + 20
            }
          };
          newComponents.splice(i + 1, 0, duplicated);
          break;
        }
        if (components[i].children) {
          newComponents[i] = {
            ...components[i],
            children: findAndDuplicateComponent(components[i].children!)
          };
        }
      }
      return newComponents;
    };

    return {
      currentPage: {
        ...state.currentPage,
        components: findAndDuplicateComponent(state.currentPage.components)
      }
    };
  }),

  moveComponent: (id, newPosition) => set((state) => {
    const { updateComponent } = get();
    updateComponent(id, { position: newPosition });
    return state;
  }),

  reorderComponents: (startIndex: number, endIndex: number) => set((state) => {
    const { currentPage } = get();
    if (!currentPage || !currentPage.components) return state;

    const components = [...currentPage.components];
    const [movedComponent] = components.splice(startIndex, 1);
    components.splice(endIndex, 0, movedComponent);

    return {
      currentPage: {
        ...currentPage,
        components
      }
    };
  }),

  moveComponentUp: (id) => set((state) => {
    const { currentPage } = get();
    if (!currentPage || !currentPage.components) return state;

    const components = [...currentPage.components];
    const index = components.findIndex(component => component.id === id);
    if (index > 0) {
      // Swap components
      [components[index], components[index - 1]] = [components[index - 1], components[index]];
      
      return {
        currentPage: {
          ...currentPage,
          components
        }
      };
    }
    return state;
  }),

  moveComponentDown: (id) => set((state) => {
    const { currentPage } = get();
    if (!currentPage || !currentPage.components) return state;

    const components = [...currentPage.components];
    const index = components.findIndex(component => component.id === id);
    if (index >= 0 && index < components.length - 1) {
      // Swap components
      [components[index], components[index + 1]] = [components[index + 1], components[index]];
      
      return {
        currentPage: {
          ...currentPage,
          components
        }
      };
    }
    return state;
  }),

  addToCart: (product) => set((state) => {
    const { cart } = state;
    const updatedCart = {
      ...cart,
      items: [...cart.items, product],
      totalItems: cart.totalItems + 1,
      totalPrice: cart.totalPrice + product.price
    };
    return { cart: updatedCart };
  }),

  removeFromCart: (productId) => set((state) => {
    const { cart } = state;
    const updatedCart = {
      ...cart,
      items: cart.items.filter(item => item.id !== productId),
      totalItems: cart.totalItems - 1,
      totalPrice: cart.totalPrice - cart.items.find(item => item.id === productId)?.price || 0
    };
    return { cart: updatedCart };
  }),

  updateCartQuantity: (productId, quantity) => set((state) => {
    const { cart } = state;
    const updatedCart = {
      ...cart,
      items: cart.items.map(item =>
        item.id === productId ? { ...item, quantity } : item
      ),
      totalItems: cart.totalItems + quantity - (cart.items.find(item => item.id === productId)?.quantity || 0),
      totalPrice: cart.totalPrice + quantity * (cart.items.find(item => item.id === productId)?.price || 0) - (cart.items.find(item => item.id === productId)?.quantity || 0) * (cart.items.find(item => item.id === productId)?.price || 0)
    };
    return { cart: updatedCart };
  }),

  toggleCart: () => set((state) => ({
    cart: {
      ...state.cart,
      isOpen: !state.cart.isOpen
    }
  })),

  clearCart: () => set({
    cart: {
      items: [],
      isOpen: false,
      totalItems: 0,
      totalPrice: 0
    }
  }),

  setSearchQuery: (query) => set({
    search: {
      ...get().search,
      query
    }
  }),

  performSearch: () => {
    const { search, products } = get();
    if (search.query.trim() === '') {
      set({
        search: {
          ...search,
          results: []
        }
      });
      return;
    }
    
    const results = products.filter(product =>
      product.name.toLowerCase().includes(search.query.toLowerCase()) ||
      product.description?.toLowerCase().includes(search.query.toLowerCase()) ||
      product.category?.toLowerCase().includes(search.query.toLowerCase())
    );
    
    set({
      search: {
        ...search,
        results
      }
    });
  },

  toggleSearch: () => set((state) => ({
    search: {
      ...state.search,
      isOpen: !state.search.isOpen
    }
  })),

  setCurrentView: (view) => set({ currentView: view }),

  updateStoreInfo: (info) => set((state) => {
    const updatedStoreInfo = {
      ...state.storeInfo,
      ...info
    };
    
    // Save to localStorage immediately
    localStorage.setItem('storeInfo', JSON.stringify(updatedStoreInfo));
    
    return {
      storeInfo: updatedStoreInfo
    };
  })
})); 
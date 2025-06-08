import DashboardLayout from '@/components/DashboardLayout';
import { useState, useEffect } from 'react';
import { useSetup } from '@/contexts/SetupContext';
import { useSetupCompletion } from '@/contexts/SetupCompletionContext';
import { 
  CubeIcon, 
  ShoppingBagIcon, 
  PlusIcon, 
  TrashIcon,
  ArrowLeftIcon,
  ShoppingCartIcon,
  LinkIcon,
  GlobeAltIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

const importOptions = [
  { 
    name: 'Manual Entry', 
    id: 'manual',
    icon: CubeIcon,
    description: 'Add products manually with detailed information',
    difficulty: 'Easy'
  },
  { 
    name: 'Dstores Import', 
    id: 'dstores',
    icon: ShoppingBagIcon,
    description: 'Import your existing Dstores store products',
    difficulty: 'Easy'
  },
  { 
    name: 'Amazon Import', 
    id: 'amazon',
    icon: ShoppingCartIcon,
    description: 'Import products from your Amazon store',
    difficulty: 'Medium'
  },
  { 
    name: 'Alibaba Dropshipping', 
    id: 'alibaba',
    icon: GlobeAltIcon,
    description: 'Set up dropshipping with Alibaba suppliers',
    difficulty: 'Advanced'
  },
];

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image?: string;
  status: 'active' | 'draft' | 'inactive' | 'out_of_stock';
  stock?: number;
  source?: string;
}

// Component for editing database products
function DatabaseProductRow({ 
  product, 
  onUpdate, 
  onRemove 
}: { 
  product: Product; 
  onUpdate: (id: string, field: keyof Product, value: any) => void;
  onRemove: (id: string) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedProduct, setEditedProduct] = useState(product);

  const handleSave = () => {
    // Update all changed fields
    Object.keys(editedProduct).forEach(key => {
      const field = key as keyof Product;
      if (editedProduct[field] !== product[field]) {
        onUpdate(product.id, field, editedProduct[field]);
      }
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedProduct(product);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="bg-white p-4 border border-blue-300 rounded-lg">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
            <input
              type="text"
              value={editedProduct.name}
              onChange={(e) => setEditedProduct(prev => ({...prev, name: e.target.value}))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
            <input
              type="number"
              value={editedProduct.price}
              onChange={(e) => setEditedProduct(prev => ({...prev, price: parseFloat(e.target.value) || 0}))}
              min="0"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={editedProduct.status}
              onChange={(e) => setEditedProduct(prev => ({...prev, status: e.target.value as Product['status']}))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="inactive">Inactive</option>
              <option value="out_of_stock">Out of Stock</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
            <input
              type="number"
              value={editedProduct.stock || 0}
              onChange={(e) => setEditedProduct(prev => ({...prev, stock: parseInt(e.target.value) || 0}))}
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            value={editedProduct.description}
            onChange={(e) => setEditedProduct(prev => ({...prev, description: e.target.value}))}
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm resize-none"
          />
        </div>
        <div className="flex justify-end space-x-3">
          <button
            onClick={handleCancel}
            className="px-3 py-2 text-gray-600 hover:text-gray-800 text-sm font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg"
          >
            Save Changes
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-3 border border-gray-200 rounded-lg">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0 pr-3">
          <div className="flex items-center space-x-2 mb-1">
            <h4 className="font-medium text-gray-900 text-sm truncate">{product.name}</h4>
            <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium flex-shrink-0 ${
              product.status === 'active' ? 'bg-green-100 text-green-800' :
              product.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
              product.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
              'bg-red-100 text-red-800'
            }`}>
              {product.status === 'active' ? 'Active' :
               product.status === 'draft' ? 'Draft' :
               product.status === 'inactive' ? 'Inactive' :
               'Out of Stock'}
            </span>
          </div>
          {/* Source Badge */}
          <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium mb-2 ${getSourceBadgeColor(getProductSource(product))}`}>
            {getSourceIcon(getProductSource(product))}
            <span className="ml-1">{getSourceLabel(getProductSource(product))}</span>
          </span>
          <div className="flex items-center space-x-3 text-xs text-gray-600">
            <span className="font-semibold text-green-600">${product.price.toFixed(2)}</span>
            <span>Stock: {product.stock || 0}</span>
          </div>
          {product.description && (
            <p className="text-xs text-gray-500 mt-1 line-clamp-2">{product.description}</p>
          )}
        </div>
        <div className="flex flex-col space-y-1 flex-shrink-0">
          <button
            onClick={() => setIsEditing(true)}
            className="px-2 py-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50 text-xs font-medium rounded transition-colors"
          >
            Edit
          </button>
          <button
            onClick={() => onRemove(product.id)}
            className="px-2 py-1 text-red-600 hover:text-red-700 hover:bg-red-50 text-xs font-medium rounded transition-colors"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}

// Helper functions for source display
function getProductSource(product: Product): string {
  // Use source from product if available (for database products)
  if (product.source) {
    return product.source;
  }
  
  // For imported products, get from ID prefix
  if (product.id.startsWith('manual-')) return 'manual';
  if (product.id.startsWith('dstores-')) return 'dstores';
  if (product.id.startsWith('amazon-')) return 'amazon';
  if (product.id.startsWith('alibaba-')) return 'alibaba';
  
  return 'unknown';
}

function getSourceLabel(source: string): string {
  switch (source) {
    case 'manual': return 'Manual';
    case 'dstores': return 'Dstores';
    case 'amazon': return 'Amazon';
    case 'alibaba': return 'Alibaba';
    case 'seed': return 'Sample Data';
    case 'database': return 'Database';
    default: return 'Unknown';
  }
}

function getSourceIcon(source: string): React.JSX.Element {
  switch (source) {
    case 'manual':
      return <CubeIcon className="w-3 h-3" />;
    case 'dstores':
      return <ShoppingBagIcon className="w-3 h-3" />;
    case 'amazon':
      return <ShoppingCartIcon className="w-3 h-3" />;
    case 'alibaba':
      return <GlobeAltIcon className="w-3 h-3" />;
    case 'seed':
      return <CheckCircleIcon className="w-3 h-3" />;
    default:
      return <CubeIcon className="w-3 h-3" />;
  }
}

function getSourceBadgeColor(source: string): string {
  switch (source) {
    case 'manual': return 'bg-purple-100 text-purple-800';
    case 'dstores': return 'bg-green-100 text-green-800';
    case 'amazon': return 'bg-orange-100 text-orange-800';
    case 'alibaba': return 'bg-yellow-100 text-yellow-800';
    case 'seed': return 'bg-blue-100 text-blue-800';
    default: return 'bg-gray-100 text-gray-800';
  }
}

export default function Products() {
  const { setupState, updateProducts } = useSetup();
  const { markAddProductsComplete, isStepCompleted, completionState } = useSetupCompletion();
  const [activeMethod, setActiveMethod] = useState<string | null>(null); // Currently viewing method
  const [allImportedProducts, setAllImportedProducts] = useState<{[key: string]: Product[]}>({
    manual: [],
    dstores: [],
    amazon: [],
    alibaba: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [databaseProducts, setDatabaseProducts] = useState<Product[]>([]);
  const [isDatabaseProductsOpen, setIsDatabaseProductsOpen] = useState(true);
  const [importCounts, setImportCounts] = useState({
    manual: 0,
    dstores: 0,
    amazon: 0,
    alibaba: 0
  });

  // Helper function to safely parse JSON responses
  const safeJsonParse = async (response: Response, errorContext: string) => {
    try {
      const text = await response.text();
      if (!text || text.trim() === '') {
        throw new Error(`Empty response from ${errorContext}`);
      }
      
      try {
        return JSON.parse(text);
      } catch (parseError) {
        console.error(`JSON parse error for ${errorContext}:`, parseError);
        console.error('Response text:', text);
        throw new Error(`Invalid JSON response from ${errorContext}`);
      }
    } catch (error) {
      console.error(`Error processing response from ${errorContext}:`, error);
      throw error;
    }
  };

  useEffect(() => {
    if (setupState.products.importMethod) {
      setActiveMethod(setupState.products.importMethod);
      if (setupState.products.items && setupState.products.importMethod) {
        setAllImportedProducts(prev => ({
          ...prev,
          [setupState.products.importMethod as string]: setupState.products.items as Product[]
        }));
      }
    }
    
    // Load products from database
    loadDatabaseProducts();
    
    // Load import counts from localStorage
    const savedCounts = localStorage.getItem('importCounts');
    if (savedCounts) {
      try {
        setImportCounts(JSON.parse(savedCounts));
      } catch (error) {
        console.error('Error loading import counts:', error);
      }
    }
  }, [setupState.products]);

  // Save import counts to localStorage
  useEffect(() => {
    localStorage.setItem('importCounts', JSON.stringify(importCounts));
  }, [importCounts]);

  // New function to load products from database
  const loadDatabaseProducts = async () => {
    try {
      const response = await fetch('/api/products?storeId=1');
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await safeJsonParse(response, 'products API');
      
      if (data && data.products && Array.isArray(data.products)) {
        const dbProducts = data.products.map((p: any) => ({
          id: p.id.toString(),
          name: p.name,
          price: parseFloat(p.price),
          description: p.description || '',
          status: p.metadata?.status || 'active',
          stock: p.stock_quantity || 0,
          image: p.images?.[0] || undefined,
          source: p.metadata?.source || 'database'
        }));
        setDatabaseProducts(dbProducts);
        
        // Update completion tracking based on product count
        markAddProductsComplete(dbProducts.length);
      } else {
        console.warn('Invalid products data structure:', data);
        setDatabaseProducts([]);
        markAddProductsComplete(0);
      }
    } catch (error) {
      console.error('Error loading products:', error);
      setDatabaseProducts([]);
      markAddProductsComplete(0);
      // Don't show error to user for initial load, just log it
    }
  };

  const handleImportMethodSelect = async (methodId: string) => {
    setActiveMethod(methodId);
    setError(null);
    
    // Check if this method already has products
    const existingProducts = allImportedProducts[methodId] || [];
    if (existingProducts.length > 0) {
      console.log(`Method ${methodId} already has ${existingProducts.length} products`);
      return;
    }
    
    // Only import if no products exist for this method
    setLoading(true);

    try {
      const response = await fetch('/api/import-products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          importMethod: methodId,
          credentials: {},
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const importedProducts = await safeJsonParse(response, 'import-products API');
      
      if (!Array.isArray(importedProducts)) {
        throw new Error('Invalid products data format from import API');
      }

      // Add source information to imported products
      const productsWithSource = importedProducts.map((product: any) => ({
        ...product,
        source: methodId
      }));

      // Filter out duplicates before adding to the list
      const filteredProducts = await filterOutDuplicates(productsWithSource, methodId);

      setAllImportedProducts(prev => ({
        ...prev,
        [methodId]: filteredProducts
      }));
      
      console.log(`✅ Imported ${filteredProducts.length} unique products from ${methodId} (${importedProducts.length - filteredProducts.length} duplicates prevented)`);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to import products';
      console.error('Import error:', err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleManualProductAdd = async () => {
    const newProduct: Product = {
      id: Date.now().toString(),
      name: '',
      price: 0,
      description: '',
      status: 'draft',
      stock: 0,
      source: 'manual'
    };

    // No need to check for duplicates on manual add since name is empty
    // Duplicate check will happen when user saves with actual name
    setAllImportedProducts(prev => ({
      ...prev,
      manual: [...(prev.manual || []), newProduct]
    }));
    
    updateProducts({ items: [...(allImportedProducts.manual || []), newProduct] });
  };

  const handleProductUpdate = (id: string, field: keyof Product, value: any) => {
    if (!activeMethod) return;
    
    const currentProducts = allImportedProducts[activeMethod] || [];
    const updatedProductsList = currentProducts.map(product =>
      product.id === id ? { ...product, [field]: value } : product
    );
    
    setAllImportedProducts(prev => ({
      ...prev,
      [activeMethod]: updatedProductsList
    }));
    updateProducts({ items: updatedProductsList });
    
    // Only sync to database for existing database products (numeric IDs)
    if (!id.startsWith('manual-') && !id.includes('-') && !isNaN(Number(id))) {
      syncProductToDatabase(id, { [field]: value });
    }
  };

  const handleProductRemove = (id: string) => {
    if (!activeMethod) return;
    
    const currentProducts = allImportedProducts[activeMethod] || [];
    const updatedProductsList = currentProducts.filter(p => p.id !== id);
    
    setAllImportedProducts(prev => ({
      ...prev,
      [activeMethod]: updatedProductsList
    }));
    updateProducts({ items: updatedProductsList });
    
    // Only delete from database for existing database products (numeric IDs)
    if (!id.startsWith('manual-') && !id.includes('-') && !isNaN(Number(id))) {
      deleteProductFromDatabase(id);
    }
    
    // Update completion tracking (only database products count for completion)
    markAddProductsComplete(databaseProducts.length);
  };

  // Enhanced function to handle database product removal
  const handleDatabaseProductRemove = async (id: string) => {
    try {
      await deleteProductFromDatabase(id);
      // Reload database products to reflect changes
      await loadDatabaseProducts();
    } catch (error) {
      console.error('Error removing database product:', error);
      setError('Failed to remove product from database');
    }
  };

  // Enhanced function to handle database product editing
  const handleDatabaseProductUpdate = async (id: string, field: keyof Product, value: any) => {
    try {
      // Update database products locally for immediate UI feedback
      const updatedDbProducts = databaseProducts.map(product =>
        product.id === id ? { ...product, [field]: value } : product
      );
      setDatabaseProducts(updatedDbProducts);
      
      // Sync to database
      await syncProductToDatabase(id, { [field]: value });
      
      // Reload database products to ensure consistency
      await loadDatabaseProducts();
      
    } catch (error) {
      console.error('Error updating database product:', error);
      setError('Failed to update product in database');
      // Reload to revert changes on error
      await loadDatabaseProducts();
    }
  };

  // Function to manually refresh database products
  const refreshDatabaseProducts = async () => {
    await loadDatabaseProducts();
  };

  // Enhanced function to check for duplicates before adding to import list
  const checkForDuplicate = async (productName: string, source: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/products/check-duplicate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: productName,
          source: source,
          storeId: 1
        }),
      });

      if (!response.ok) {
        console.error('Failed to check for duplicate');
        return false;
      }

      const duplicateCheck = await safeJsonParse(response, 'duplicate check API');
      return duplicateCheck.exists;
    } catch (error) {
      console.error('Error checking for duplicate:', error);
      return false;
    }
  };

  // Enhanced function to filter out duplicates from imported products
  const filterOutDuplicates = async (products: Product[], source: string): Promise<Product[]> => {
    const filteredProducts: Product[] = [];
    const duplicateNames: string[] = [];
    
    for (const product of products) {
      // Check if already exists in database
      const isDuplicateInDB = await checkForDuplicate(product.name, source);
      
      // Check if already exists in current import list
      const isDuplicateInImport = filteredProducts.some(p => 
        p.name.toLowerCase().trim() === product.name.toLowerCase().trim()
      );
      
      if (isDuplicateInDB) {
        duplicateNames.push(product.name);
        console.log(`⚠️ Skipping "${product.name}" - already exists in database`);
      } else if (isDuplicateInImport) {
        duplicateNames.push(product.name);
        console.log(`⚠️ Skipping "${product.name}" - duplicate in import list`);
      } else {
        filteredProducts.push(product);
      }
    }
    
    if (duplicateNames.length > 0) {
      const message = `Skipped ${duplicateNames.length} duplicate product(s): ${duplicateNames.slice(0, 3).join(', ')}${duplicateNames.length > 3 ? '...' : ''}`;
      console.log(`📊 Duplicate prevention: ${message}`);
    }
    
    return filteredProducts;
  };

  // New function to save manual products to database
  const saveProductToDatabase = async (product: Product) => {
    if (!activeMethod) return;
    
    try {
      // First, check if a product with the same name and source already exists
      const response = await fetch('/api/products/check-duplicate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: product.name,
          source: product.source || activeMethod || 'manual',
          storeId: 1
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const duplicateCheck = await safeJsonParse(response, 'duplicate check API');
      
      // If product already exists, update it instead of creating a new one
      if (duplicateCheck.exists) {
        console.log(`🔄 Product "${product.name}" already exists (ID: ${duplicateCheck.product.id}), updating instead of creating duplicate`);
        
        const updateResponse = await fetch(`/api/products?id=${duplicateCheck.product.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: product.name,
            description: product.description,
            price: product.price,
            stock_quantity: product.stock,
            status: product.status,
            metadata: {
              source: product.source || activeMethod || 'manual',
              originalImportMethod: activeMethod
            }
          }),
        });

        if (!updateResponse.ok) {
          throw new Error(`HTTP ${updateResponse.status}: ${updateResponse.statusText}`);
        }

        const updateResult = await safeJsonParse(updateResponse, 'update product API');
        return updateResult.product || duplicateCheck.product;
      }

      // If no duplicate exists, create new product
      console.log(`✨ Creating new product: "${product.name}" from source: ${product.source || activeMethod}`);
      const createResponse = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: product.name,
          description: product.description,
          price: product.price,
          stock_quantity: product.stock,
          status: product.status,
          metadata: {
            source: product.source || activeMethod || 'manual',
            originalImportMethod: activeMethod
          }
        }),
      });

      if (!createResponse.ok) {
        throw new Error(`HTTP ${createResponse.status}: ${createResponse.statusText}`);
      }

      const result = await safeJsonParse(createResponse, 'save product API');
      
      if (!result || !result.product || !result.product.id) {
        throw new Error('Invalid response format: missing product data');
      }
      
      // Update product with database ID
      const currentProducts = allImportedProducts[activeMethod] || [];
      const updatedProductsList = currentProducts.map(p =>
        p.id === product.id ? { ...p, id: result.product.id.toString() } : p
      );
      
      setAllImportedProducts(prev => ({
        ...prev,
        [activeMethod]: updatedProductsList
      }));
      updateProducts({ items: updatedProductsList });
      
      // Return the saved product for batch operations
      return result.product;
      
    } catch (error) {
      console.error('Error saving product:', error);
      throw error; // Re-throw to be handled by caller
    }
  };

  // New function to sync product updates to database
  const syncProductToDatabase = async (id: string, updates: any) => {
    try {
      const response = await fetch(`/api/products?id=${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const result = await safeJsonParse(response, 'update product API');
      console.log('Product updated successfully:', result);
    } catch (error) {
      console.error('Error syncing product:', error);
      throw error; // Re-throw to be handled by caller
    }
  };

  // New function to delete product from database
  const deleteProductFromDatabase = async (id: string) => {
    try {
      const response = await fetch(`/api/products?id=${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const result = await safeJsonParse(response, 'delete product API');
      console.log('Product deleted successfully:', result);
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error; // Re-throw to be handled by caller
    }
  };

  // New function to finalize manual products (save to database)
  const finalizeProducts = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const currentProducts = allImportedProducts[activeMethod || 'manual'] || [];
      
      if (currentProducts.length === 0) {
        setError('No products to save');
        return;
      }
      
      console.log(`Processing ${currentProducts.length} products from ${activeMethod}...`);
      
      const savedProducts = [];
      let successCount = 0;
      let failCount = 0;
      let updateCount = 0;
      let createCount = 0;
      
      for (const product of currentProducts) {
        try {
          // Ensure the product has the correct source from the active method
          const productWithSource = {
            ...product,
            source: activeMethod || product.source || 'manual'
          };
          
          const savedProduct = await saveProductToDatabase(productWithSource);
          savedProducts.push(savedProduct);
          successCount++;
          
          // Check if this was an update or create based on the console logs we expect
          if (savedProduct.id) {
            // This is a bit of a heuristic, but we can improve logging
            console.log(`✓ Processed: ${product.name} (ID: ${savedProduct.id})`);
          }
        } catch (error) {
          failCount++;
          console.error(`✗ Failed to save: ${product.name}`, error);
        }
      }
      
      // Reload database products to reflect all changes
      await loadDatabaseProducts();
      
      // Don't clear imported products - keep them so users can see what they imported
      // and the counts remain accurate. Users can clear selection manually if needed.
      
      if (successCount > 0) {
        console.log(`✅ Successfully processed ${successCount} products from ${activeMethod}`);
        console.log(`📊 Summary: ${successCount} total processed`);
        if (failCount > 0) {
          setError(`Processed ${successCount} products, but ${failCount} failed`);
        }
      } else {
        setError('Failed to save any products to database');
      }
      
    } catch (error) {
      console.error('Error in finalizeProducts:', error);
      setError('Failed to save products to database');
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleReImport = async () => {
    if (!activeMethod) return;
    
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/import-products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          importMethod: activeMethod,
          credentials: {},
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const importedProducts = await safeJsonParse(response, 'import-products API');
      
      if (!Array.isArray(importedProducts)) {
        throw new Error('Invalid products data format from import API');
      }

      // Add source information to imported products
      const productsWithSource = importedProducts.map((product: any) => ({
        ...product,
        source: activeMethod
      }));

      // Filter out duplicates before adding to the list
      const filteredProducts = await filterOutDuplicates(productsWithSource, activeMethod);

      setAllImportedProducts(prev => ({
        ...prev,
        [activeMethod]: filteredProducts
      }));
      
      console.log(`✅ Re-imported ${filteredProducts.length} unique products from ${activeMethod} (${importedProducts.length - filteredProducts.length} duplicates prevented)`);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to re-import products';
      console.error('Re-import error:', err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Function to clear imported products for current method
  const clearImportedProducts = () => {
    if (!activeMethod) return;
    
    setAllImportedProducts(prev => ({
      ...prev,
      [activeMethod]: []
    }));
    console.log(`🧹 Cleared imported products for ${activeMethod}`);
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        {/* Main Header with Import Methods */}
        <div className="mb-6 p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                Add Products to Your Store
              </h1>
              <p className="text-sm sm:text-base text-gray-600">
                Choose an import method or add products manually
              </p>
            </div>
            
            {/* Import Method Buttons */}
            <div className="flex flex-wrap gap-2">
              {importOptions.map((option) => {
                const IconComponent = option.icon;
                const isActive = activeMethod === option.id;
                
                // Calculate total count: imported products + database products from this source
                const importedCount = allImportedProducts[option.id]?.length || 0;
                const databaseCount = databaseProducts.filter(p => getProductSource(p) === option.id).length;
                const totalCount = importedCount + databaseCount;
                
                return (
                  <button
                    key={option.id}
                    onClick={() => handleImportMethodSelect(option.id)}
                    disabled={loading}
                    className={`relative flex items-center px-4 py-2.5 border rounded-lg text-sm font-medium transition-all hover:shadow-md ${
                      isActive
                        ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-blue-300 hover:bg-blue-50'
                    } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <IconComponent className="w-4 h-4 mr-2" />
                    <span>{option.name}</span>
                    <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-semibold min-w-[20px] text-center ${
                      isActive
                        ? 'bg-white text-blue-600'
                        : totalCount > 0 
                          ? 'bg-blue-100 text-blue-600'
                          : 'bg-gray-100 text-gray-500'
                    }`}>
                      {totalCount}
                    </span>
                    {isActive && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Responsive Layout Container */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content Area - Left Side on Desktop */}
          <div className="lg:col-span-2 space-y-6">
            {!activeMethod ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                <CubeIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select an Import Method</h3>
                <p className="text-gray-600 mb-4">
                  Choose one of the import methods above to start adding products to your store
                </p>
              </div>
            ) : (
              <div className="space-y-4 sm:space-y-6">
                {/* Error Message */}
                {error && (
                  <div className="p-3 sm:p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm sm:text-base">
                    <strong>Error:</strong> {error}
                  </div>
                )}

                {/* Loading State */}
                {loading ? (
                  <div className="text-center py-8 sm:py-12">
                    <div className="relative">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <CubeIcon className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 animate-pulse" />
                      </div>
                    </div>
                    <p className="mt-4 text-sm sm:text-base text-gray-600">Importing products...</p>
                  </div>
                ) : (
                  <>
                    {/* Header with Back Button and Add Product */}
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4">
                      <div className="flex items-center">
                        <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                          {activeMethod === 'manual' ? 'Manual Products' : `${importOptions.find(opt => opt.id === activeMethod)?.name} Products`}
                        </h2>
                      </div>

                      <div className="flex items-center gap-2">
                        {activeMethod === 'manual' && (
                          <button
                            onClick={handleManualProductAdd}
                            className="flex items-center justify-center px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm sm:text-base transition-colors touch-manipulation active:scale-95"
                          >
                            <PlusIcon className="w-4 h-4 mr-2" />
                            Add Product
                          </button>
                        )}
                        
                        {activeMethod && activeMethod !== 'manual' && allImportedProducts[activeMethod]?.length > 0 && (
                          <>
                            <button
                              onClick={handleReImport}
                              disabled={loading}
                              className="flex items-center justify-center px-4 py-2.5 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium text-sm sm:text-base transition-colors touch-manipulation active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                              </svg>
                              Re-import
                            </button>
                            
                            <button
                              onClick={() => handleProductRemove(allImportedProducts[activeMethod][0].id)}
                              disabled={loading}
                              className="flex items-center justify-center px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium text-sm sm:text-base transition-colors touch-manipulation active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <TrashIcon className="w-4 h-4 mr-2" />
                              Clear
                            </button>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Products Grid/List */}
                    <div className="space-y-3 sm:space-y-4">
                      {allImportedProducts[activeMethod]?.length === 0 ? (
                        <div className="text-center py-8 sm:py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                          <CubeIcon className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
                          {(() => {
                            // Check if there are existing database products from this source
                            const existingDbProducts = databaseProducts.filter(p => getProductSource(p) === activeMethod).length;
                            
                            if (existingDbProducts > 0) {
                              return (
                                <>
                                  <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
                                    Ready to Import More?
                                  </h3>
                                  <p className="text-sm sm:text-base text-gray-600 mb-4">
                                    You have {existingDbProducts} product{existingDbProducts !== 1 ? 's' : ''} from {getSourceLabel(activeMethod)} 
                                    already in your catalog (visible in the sidebar). 
                                    {activeMethod === 'manual' 
                                      ? ' Add more products manually below.' 
                                      : ' Click the buttons above to import more products or re-import to refresh.'}
                                  </p>
                                </>
                              );
                            } else {
                              return (
                                <>
                                  <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No products yet</h3>
                                  <p className="text-sm sm:text-base text-gray-600 mb-4">
                                    {activeMethod === 'manual' 
                                      ? 'Add your first product manually' 
                                      : 'Import products to get started'}
                                  </p>
                                </>
                              );
                            }
                          })()}
                          {activeMethod === 'manual' && (
                            <button
                              onClick={handleManualProductAdd}
                              className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm transition-colors touch-manipulation"
                            >
                              <PlusIcon className="w-4 h-4 mr-2" />
                              {(() => {
                                const existingDbProducts = databaseProducts.filter(p => getProductSource(p) === 'manual').length;
                                return existingDbProducts > 0 ? 'Add Another Product' : 'Add First Product';
                              })()}
                            </button>
                          )}
                        </div>
                      ) : (
                        <>
                          {allImportedProducts[activeMethod]?.map((product, index) => (
                            <div key={product.id} className="bg-white p-4 sm:p-6 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow">
                              {activeMethod === 'manual' ? (
                                <div className="space-y-3 sm:space-y-4">
                                  {/* Product Header */}
                                  <div className="flex justify-between items-start">
                                    <div className="flex items-center space-x-3">
                                      <h3 className="text-base sm:text-lg font-medium text-gray-900">
                                        Product #{index + 1}
                                      </h3>
                                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                        product.status === 'active' ? 'bg-green-100 text-green-800' :
                                        product.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                                        product.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
                                        'bg-red-100 text-red-800'
                                      }`}>
                                        {product.status === 'active' ? 'Active' :
                                         product.status === 'draft' ? 'Draft' :
                                         product.status === 'inactive' ? 'Inactive' :
                                         'Out of Stock'}
                                      </span>
                                    </div>
                                    <button
                                      onClick={() => handleProductRemove(product.id)}
                                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors touch-manipulation"
                                      aria-label="Remove product"
                                    >
                                      <TrashIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                                    </button>
                                  </div>

                                  {/* Form Fields */}
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                    <div>
                                      <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Product Name
                                      </label>
                                      <input
                                        type="text"
                                        value={product.name}
                                        onChange={(e) => handleProductUpdate(product.id, 'name', e.target.value)}
                                        placeholder="Enter product name"
                                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Price ($)
                                      </label>
                                      <input
                                        type="number"
                                        value={product.price || ''}
                                        onChange={(e) => handleProductUpdate(product.id, 'price', parseFloat(e.target.value) || 0)}
                                        placeholder="0.00"
                                        min="0"
                                        step="0.01"
                                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Status
                                      </label>
                                      <select
                                        value={product.status}
                                        onChange={(e) => handleProductUpdate(product.id, 'status', e.target.value as Product['status'])}
                                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                                      >
                                        <option value="active">Active</option>
                                        <option value="draft">Draft</option>
                                        <option value="inactive">Inactive</option>
                                        <option value="out_of_stock">Out of Stock</option>
                                      </select>
                                    </div>
                                    <div>
                                      <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Stock Quantity
                                      </label>
                                      <input
                                        type="number"
                                        value={product.stock || ''}
                                        onChange={(e) => handleProductUpdate(product.id, 'stock', parseInt(e.target.value) || 0)}
                                        placeholder="0"
                                        min="0"
                                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                                      />
                                    </div>
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                      Description
                                    </label>
                                    <textarea
                                      value={product.description}
                                      onChange={(e) => handleProductUpdate(product.id, 'description', e.target.value)}
                                      placeholder="Describe your product..."
                                      rows={3}
                                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base resize-none"
                                    />
                                  </div>
                                </div>
                              ) : (
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                                  <div className="flex-1">
                                    <div className="flex items-center space-x-3 mb-2">
                                      <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                                        {product.name}
                                      </h3>
                                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                        product.status === 'active' ? 'bg-green-100 text-green-800' :
                                        product.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                                        product.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
                                        'bg-red-100 text-red-800'
                                      }`}>
                                        {product.status === 'active' ? 'Active' :
                                         product.status === 'draft' ? 'Draft' :
                                         product.status === 'inactive' ? 'Inactive' :
                                         'Out of Stock'}
                                      </span>
                                    </div>
                                    <div className="flex items-center space-x-4 mb-1">
                                      <p className="text-lg sm:text-xl font-bold text-green-600">
                                        ${product.price.toFixed(2)}
                                      </p>
                                      {product.stock !== undefined && (
                                        <p className="text-sm text-gray-600">
                                          Stock: <span className="font-medium">{product.stock}</span>
                                        </p>
                                      )}
                                    </div>
                                    {product.description && (
                                      <p className="text-sm text-gray-600 line-clamp-2">
                                        {product.description}
                                      </p>
                                    )}
                                  </div>
                                  <button
                                    onClick={() => handleProductRemove(product.id)}
                                    className="flex items-center justify-center px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium touch-manipulation"
                                  >
                                    <TrashIcon className="w-4 h-4 mr-1" />
                                    Remove
                                  </button>
                                </div>
                              )}
                            </div>
                          ))}
                        </>
                      )}
                    </div>

                    {/* Summary for imported products */}
                    {allImportedProducts[activeMethod]?.length > 0 && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                          <div className="flex-1">
                            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
                              {allImportedProducts[activeMethod]?.length} Product{allImportedProducts[activeMethod]?.length !== 1 ? 's' : ''} Added
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                              <div className="bg-white rounded-lg p-3 border border-blue-200">
                                <div className="text-sm text-gray-600">Active</div>
                                <div className="text-lg font-semibold text-green-600">
                                  {allImportedProducts[activeMethod]?.filter(p => p.status === 'active').length}
                                </div>
                              </div>
                              <div className="bg-white rounded-lg p-3 border border-blue-200">
                                <div className="text-sm text-gray-600">Draft</div>
                                <div className="text-lg font-semibold text-yellow-600">
                                  {allImportedProducts[activeMethod]?.filter(p => p.status === 'draft').length}
                                </div>
                              </div>
                              <div className="bg-white rounded-lg p-3 border border-blue-200">
                                <div className="text-sm text-gray-600">Inactive</div>
                                <div className="text-lg font-semibold text-gray-600">
                                  {allImportedProducts[activeMethod]?.filter(p => p.status === 'inactive').length}
                                </div>
                              </div>
                              <div className="bg-white rounded-lg p-3 border border-blue-200">
                                <div className="text-sm text-gray-600">Out of Stock</div>
                                <div className="text-lg font-semibold text-red-600">
                                  {allImportedProducts[activeMethod]?.filter(p => p.status === 'out_of_stock').length}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg sm:text-xl font-bold text-blue-600 mb-1">
                              Total Value: ${allImportedProducts[activeMethod]?.reduce((sum, p) => sum + (p.price || 0), 0).toFixed(2)}
                            </div>
                            <div className="text-sm text-gray-600">
                              Total Stock: {allImportedProducts[activeMethod]?.reduce((sum, p) => sum + (p.stock || 0), 0)} items
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Navigation */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-4">
                      <button
                        onClick={() => {
                          clearImportedProducts();
                          setActiveMethod(null);
                        }}
                        className="flex items-center justify-center px-4 py-2.5 border border-gray-300 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg font-medium text-sm sm:text-base transition-colors touch-manipulation"
                      >
                        <ArrowLeftIcon className="w-4 h-4 mr-2" />
                        Clear Selection
                      </button>
                      {allImportedProducts[activeMethod]?.length > 0 && (
                        <button
                          onClick={finalizeProducts}
                          className="flex-1 sm:flex-none px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm sm:text-base transition-colors touch-manipulation"
                        >
                          Save to Store
                        </button>
                      )}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Sidebar - Right Side on Desktop, Stack on Mobile/Tablet */}
          <div className="lg:col-span-1">
            {/* Mobile/Tablet: Show completion banner at top, Desktop: Show in sidebar */}
            <div className="lg:sticky lg:top-6 space-y-4 max-h-screen lg:max-h-[calc(100vh-8rem)] overflow-hidden">
              {/* Completion Status Banner */}
              {isStepCompleted('addProducts') && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-start">
                    <CheckCircleIcon className="w-5 h-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-base font-semibold text-green-900 mb-1">
                        Product Catalog Complete! ✅
                      </h3>
                      <p className="text-green-700 text-sm">
                        You have {completionState.addProducts.productCount} product{completionState.addProducts.productCount !== 1 ? 's' : ''} ready for your store.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Database Products Summary - Compact Sidebar Version */}
              {databaseProducts.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg flex flex-col max-h-full">
                  {/* Header with Toggle */}
                  <div className="flex items-center justify-between p-4 flex-shrink-0">
                    <div 
                      className="flex items-center cursor-pointer hover:text-blue-800 transition-colors flex-1"
                      onClick={() => setIsDatabaseProductsOpen(!isDatabaseProductsOpen)}
                    >
                      <div className={`transform transition-transform ${isDatabaseProductsOpen ? 'rotate-90' : ''}`}>
                        <svg className="w-4 h-4 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-blue-900 text-base">
                          Current Catalog
                        </h3>
                        <p className="text-blue-700 text-sm">
                          {databaseProducts.length} product{databaseProducts.length !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-xl font-bold text-blue-600">
                        {databaseProducts.length}
                      </div>
                    </div>
                  </div>
                  
                  {/* Collapsible Database Products List - Scrollable */}
                  {isDatabaseProductsOpen && (
                    <div className="border-t border-blue-200 flex-1 min-h-0">
                      <div className="p-4 pb-2 flex justify-end border-b border-blue-200 bg-blue-50 flex-shrink-0">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            refreshDatabaseProducts();
                          }}
                          className="flex items-center px-2 py-1 text-blue-600 hover:text-blue-700 hover:bg-blue-100 rounded text-xs font-medium"
                          title="Refresh catalog"
                        >
                          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                          Refresh
                        </button>
                      </div>
                      {/* Scrollable Product List */}
                      <div className="overflow-y-auto max-h-96 lg:max-h-[60vh] p-4 space-y-3">
                        {databaseProducts.map((product) => (
                          <div key={product.id} className="text-sm">
                            <DatabaseProductRow 
                              product={product} 
                              onUpdate={handleDatabaseProductUpdate}
                              onRemove={handleDatabaseProductRemove}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

import * as React from 'react';
import {
    Dialog,
    Button,
    Grid,
    Card,
    CardContent,
    Typography,
    IconButton,
    useTheme,
    AppBar,
    Toolbar,
    Slide,
    Box,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Divider,
    Checkbox,
    CircularProgress,
    Select,
    MenuItem,
    FormControl,
    InputLabel
} from '@mui/material';
import type { TransitionProps } from '@mui/material/transitions';
import {
    CubeIcon,
    ShoppingBagIcon,
    ShoppingCartIcon,
    GlobeAltIcon
} from '@heroicons/react/24/outline';
import CloseIcon from '@mui/icons-material/Close';
import { useImportProductsStore } from '../stores/importProductsStore';
import { useState } from 'react';
import ListSubheader from '@mui/material/ListSubheader';
import ListItemButton from '@mui/material/ListItemButton';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import TrashIcon from '@mui/icons-material/Delete';

interface Product {
    id: string;
    title: string;
    price: number;
    image: string;
    description: string;
    link: string;
    source: string;
}

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

interface ImportProductsDialogProps {
    open: boolean;
    onClose: () => void;
    onSelect: (methodId: string) => void;
}

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function ImportProductsDialog({ open, onClose, onSelect }: ImportProductsDialogProps) {
    const theme = useTheme();
    const [selectedMethod, setSelectedMethod] = React.useState<string | null>(null);
    const [amazonTab, setAmazonTab] = useState<'trending' | 'bestsellers' | 'byurl'>('trending');
    const [products, setProducts] = React.useState<Product[]>([]);
    const [loading, setLoading] = React.useState(false);
    const [selectedProducts, setSelectedProducts] = React.useState<Set<string>>(new Set());
    const [byUrlInput, setByUrlInput] = useState('');
    const [byUrlError, setByUrlError] = useState('');
    const [categories, setCategories] = useState<string[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const setImportedProducts = useImportProductsStore(state => state.setImportedProducts);
    const [amazonNestedOpen, setAmazonNestedOpen] = useState(false);

    // Fetch categories when Amazon tab is selected
    React.useEffect(() => {
        console.log('Effect triggered, selectedMethod:', selectedMethod);
        if (selectedMethod === 'amazon') {
            console.log('Fetching categories...');
            fetchCategories();
        }
    }, [selectedMethod]);

    const fetchCategories = async () => {
        console.log('fetchCategories called');
        try {
            const response = await fetch('https://web3fy-go.dojima.network/api/categories?type=amazon');
            const data = await response.json();
            console.log('Categories response:', data);
            if (data?.data?.categories && Array.isArray(data.data.categories)) {
                const categoryList = data.data.categories.map((item: any) => item.category);
                setCategories(categoryList);
                if (categoryList.length > 0) {
                    const initialCategory = categoryList[0];
                    console.log('Setting initial category:', initialCategory);
                    setSelectedCategory(initialCategory);
                    // Fetch products after setting the category
                    fetchAmazonProducts('trending', initialCategory);
                }
            }
        } catch (error) {
            console.error('Failed to fetch categories:', error);
        }
    };

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case 'Easy': return 'success.main';
            case 'Medium': return 'warning.main';
            case 'Advanced': return 'error.main';
            default: return 'text.secondary';
        }
    };

    const handleMethodSelect = async (methodId: string) => {
        console.log('handleMethodSelect called with:', methodId);
        if (methodId === 'amazon') {
            setAmazonNestedOpen(!amazonNestedOpen);
        } else {
            setAmazonNestedOpen(false);
        }
        setSelectedMethod(methodId);
        setAmazonTab('trending');
    };

    const fetchAmazonProducts = async (tab: 'trending' | 'bestsellers' | 'byurl', url?: string) => {
        setLoading(true);
        setProducts([]);
        setByUrlError('');
        try {
            if (tab === 'trending') {
                const categoryToUse = url || selectedCategory;
                console.log('Fetching products for category:', categoryToUse);
                const response = await fetch(`/api/stores/products/amazon?limit=20&category=${categoryToUse}`);
                const data = await response.json();
                const productsArray = data.products || [];
                const mappedProducts = productsArray.map((product: any) => {
                    // Handle price parsing more safely
                    let price = 0;
                    if (product.price) {
                        // Remove currency symbol and any non-numeric characters except decimal point
                        const priceStr = product.price.replace(/[^0-9.]/g, '');
                        price = parseFloat(priceStr) || 0;
                    }

                    return {
                        id: product.asin || String(Math.random()),
                        title: product.title || 'Untitled Product',
                        price: price,
                        image: product.image || '',
                        description: `${product.source} - Rank: ${product.rank}`,
                        link: product.link || '',
                        source: 'amazon',
                    };
                });
                setProducts(mappedProducts);
            } else if (tab === 'byurl' && url) {
                const encodedUrl = encodeURIComponent(url);
                const response = await fetch(`https://web3fy-go.dojima.network/api/product/details?url=${encodedUrl}`);
                const data = await response.json();
                if (data?.data?.product) {
                    const p = data.data.product;
                    // Handle price parsing for byurl
                    let price = 0;
                    if (p.price) {
                        const priceStr = p.price.replace(/[^0-9.]/g, '');
                        price = parseFloat(priceStr) || 0;
                    }

                    setProducts([{
                        id: p.asin || String(Math.random()),
                        title: p.title || 'Untitled Product',
                        price: price,
                        image: p.image || '',
                        description: `${p.source} - Rating: ${p.rating} - ${p.reviewCount}`,
                        link: p.link || url,
                        source: 'amazon',
                    }]);
                } else {
                    setByUrlError('No product found for this URL.');
                    setProducts([]);
                }
            }
        } catch (error) {
            setByUrlError('Failed to fetch product.');
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    const handleProductSelect = (productId: string) => {
        setSelectedProducts(prev => {
            const newSet = new Set(prev);
            if (newSet.has(productId)) {
                newSet.delete(productId);
            } else {
                newSet.add(productId);
            }
            return newSet;
        });

        // Update the store immediately when selection changes
        const updatedSelectedProducts = new Set(selectedProducts);
        if (updatedSelectedProducts.has(productId)) {
            updatedSelectedProducts.delete(productId);
        } else {
            updatedSelectedProducts.add(productId);
        }

        const selected = products.filter(p => updatedSelectedProducts.has(p.id));
        // Get existing imported products
        const existingProducts = useImportProductsStore.getState().importedProducts;
        // Combine existing and new products, avoiding duplicates
        const allProducts = [...existingProducts];
        selected.forEach(newProduct => {
            if (!allProducts.some(p => p.id === newProduct.id)) {
                allProducts.push(newProduct);
            }
        });
        setImportedProducts(allProducts);
    };

    const handleImportSelected = () => {
        const selected = products.filter(p => selectedProducts.has(p.id));
        // Get existing imported products
        const existingProducts = useImportProductsStore.getState().importedProducts;
        // Combine existing and new products, avoiding duplicates
        const allProducts = [...existingProducts];
        selected.forEach(newProduct => {
            if (!allProducts.some(p => p.id === newProduct.id)) {
                allProducts.push(newProduct);
            }
        });
        setImportedProducts(allProducts);
        // Clear selection state
        setSelectedProducts(new Set());
        onSelect('amazon');
    };

    return (
        <Dialog
            fullScreen
            open={open}
            onClose={onClose}
            TransitionComponent={Transition}
        >
            <AppBar sx={{ position: 'relative', bgcolor: 'background.paper' }}>
                <Toolbar>
                    <IconButton
                        edge="start"
                        onClick={onClose}
                        aria-label="close"
                        sx={{ color: 'text.primary' }}
                    >
                        <CloseIcon />
                    </IconButton>
                    <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div" color="text.primary">
                        Import Products
                    </Typography>
                    <Button
                        color="primary"
                        variant="contained"
                        disabled={selectedProducts.size === 0}
                        onClick={handleImportSelected}
                    >
                        Import Selected ({selectedProducts.size})
                    </Button>
                </Toolbar>
            </AppBar>

            <Box sx={{ display: 'flex', height: 'calc(100% - 64px)' }}>
                {/* Left Sidebar */}
                <Box sx={{
                    width: 280,
                    borderRight: 1,
                    borderColor: 'divider',
                    bgcolor: 'background.paper'
                }}>
                    <List>
                        {importOptions.map((option) => {
                            const IconComponent = option.icon;
                            const isAmazon = option.id === 'amazon';
                            return (
                                <React.Fragment key={option.id}>
                                    <ListItem
                                        onClick={isAmazon ? () => {
                                            setAmazonNestedOpen(!amazonNestedOpen);
                                            setSelectedMethod('amazon');
                                        } : undefined}
                                        sx={{
                                            cursor: isAmazon ? 'pointer' : 'not-allowed',
                                            bgcolor: selectedMethod === option.id ? 'action.selected' : 'transparent',
                                            opacity: isAmazon ? 1 : 0.5,
                                            pointerEvents: isAmazon ? 'auto' : 'none',
                                            '&:hover': {
                                                bgcolor: isAmazon ? 'action.hover' : 'transparent',
                                            },
                                        }}
                                    >
                                        <ListItemIcon>
                                            <IconComponent className="w-6 h-6" style={{ color: theme.palette.primary.main }} />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={option.name}
                                            secondary={
                                                <Typography
                                                    variant="caption"
                                                    sx={{
                                                        color: getDifficultyColor(option.difficulty),
                                                        fontWeight: 'medium',
                                                    }}
                                                >
                                                    {option.difficulty}
                                                </Typography>
                                            }
                                        />
                                        {isAmazon && (amazonNestedOpen ? <ExpandLess /> : <ExpandMore />)}
                                    </ListItem>
                                    {isAmazon && (
                                        <Collapse in={amazonNestedOpen} timeout="auto" unmountOnExit>
                                            <List component="div" disablePadding>
                                                <ListItemButton
                                                    selected={amazonTab === 'trending'}
                                                    onClick={() => { setAmazonTab('trending'); setSelectedMethod('amazon'); fetchAmazonProducts('trending'); }}
                                                    sx={{ pl: 4 }}
                                                >
                                                    <ListItemText primary="Trending" />
                                                </ListItemButton>
                                                <ListItemButton
                                                    selected={amazonTab === 'bestsellers'}
                                                    disabled
                                                    sx={{ pl: 4, opacity: 0.5 }}
                                                >
                                                    <ListItemText primary="Best Sellers (Coming Soon)" />
                                                </ListItemButton>
                                                <ListItemButton
                                                    selected={amazonTab === 'byurl'}
                                                    onClick={() => { setAmazonTab('byurl'); setSelectedMethod('amazon'); setProducts([]); }}
                                                    sx={{ pl: 4 }}
                                                >
                                                    <ListItemText primary="By URL" />
                                                </ListItemButton>
                                            </List>
                                        </Collapse>
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </List>
                </Box>

                {/* Right Content Area */}
                <Box sx={{ flex: 1, p: 3, overflow: 'auto' }}>
                    {/* Category Dropdown for Trending */}
                    {selectedMethod === 'amazon' && amazonTab === 'trending' && (
                        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
                            <FormControl sx={{ minWidth: 200 }}>
                                <InputLabel id="category-select-label">Category</InputLabel>
                                <Select
                                    labelId="category-select-label"
                                    value={selectedCategory}
                                    label="Category"
                                    onChange={(e) => {
                                        const newCategory = e.target.value;
                                        console.log('Category changed to:', newCategory);
                                        setSelectedCategory(newCategory);
                                        fetchAmazonProducts('trending', newCategory);
                                    }}
                                >
                                    {categories.map((category) => (
                                        <MenuItem key={category} value={category}>
                                            {category.charAt(0).toUpperCase() + category.slice(1)}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>
                    )}

                    {/* ByUrl Input */}
                    {selectedMethod === 'amazon' && amazonTab === 'byurl' && (
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
                            <form
                                onSubmit={e => {
                                    e.preventDefault();
                                    if (!byUrlInput.trim()) return;
                                    fetchAmazonProducts('byurl', byUrlInput.trim());
                                }}
                                style={{ width: '100%', maxWidth: 600 }}
                            >
                                <Box sx={{ display: 'flex', gap: 2 }}>
                                    <input
                                        type="text"
                                        value={byUrlInput}
                                        onChange={e => setByUrlInput(e.target.value)}
                                        placeholder="Paste Amazon product URL here"
                                        className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
                                        style={{ flex: 1 }}
                                    />
                                    <button
                                        type="submit"
                                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-r-lg font-medium text-base"
                                    >
                                        Fetch
                                    </button>
                                </Box>
                            </form>
                            {byUrlError && <Typography color="error" sx={{ mt: 2 }}>{byUrlError}</Typography>}
                        </Box>
                    )}

                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <>
                            {products.length === 0 ? (
                                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                                    <Typography color="text.secondary">
                                        {amazonTab === 'byurl' ? 'Enter a URL and fetch a product.' : 'No products found'}
                                    </Typography>
                                </Box>
                            ) : (
                                <Grid container spacing={3}>
                                    {products.map((product) => (
                                        <Grid
                                            key={product.id}
                                            sx={{
                                                width: {
                                                    xs: '100%',
                                                    sm: '50%',
                                                    md: '33.33%'
                                                }
                                            }}
                                        >
                                            <Card sx={{ borderRadius: 4, boxShadow: 3, overflow: 'hidden', position: 'relative', transition: 'box-shadow 0.2s', '&:hover': { boxShadow: 6 } }}>
                                                <Box sx={{ position: 'relative' }}>
                                                    <img
                                                        src={product.image}
                                                        alt={product.title}
                                                        style={{ width: '100%', height: 200, objectFit: 'cover', display: 'block' }}
                                                    />
                                                    <Box sx={{ position: 'absolute', top: 12, left: 12, bgcolor: 'white', color: 'grey.900', px: 2, py: 0.5, borderRadius: 2, fontWeight: 700, fontSize: 12, boxShadow: 1, border: '1px solid #eee' }}>
                                                        Amazon
                                                    </Box>
                                                    <Box sx={{ position: 'absolute', bottom: 12, left: 12, bgcolor: 'white', color: 'green.600', px: 2, py: 0.5, borderRadius: 2, fontWeight: 700, fontSize: 16, boxShadow: 1 }}>
                                                        ${product.price > 0 ? product.price.toFixed(2) : 'N/A'}
                                                    </Box>
                                                </Box>
                                                <CardContent sx={{ p: 2 }}>
                                                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={product.title}>
                                                        {product.title}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1, minHeight: 36, lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                                                        {product.description}
                                                    </Typography>
                                                    <a href={product.link} target="_blank" rel="noopener noreferrer" style={{ color: theme.palette.primary.main, fontWeight: 500, textDecoration: 'underline', fontSize: 14 }}>
                                                        View on Amazon
                                                    </a>
                                                </CardContent>
                                                <Checkbox
                                                    checked={selectedProducts.has(product.id)}
                                                    onChange={() => handleProductSelect(product.id)}
                                                    sx={{ position: 'absolute', top: 12, right: 12, bgcolor: 'white', borderRadius: '50%' }}
                                                />
                                            </Card>
                                        </Grid>
                                    ))}
                                </Grid>
                            )}
                        </>
                    )}
                </Box>
            </Box>
        </Dialog>
    );
} 
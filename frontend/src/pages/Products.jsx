import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, ShoppingCart, Loader2, Check } from 'lucide-react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useCart } from '../context/CartContext';

export default function Products() {
    const { addToCart } = useCart();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Fetch products from firestore
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'products'));
                if (querySnapshot.empty) {
                    // If empty, put some dummy data to show the UI
                    setProducts([
                        { id: '1', name: 'Premium Wireless Headphones', price: '850.00', category: 'Audio', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80', stock: 10 },
                        { id: '2', name: '4K Ultra HD Smart TV', price: '4500.00', category: 'Televisions', image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=500&q=80', stock: 5 },
                        { id: '3', name: 'Smartphone Pro Max 256GB', price: '12000.00', category: 'Phones', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&q=80', stock: 12 },
                        { id: '4', name: 'Professional Laptop 16"', price: '18500.00', category: 'Laptops', image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&q=80', stock: 3 },
                        { id: '5', name: 'Mechanical Gaming Keyboard', price: '650.00', category: 'Accessories', image: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=500&q=80', stock: 25 },
                        { id: '6', name: 'Wireless Smart Watch', price: '1200.00', category: 'Wearables', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80', stock: 8 },
                    ]);
                } else {
                    const productsArray = [];
                    querySnapshot.forEach((doc) => {
                        productsArray.push({ id: doc.id, ...doc.data() });
                    });
                    setProducts(productsArray);
                }
            } catch (error) {
                console.error("Error fetching products", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight text-white mb-2">Our <span className="text-accent">Products</span></h1>
                    <p className="text-slate-400">Discover our premium range of electronic devices.</p>
                </div>

                <div className="flex gap-4 items-center">
                    <div className="relative w-full md:w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="glass-input w-full !pl-10"
                        />
                    </div>
                    <button className="glass-button p-3 aspect-square rounded-xl">
                        <Filter className="w-5 h-5 text-slate-300" />
                    </button>
                </div>
            </div>

            {/* Products Grid */}
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="w-10 h-10 text-accent animate-spin" />
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredProducts.map((product) => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            whileHover={{ y: -5 }}
                            className="glass-card overflow-hidden flex flex-col group"
                        >
                            {/* Image Container */}
                            <div className="relative h-48 overflow-hidden bg-white/5">
                                <img
                                    src={product.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e'}
                                    alt={product.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 Mix-blend-overlay"
                                />
                                <div className="absolute top-3 w-full px-3 flex justify-between">
                                    <span className="px-3 py-1 bg-dark-900/80 backdrop-blur-md rounded-full text-xs font-medium text-slate-200 border border-white/10">
                                        {product.category}
                                    </span>
                                    {product.stock <= 5 && (
                                        <span className="px-3 py-1 bg-red-500/80 backdrop-blur-md rounded-full text-xs font-medium text-white border border-red-400/20">
                                            Low Stock
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Content Container */}
                            <div className="p-5 flex flex-col flex-grow">
                                <h3 className="text-lg font-semibold text-white mb-1 line-clamp-1">{product.name}</h3>
                                <p className="text-2xl font-bold text-accent mb-4 mt-auto">
                                    GHS {parseFloat(product.price).toLocaleString('en-GH', { minimumFractionDigits: 2 })}
                                </p>

                                <motion.button
                                    onClick={() => addToCart(product)}
                                    whileTap={{ scale: 0.95 }}
                                    className="w-full py-2.5 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl font-medium text-white transition-colors flex items-center justify-center gap-2 group-hover:bg-primary group-hover:border-primary active:bg-accent"
                                >
                                    <ShoppingCart className="w-4 h-4" />
                                    Add to Cart
                                </motion.button>
                            </div>
                        </motion.div>
                    ))}

                    {filteredProducts.length === 0 && (
                        <div className="col-span-full text-center py-20 text-slate-400">
                            No products found matching "{searchTerm}".
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

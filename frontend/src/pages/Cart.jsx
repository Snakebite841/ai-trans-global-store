import { useCart } from '../context/CartContext';
import { motion } from 'framer-motion';
import { Trash2, Minus, Plus, ArrowRight, ShoppingBag, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function Cart() {
    const { cartItems, updateQuantity, removeFromCart, cartTotal } = useCart();
    const navigate = useNavigate();

    if (cartItems.length === 0) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-20 text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass-card p-12 flex flex-col items-center"
                >
                    <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6 border border-white/10">
                        <ShoppingBag className="w-12 h-12 text-slate-400" />
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-4">Your Cart is Empty</h2>
                    <p className="text-slate-400 mb-8 max-w-md mx-auto">
                        Looks like you haven't added any premium devices to your cart yet. Discover our latest collection and find exactly what you need.
                    </p>
                    <Link to="/products" className="glass-button px-8 py-3 flex items-center gap-2">
                        <ArrowLeft className="w-5 h-5" />
                        Continue Shopping
                    </Link>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <h1 className="text-4xl font-bold tracking-tight text-white mb-10">Shopping <span className="text-accent">Cart</span></h1>

            <div className="flex flex-col lg:flex-row gap-8">

                {/* Cart Items List */}
                <div className="lg:w-2/3 space-y-4">
                    {cartItems.map((item) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="glass-card p-4 flex flex-col sm:flex-row items-center gap-6 group"
                        >
                            {/* Product Image */}
                            <div className="w-32 h-32 rounded-xl overflow-hidden bg-white/5 shrink-0 border border-white/10">
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-full h-full object-cover mix-blend-overlay"
                                />
                            </div>

                            {/* Product Info */}
                            <div className="flex-grow text-center sm:text-left">
                                <h3 className="text-xl font-semibold text-white mb-1">{item.name}</h3>
                                <span className="inline-block px-3 py-1 bg-white/5 rounded-full text-xs text-slate-300 border border-white/10 mb-3">
                                    {item.category}
                                </span>
                                <p className="text-lg font-bold text-accent">
                                    GHS {parseFloat(item.price).toLocaleString('en-GH', { minimumFractionDigits: 2 })}
                                </p>
                            </div>

                            {/* Quantity Controls & Remove */}
                            <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-4">
                                <div className="flex items-center gap-3 bg-dark-900/50 rounded-xl p-1 border border-white/10">
                                    <button
                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                        className="p-2 hover:bg-white/10 rounded-lg transition-colors text-slate-300 hover:text-white"
                                    >
                                        <Minus className="w-4 h-4" />
                                    </button>
                                    <span className="w-8 text-center font-medium text-white select-none">{item.quantity}</span>
                                    <button
                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                        className="p-2 hover:bg-white/10 rounded-lg transition-colors text-slate-300 hover:text-white"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>

                                <button
                                    onClick={() => removeFromCart(item.id)}
                                    className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all sm:opacity-0 group-hover:opacity-100 flex items-center gap-2"
                                >
                                    <Trash2 className="w-5 h-5" />
                                    <span className="sm:hidden text-sm font-medium">Remove</span>
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Order Summary Checkout Panel */}
                <div className="lg:w-1/3">
                    <div className="glass-card p-6 sticky top-28 border border-primary/20 bg-dark-800/60 backdrop-blur-xl">
                        <h2 className="text-2xl font-bold text-white mb-6 border-b border-white/10 pb-4">Order Summary</h2>

                        <div className="space-y-4 mb-6">
                            <div className="flex justify-between text-slate-300">
                                <span>Subtotal ({cartItems.length} items)</span>
                                <span>GHS {cartTotal.toLocaleString('en-GH', { minimumFractionDigits: 2 })}</span>
                            </div>
                            <div className="flex justify-between text-slate-300">
                                <span>Shipping Estimate</span>
                                <span>Calculated at checkout</span>
                            </div>
                            <div className="flex justify-between text-slate-300">
                                <span>Taxes</span>
                                <span>Included</span>
                            </div>
                        </div>

                        <div className="border-t border-white/10 pt-4 mb-8">
                            <div className="flex justify-between items-center text-white">
                                <span className="text-lg font-semibold">Total</span>
                                <span className="text-3xl font-bold text-gradient">
                                    GHS {cartTotal.toLocaleString('en-GH', { minimumFractionDigits: 2 })}
                                </span>
                            </div>
                        </div>

                        <button
                            onClick={() => navigate('/checkout')}
                            className="w-full relative overflow-hidden bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 shadow-lg shadow-primary/25 hover:shadow-primary/40 group focus:ring-2 focus:ring-accent"
                        >
                            <span className="relative z-10">Proceed to Checkout</span>
                            <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer" />
                        </button>

                        <Link to="/products" className="block text-center mt-6 text-sm text-slate-400 hover:text-white transition-colors">
                            or Continue Shopping
                        </Link>
                    </div>
                </div>

            </div>
        </div>
    );
}

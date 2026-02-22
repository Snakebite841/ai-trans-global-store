import { motion, AnimatePresence } from 'framer-motion';
import { X, Package, Clock, MapPin, User, Phone } from 'lucide-react';

export default function OrderDetailsModal({ isOpen, onClose, order }) {
    if (!isOpen || !order) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-dark-900/60 backdrop-blur-sm"
                />

                {/* Modal Window */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="glass-card relative w-full max-w-3xl max-h-[90vh] flex flex-col bg-dark-800/95 overflow-hidden"
                >
                    {/* Header */}
                    <div className="p-6 border-b border-white/10 flex items-center justify-between shrink-0">
                        <div>
                            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                                Order Details
                            </h2>
                            <p className="text-slate-400 font-mono text-sm mt-1">ID: {order.id}</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6 overflow-y-auto custom-scrollbar flex-grow space-y-8">

                        {/* Customer & Shipping Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                                <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                                    <User className="w-4 h-4 text-primary" /> Customer Info
                                </h3>
                                <div className="space-y-3 text-sm text-slate-300">
                                    <div className="flex gap-2">
                                        <span className="text-slate-500 w-20">Name:</span>
                                        <span className="font-medium text-white">{order.shippingInfo?.fullName || 'Guest'}</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <span className="text-slate-500 w-20">Phone:</span>
                                        <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {order.shippingInfo?.phone || 'N/A'}</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <span className="text-slate-500 w-20">Date:</span>
                                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {order.createdAt ? new Date(order.createdAt.seconds * 1000).toLocaleString() : 'Just now'}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                                <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-primary" /> Shipping Address
                                </h3>
                                <div className="space-y-3 text-sm text-slate-300">
                                    <div className="flex gap-2">
                                        <span className="text-slate-500 w-20">City:</span>
                                        <span className="font-medium text-white">{order.shippingInfo?.city || 'N/A'}</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <span className="text-slate-500 w-20">Address:</span>
                                        <span>{order.shippingInfo?.address || 'N/A'}</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <span className="text-slate-500 w-20">Status:</span>
                                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">
                                            {order.status || 'Paid'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Items Sold */}
                        <div>
                            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                                <Package className="w-4 h-4 text-primary" /> Items Sold
                            </h3>
                            <div className="border border-white/10 rounded-xl overflow-hidden">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-white/5 border-b border-white/10 text-slate-300 text-sm">
                                            <th className="p-4 font-medium">Product</th>
                                            <th className="p-4 font-medium text-center">Qty</th>
                                            <th className="p-4 font-medium text-right">Price</th>
                                            <th className="p-4 font-medium text-right">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {order.items && order.items.length > 0 ? (
                                            order.items.map((item, index) => (
                                                <tr key={index} className="hover:bg-white/[0.02] transition-colors">
                                                    <td className="p-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-lg overflow-hidden bg-dark-900 border border-white/10 shrink-0">
                                                                <img
                                                                    src={item.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e'}
                                                                    alt={item.name}
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            </div>
                                                            <span className="font-medium text-white text-sm line-clamp-2">{item.name}</span>
                                                        </div>
                                                    </td>
                                                    <td className="p-4 text-center font-bold text-slate-300">
                                                        x{item.quantity}
                                                    </td>
                                                    <td className="p-4 text-right text-sm text-slate-400">
                                                        GH₵ {parseFloat(item.price).toLocaleString('en-GH', { minimumFractionDigits: 2 })}
                                                    </td>
                                                    <td className="p-4 text-right font-bold text-accent">
                                                        GH₵ {(parseFloat(item.price) * item.quantity).toLocaleString('en-GH', { minimumFractionDigits: 2 })}
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="4" className="p-6 text-center text-slate-500">
                                                    No items recorded for this order.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Order Total Area */}
                        <div className="flex justify-end pt-4">
                            <div className="w-full md:w-1/2 rounded-xl bg-white/5 border border-white/10 p-5">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-slate-400">Subtotal</span>
                                    <span className="text-white">
                                        GH₵ {parseFloat((order.totalAmount || 0) - (order.deliveryFee || 0)).toLocaleString('en-GH', { minimumFractionDigits: 2 })}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-slate-400">Delivery</span>
                                    {order.deliveryFee ? (
                                        <span className="text-white">GH₵ {parseFloat(order.deliveryFee).toLocaleString('en-GH', { minimumFractionDigits: 2 })}</span>
                                    ) : (
                                        <span className="text-green-400">Free</span>
                                    )}
                                </div>
                                <div className="pt-4 border-t border-white/10 flex justify-between items-center">
                                    <span className="text-lg font-bold text-white">Total Amount</span>
                                    <span className="text-2xl font-bold text-accent">GH₵ {parseFloat(order.totalAmount || 0).toLocaleString('en-GH', { minimumFractionDigits: 2 })}</span>
                                </div>
                            </div>
                        </div>

                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}

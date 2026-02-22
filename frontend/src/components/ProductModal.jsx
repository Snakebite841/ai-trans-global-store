import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Loader2, Image as ImageIcon, Save } from 'lucide-react';
import { collection, addDoc, updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../services/firebase';

export default function ProductModal({ isOpen, onClose, onProductSaved, product = null }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        category: 'Smartphones',
        image: '',
        stock: '',
        description: ''
    });

    useEffect(() => {
        if (product && isOpen) {
            setFormData({
                name: product.name || '',
                price: product.price || '',
                category: product.category || 'Smartphones',
                image: product.image || '',
                stock: product.stock || '',
                description: product.description || ''
            });
        } else if (!isOpen) {
            // Reset when closing
            setFormData({ name: '', price: '', category: 'Smartphones', image: '', stock: '', description: '' });
        }
    }, [product, isOpen]);

    const categories = [
        'Smartphones', 'Laptops', 'Audio', 'Televisions', 'Wearables', 'Accessories'
    ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!formData.name || !formData.price || !formData.image || !formData.stock) {
            return setError('Please fill out all required fields.');
        }

        setLoading(true);

        try {
            const productData = {
                name: formData.name,
                price: parseFloat(formData.price),
                category: formData.category,
                image: formData.image,
                stock: parseInt(formData.stock),
                description: formData.description,
            };

            if (product?.id) {
                // Update existing product
                productData.updatedAt = serverTimestamp();
                await updateDoc(doc(db, 'products', product.id), productData);
            } else {
                // Add new product
                productData.createdAt = serverTimestamp();
                await addDoc(collection(db, 'products'), productData);
            }

            onProductSaved();
            onClose(); // Close modal on success
        } catch (err) {
            console.error("Error saving product:", err);
            setError('Failed to save product.');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

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
                    className="glass-card relative w-full max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar p-6 md:p-8 bg-dark-800/95"
                >
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    <h2 className="text-2xl font-bold text-white mb-6">
                        {product ? 'Edit' : 'Add New'} <span className="text-accent">Product</span>
                    </h2>

                    {error && (
                        <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300">Product Name *</label>
                                <input
                                    type="text" name="name"
                                    value={formData.name} onChange={handleInputChange}
                                    className="glass-input w-full"
                                    placeholder="e.g. iPhone 15 Pro Max"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300">Price (GHS) *</label>
                                <input
                                    type="number" name="price" step="0.01" min="0"
                                    value={formData.price} onChange={handleInputChange}
                                    className="glass-input w-full"
                                    placeholder="0.00"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300">Category *</label>
                                <select
                                    name="category"
                                    value={formData.category} onChange={handleInputChange}
                                    className="glass-input w-full appearance-none bg-dark-900"
                                >
                                    {categories.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300">Inventory Stock *</label>
                                <input
                                    type="number" name="stock" min="0"
                                    value={formData.stock} onChange={handleInputChange}
                                    className="glass-input w-full"
                                    placeholder="Enter quantity"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                                <ImageIcon className="w-4 h-4" /> Image URL *
                            </label>
                            <input
                                type="url" name="image"
                                value={formData.image} onChange={handleInputChange}
                                className="glass-input w-full pointer-events-auto"
                                placeholder="https://images.unsplash.com/photo-..."
                            />
                            <p className="text-xs text-slate-500">For now, paste a direct link to an image (e.g., from Unsplash or Imgur).</p>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">Description</label>
                            <textarea
                                name="description"
                                value={formData.description} onChange={handleInputChange}
                                className="glass-input w-full min-h-[100px] resize-none"
                                placeholder="Briefly describe the product..."
                            ></textarea>
                        </div>

                        <div className="pt-4 flex items-center justify-end gap-4 border-t border-white/10">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-6 py-2.5 rounded-xl font-medium text-slate-300 hover:text-white transition-colors"
                                disabled={loading}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="glass-button bg-primary hover:bg-primary/90 px-8 py-2.5 border-none shadow-lg shadow-primary/20 flex items-center gap-2"
                            >
                                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                                    product ? <><Save className="w-4 h-4" /> Save Changes</> : <><Upload className="w-4 h-4" /> Publish Product</>
                                )}
                            </button>
                        </div>
                    </form>

                </motion.div>
            </div>
        </AnimatePresence>
    );
}

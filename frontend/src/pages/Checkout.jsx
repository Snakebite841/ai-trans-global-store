import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Navigate } from 'react-router-dom';
import { collection, addDoc, serverTimestamp, doc, writeBatch, increment } from 'firebase/firestore';
import { db } from '../services/firebase';
import { motion } from 'framer-motion';
import { CreditCard, Truck, AlertCircle, Loader2, CheckCircle } from 'lucide-react';

export default function Checkout() {
    const { cartItems, cartTotal, clearCart } = useCart();
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    const [shippingInfo, setShippingInfo] = useState({
        fullName: '',
        phone: '',
        address: '',
        city: '',
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [orderId, setOrderId] = useState('');
    const [deliveryOption, setDeliveryOption] = useState('pickup');

    const deliveryFee = deliveryOption === 'delivery' ? 50 : 0;
    const finalTotal = cartTotal + deliveryFee;

    // Protect route
    if (!currentUser) {
        return <Navigate to="/login" replace />;
    }

    if (cartItems.length === 0 && !success) {
        return <Navigate to="/cart" replace />;
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setShippingInfo((prev) => ({ ...prev, [name]: value }));
    };

    const handleCheckout = async (e) => {
        e.preventDefault();
        setError('');

        // Basic validation
        if (!shippingInfo.fullName || !shippingInfo.phone || !shippingInfo.address || !shippingInfo.city) {
            return setError('Please fill out all shipping fields.');
        }

        setLoading(true);

        try {
            // Create order document
            const orderData = {
                userId: currentUser.uid,
                items: cartItems.map(item => ({
                    productId: item.id,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                    image: item.image
                })),
                shippingInfo,
                deliveryOption,
                deliveryFee,
                totalAmount: finalTotal,
                status: 'Paid', // Marking as Paid automatically for now
                createdAt: serverTimestamp(),
            };

            const docRef = await addDoc(collection(db, 'orders'), orderData);

            // Deduct stock and record sold quantity for each item
            const batch = writeBatch(db);
            cartItems.forEach(item => {
                const productRef = doc(db, 'products', item.id);
                batch.update(productRef, {
                    stock: increment(-item.quantity),
                    sold: increment(item.quantity)
                });
            });
            await batch.commit();

            setOrderId(docRef.id);
            setSuccess(true);
            clearCart();

        } catch (err) {
            console.error("Error creating order:", err);
            setError('Failed to process order. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="max-w-3xl mx-auto px-4 py-20 text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass-card p-12 flex flex-col items-center border border-green-500/20"
                >
                    <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mb-6">
                        <CheckCircle className="w-10 h-10 text-green-400" />
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-4">Payment Successful!</h2>
                    <p className="text-slate-400 mb-2">Thank you for shopping with AI TRANS GLOBAL LIMITED.</p>
                    <p className="text-slate-300 font-medium mb-8">
                        Your Order ID: <span className="text-accent">{orderId}</span>
                    </p>
                    <button
                        onClick={() => navigate('/')}
                        className="glass-button px-8 py-3"
                    >
                        Return to Home
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <h1 className="text-4xl font-bold tracking-tight text-white mb-10">Secure <span className="text-accent">Checkout</span></h1>

            <div className="flex flex-col lg:flex-row gap-8">

                {/* Checkout Form */}
                <div className="lg:w-2/3">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass-card p-6 md:p-8"
                    >
                        <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-2">
                            <Truck className="w-6 h-6 text-primary" /> Delivery Details
                        </h2>

                        {error && (
                            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400">
                                <AlertCircle className="w-5 h-5 shrink-0" />
                                <p>{error}</p>
                            </div>
                        )}

                        <form onSubmit={handleCheckout} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-300 block">Full Name</label>
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={shippingInfo.fullName}
                                        onChange={handleInputChange}
                                        className="glass-input w-full"
                                        placeholder="John Doe"
                                        disabled={loading}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-300 block">Phone Number</label>
                                    <input
                                        type="text"
                                        name="phone"
                                        value={shippingInfo.phone}
                                        onChange={handleInputChange}
                                        className="glass-input w-full"
                                        placeholder="+233 54 123 4567"
                                        disabled={loading}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300 block">Street Address</label>
                                <input
                                    type="text"
                                    name="address"
                                    value={shippingInfo.address}
                                    onChange={handleInputChange}
                                    className="glass-input w-full"
                                    placeholder="123 Independence Ave"
                                    disabled={loading}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300 block">City / Region</label>
                                <input
                                    type="text"
                                    name="city"
                                    value={shippingInfo.city}
                                    onChange={handleInputChange}
                                    className="glass-input w-full"
                                    placeholder="Accra, Greater Accra"
                                    disabled={loading}
                                />
                            </div>

                            <div className="pt-6 border-t border-white/10">
                                <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-2">
                                    <Truck className="w-6 h-6 text-primary" /> Delivery Method
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div
                                        onClick={() => setDeliveryOption('pickup')}
                                        className={`p-4 rounded-xl border flex items-center gap-3 cursor-pointer transition-colors ${deliveryOption === 'pickup' ? 'border-primary bg-primary/10 ring-1 ring-primary/50' : 'border-white/10 bg-white/5 hover:bg-white/10'}`}
                                    >
                                        <div className={`w-4 h-4 rounded-full border-[4px] shrink-0 ${deliveryOption === 'pickup' ? 'border-primary bg-dark-900 shadow-[0_0_0_2px_rgba(99,102,241,0.2)]' : 'border-slate-500 bg-transparent'}`}></div>
                                        <div>
                                            <div className="font-medium text-white">Store Pickup</div>
                                            <div className="text-xs text-slate-400">Free - Collect locally</div>
                                        </div>
                                    </div>

                                    <div
                                        onClick={() => setDeliveryOption('delivery')}
                                        className={`p-4 rounded-xl border flex items-center gap-3 cursor-pointer transition-colors ${deliveryOption === 'delivery' ? 'border-primary bg-primary/10 ring-1 ring-primary/50' : 'border-white/10 bg-white/5 hover:bg-white/10'}`}
                                    >
                                        <div className={`w-4 h-4 rounded-full border-[4px] shrink-0 ${deliveryOption === 'delivery' ? 'border-primary bg-dark-900 shadow-[0_0_0_2px_rgba(99,102,241,0.2)]' : 'border-slate-500 bg-transparent'}`}></div>
                                        <div>
                                            <div className="font-medium text-white">Home Delivery</div>
                                            <div className="text-xs text-slate-400">GH₵ 50.00 - Doorstep drop-off</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-white/10">
                                <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-2">
                                    <CreditCard className="w-6 h-6 text-primary" /> Payment Method
                                </h2>
                                <div className="p-4 rounded-xl border border-primary/30 bg-primary/5 flex items-center justify-between cursor-pointer ring-1 ring-primary/50">
                                    <div className="flex items-center gap-3">
                                        <div className="w-4 h-4 rounded-full border-[4px] border-primary bg-dark-900 shadow-[0_0_0_2px_rgba(99,102,241,0.2)]"></div>
                                        <span className="font-medium text-white">Pay at Delivery / Mock Payment</span>
                                    </div>
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/M-PESA_LOGO-01.svg/512px-M-PESA_LOGO-01.svg.png" alt="Payment" className="h-6 opacity-50 grayscale" />
                                </div>
                                <p className="text-xs text-slate-500 mt-3">* Payment integration (Paystack/Stripe) will be linked here in future updates.</p>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full relative overflow-hidden bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 shadow-lg shadow-primary/25 hover:shadow-primary/40 focus:ring-2 focus:ring-accent disabled:opacity-70 disabled:cursor-not-allowed mt-8"
                            >
                                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Confirm Order & Pay'}
                            </button>
                        </form>
                    </motion.div>
                </div>

                {/* Order Summary */}
                <div className="lg:w-1/3">
                    <div className="glass-card p-6 sticky top-28 border border-white/10">
                        <h2 className="text-xl font-bold text-white mb-4 border-b border-white/10 pb-4">Order Summary</h2>

                        <div className="space-y-4 mb-6 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                            {cartItems.map(item => (
                                <div key={item.id} className="flex gap-4 items-center">
                                    <div className="w-16 h-16 rounded-lg bg-white/5 overflow-hidden shrink-0 border border-white/10 text-xs flex items-center justify-center relative">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover opacity-80" />
                                        <span className="absolute -top-1 -right-1 bg-dark-900 border border-white/20 text-white w-5 h-5 flex items-center justify-center rounded-full z-10">{item.quantity}</span>
                                    </div>
                                    <div className="flex-grow">
                                        <h4 className="text-sm text-white font-medium line-clamp-1">{item.name}</h4>
                                        <span className="text-accent text-sm font-bold mt-1">GHS {(parseFloat(item.price) * item.quantity).toLocaleString('en-GH', { minimumFractionDigits: 2 })}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="border-t border-white/10 pt-4 space-y-3">
                            <div className="flex justify-between text-slate-400 text-sm">
                                <span>Subtotal</span>
                                <span>GHS {cartTotal.toLocaleString('en-GH', { minimumFractionDigits: 2 })}</span>
                            </div>
                            <div className="flex justify-between text-slate-400 text-sm">
                                <span>Shipping ({deliveryOption === 'delivery' ? 'Home' : 'Pickup'})</span>
                                <span>{deliveryOption === 'delivery' ? 'GHS 50.00' : 'Free'}</span>
                            </div>
                            <div className="flex justify-between items-center text-white pt-4 mt-2 border-t border-white/10">
                                <span className="text-lg font-semibold">Total to Pay</span>
                                <span className="text-2xl font-bold text-gradient">
                                    GHS {finalTotal.toLocaleString('en-GH', { minimumFractionDigits: 2 })}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

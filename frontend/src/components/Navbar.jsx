import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ShoppingCart, LogOut, Menu, User, LayoutDashboard, PackageSearch } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
    const { currentUser, userData, logout } = useAuth();
    const { cartCount } = useCart();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    const NavLink = ({ to, children, icon: Icon }) => (
        <Link
            to={to}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${isActive(to)
                ? 'bg-primary/20 text-accent font-medium shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
            onClick={() => setIsMobileMenuOpen(false)}
        >
            {Icon && <Icon className="w-4 h-4" />}
            {children}
        </Link>
    );

    return (
        <nav className="sticky top-0 z-50 w-full backdrop-blur-md bg-dark-900/40 border-b border-white/10 shadow-xl supports-[backdrop-filter]:bg-dark-900/20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">

                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3 shrink-0 group">
                        <div className="w-16 h-16 rounded-xl bg-white flex items-center justify-center shadow-lg shadow-primary/30 group-hover:shadow-primary/50 transition-shadow overflow-hidden p-1">
                            {/* Logo Image Placeholder */}
                            <img src="/logo.png" alt="AI TRANS GLOBAL LIMITED Logo" className="w-full h-full object-contain" onError={(e) => { e.target.style.display = 'none' }} />
                        </div>
                        <span className="text-lg font-bold tracking-tight text-white hidden sm:block leading-tight">
                            AI TRANS GLOBAL<br /><span className="text-accent text-sm">LIMITED</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center justify-center flex-1 mx-8 gap-2">
                        <NavLink to="/" icon={PackageSearch}>Home</NavLink>
                        <NavLink to="/products" icon={PackageSearch}>Shop</NavLink>
                        {userData?.isAdmin && (
                            <NavLink to="/admin" icon={LayoutDashboard}>Dashboard</NavLink>
                        )}
                        <a href="tel:+233246267375" className="flex items-center gap-2 px-4 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 transition-all duration-300 ml-auto font-medium">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-phone w-4 h-4 text-accent"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                            +233 24 626 7375
                        </a>
                    </div>

                    {/* Right side actions */}
                    <div className="flex items-center gap-4">
                        {currentUser ? (
                            <div className="flex items-center gap-3">
                                <Link to="/cart" className="relative p-2 text-slate-300 hover:text-accent transition-colors">
                                    <ShoppingCart className="w-6 h-6" />
                                    {cartCount > 0 && (
                                        <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-accent text-[11px] font-bold flex items-center justify-center text-dark-900 shadow-lg shadow-accent/50 border border-dark-900">
                                            {cartCount}
                                        </span>
                                    )}
                                </Link>

                                <div className="hidden sm:flex items-center gap-3 border-l border-white/10 pl-4 ml-2">
                                    <div className="flex flex-col items-end">
                                        <span className="text-sm font-medium text-white">{userData?.name || 'User'}</span>
                                        <span className="text-xs text-accent">{userData?.isAdmin ? 'Admin' : 'Customer'}</span>
                                    </div>
                                    <button
                                        onClick={() => logout()}
                                        className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all"
                                        title="Logout"
                                    >
                                        <LogOut className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="hidden sm:flex items-center gap-3">
                                <Link to="/login" className="text-slate-300 hover:text-white font-medium px-4 py-2 transition-colors">
                                    Log In
                                </Link>
                                <Link to="/register" className="glass-button px-5 py-2 text-sm">
                                    Sign Up
                                </Link>
                            </div>
                        )}

                        {/* Mobile menu button */}
                        <button
                            className="md:hidden p-2 text-slate-300 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation Dropdown */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden border-t border-white/10 bg-dark-800/90 backdrop-blur-xl"
                    >
                        <div className="px-4 py-4 space-y-2">
                            <NavLink to="/" icon={PackageSearch}>Home</NavLink>
                            <NavLink to="/products" icon={PackageSearch}>Shop Products</NavLink>
                            {userData?.isAdmin && (
                                <NavLink to="/admin" icon={LayoutDashboard}>Admin Dashboard</NavLink>
                            )}

                            {!currentUser && (
                                <div className="pt-4 mt-4 border-t border-white/10 flex flex-col gap-2">
                                    <NavLink to="/login" icon={User}>Log In</NavLink>
                                    <Link to="/register" className="glass-button w-full px-4 py-3 text-center mt-2" onClick={() => setIsMobileMenuOpen(false)}>
                                        Create Account
                                    </Link>
                                </div>
                            )}

                            {currentUser && (
                                <div className="pt-4 mt-4 border-t border-white/10">
                                    <button
                                        onClick={() => { logout(); setIsMobileMenuOpen(false); }}
                                        className="flex items-center gap-2 px-4 py-3 w-full text-left text-red-400 hover:bg-red-400/10 rounded-xl transition-colors"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        Log Out
                                    </button>
                                </div>
                            )}

                            <div className="pt-4 mt-4 border-t border-white/10">
                                <a href="tel:+233246267375" className="flex items-center gap-2 px-4 py-3 w-full text-slate-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors font-medium">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-phone w-4 h-4 text-accent"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                                    +233 24 626 7375
                                </a>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}

import { motion } from 'framer-motion'
import { ShoppingCart, LayoutDashboard } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Home() {
    const { currentUser, userData, logout } = useAuth();

    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center p-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="glass-card p-10 max-w-2xl w-full text-center space-y-8 relative overflow-hidden"
            >
                {/* Abstract background blobs for extra glass effect */}
                <div className="absolute top-[-50px] right-[-50px] w-32 h-32 bg-primary/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-[-50px] left-[-50px] w-32 h-32 bg-accent/20 rounded-full blur-3xl"></div>

                <div className="flex justify-center mb-6 relative z-10">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/30">
                        <ShoppingCart className="w-10 h-10 text-white" />
                    </div>
                </div>

                <div className="relative z-10">
                    {currentUser && (
                        <div className="mb-4 text-accent/80 font-medium">
                            Welcome back, {userData?.name || currentUser.email}!
                        </div>
                    )}
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-white">
                        AI TRANS GLOBAL <span className="text-gradient">LIMITED</span>
                    </h1>

                    <p className="text-lg text-slate-300 mb-8 max-w-xl mx-auto">
                        Experience the future of online shopping with our incredibly fast,
                        beautifully designed glassmorphic platform powered by React and Firebase.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        {currentUser ? (
                            <>
                                <Link to="/products">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-primary to-purple-600 rounded-xl font-semibold shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-shadow"
                                    >
                                        Shop Now
                                    </motion.button>
                                </Link>
                                <motion.button
                                    onClick={() => logout()}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="glass-button px-8 py-3 w-full sm:w-auto"
                                >
                                    Log Out
                                </motion.button>
                            </>
                        ) : (
                            <>
                                <Link to="/register">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-primary to-purple-600 rounded-xl font-semibold shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-shadow"
                                    >
                                        Create Account
                                    </motion.button>
                                </Link>

                                <Link to="/login">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="glass-button px-8 py-3 w-full sm:w-auto"
                                    >
                                        Sign In
                                    </motion.button>
                                </Link>
                            </>
                        )}

                        {userData?.isAdmin && (
                            <Link to="/admin">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="glass-button px-8 py-3 flex items-center justify-center gap-2 w-full sm:w-auto border-accent/30 text-accent"
                                >
                                    <LayoutDashboard className="w-5 h-5" />
                                    Dashboard
                                </motion.button>
                            </Link>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    )
}

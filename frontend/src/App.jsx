import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Products from './pages/Products'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import AdminDashboard from './pages/AdminDashboard'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

function App() {
    return (
        <div className="flex flex-col min-h-screen relative">
            <Navbar />

            <main className="flex-grow pt-4">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/admin" element={<AdminDashboard />} />
                </Routes>
            </main>

            <Footer />
        </div>
    )
}

export default App

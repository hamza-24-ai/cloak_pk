import { BrowserRouter, Routes, Route } from "react-router-dom"
import { ProtectedRoute, AdminRoute } from "./components/shared/ProtectedRoute"
import {Toaster} from "sonner"

// Pages
import Home from "./pages/Home"
import Products from "./pages/Products"
import ProductDetail from "./pages/ProductDetail"
import Cart from "./pages/Cart"
import Checkout from "./pages/Checkout"
import Orders from "./pages/Orders"
import Login from "./pages/Login"
import Register from "./pages/Register"
import AdminDashboard from "./pages/admin/Dashboard"
import AdminLayout from "./components/layout/AdminLayout"

// Admin Pages
import AdminProducts from "./pages/admin/Products"
import AdminCategories from "./pages/admin/Categories"
import AdminOrders from "./pages/admin/Orders"
import AdminCoupons from "./pages/admin/Coupons"

// Layout
import Navbar from "./components/layout/Navbar"
import Footer from "./components/layout/Footer"


function App() {
    return (
        <>
        <BrowserRouter>
            <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Customer Routes — with Navbar + Footer */}
                <Route path="/" element={
                    <>
                        <Navbar />
                        <Home />
                        <Footer />
                    </>
                } />
                <Route path="/products" element={
                    <>
                        <Navbar />
                        <Products />
                        <Footer />
                    </>
                } />
                <Route path="/products/:id" element={
                    <>
                        <Navbar />
                        <ProductDetail />
                        <Footer />
                    </>
                } />
                <Route path="/cart" element={
                    <ProtectedRoute>
                        <Navbar />
                        <Cart />
                        <Footer />
                    </ProtectedRoute>
                } />
                <Route path="/checkout" element={
                    <ProtectedRoute>
                        <Navbar />
                        <Checkout />
                        <Footer />
                    </ProtectedRoute>
                } />
                <Route path="/orders" element={
                    <ProtectedRoute>
                        <Navbar />
                        <Orders />
                        <Footer />
                    </ProtectedRoute>
                } />

                {/* Admin Routes — no Navbar/Footer */}
                 <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
                    <Route path="dashboard" element={<AdminDashboard />} />
                    <Route path="products" element={<AdminProducts />} />
                    <Route path="categories" element={<AdminCategories />} />
                    <Route path="orders" element={<AdminOrders />} />
                    <Route path="coupons" element={<AdminCoupons />} />
                </Route>
            </Routes>
        </BrowserRouter>
        <Toaster richColors position="top-right"/>
        </>
    )
}

export default App
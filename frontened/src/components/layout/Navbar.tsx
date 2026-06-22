import { Link, useNavigate } from "react-router-dom"
import { ShoppingCart, User, Search, Heart, Menu, Bell, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuthStore } from "@/store/authStore"
import { useEffect, useState } from "react"
import {getCart} from "@/api/cart"
import type {CartItem} from "@/types/index"

export default function Navbar() {
    const { isAuthenticated, user, logout } = useAuthStore()
    const navigate = useNavigate()
    const [mobileOpen, setMobileOpen] = useState(false)
    const [searchOpen, setSearchOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [items, setItems] = useState<CartItem[]>([])

    const handleLogout = () => {
        logout()
        navigate("/login")
    }

    useEffect(()=> {
    const fetchCart = async() => {
        try{
            const cardItems = await getCart()
            setItems(cardItems)
        }catch(err){
            console.log(err)
        }
    }
    if(isAuthenticated) {  // ← yeh check add karo
        fetchCart()
    }
},[isAuthenticated])  // ← dependency bhi add karo
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        if (searchQuery.trim()) {
            navigate(`/products?search=${searchQuery}`)
            setSearchOpen(false)
            setSearchQuery("")
        }
    }
    const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0)
    return (
        <nav className="sticky top-0 z-50 bg-linear-to-r from-white to-[#C6A969]  border-b border-[#E4E4E7]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    
                    {/* Logo */}
                    <Link to="/" className="flex items-center">
                        <span className="text-2xl font-bold text-[#18181B] hover:scale-110 transition-all duration-200" style={{ fontFamily: "Playfair Display, serif" }}>
                            Cloak<span className="text-[#C6A969]">PK</span>
                        </span>
                    </Link>

                    {/* Desktop Nav Links */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link to="/products?category=men" className="text-md font-bold text-[#52525B] hover:text-[#e9b850] transition-all hover:scale-110 duration-300">
                            Men
                        </Link>
                        <Link to="/products?category=women" className="text-md font-bold text-[#52525B] hover:text-[#e9b850] transition-all hover:scale-110 duration-300">
                            Women
                        </Link>
                        <Link to="/products?category=kids" className="text-md font-bold text-[#52525B] hover:text-[#e9b850] transition-all hover:scale-110 duration-300">
                            Kids
                        </Link>
                        <Link to="/products?featured=true" className="text-md font-bold text-[#f7ab08] hover:text-[#09090B] transition-all hover:scale-110 duration-300">
                            Sale
                        </Link>
                    </div>
                    {searchOpen && (
                        <form 
                            onSubmit={handleSearch}
                            className="flex-1 max-w-md mx-4 flex items-center"
                        >
                            <input
                                type="text"
                                autoFocus
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search products..."
                                className="w-full border border-[#E4E4E7] rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#18181B]"
                            />
                        </form>
                    )}

                    {/* Right Icons */}
                    <div className="flex items-center space-x-4">
                        <button onClick={() => setSearchOpen(!searchOpen)}
                         className="text-[#52525B] hover:text-[#18181B] hover:scale-110 transition-all cursor-pointer duration-500">
                            {searchOpen ? <X size={20} /> : <Search size={20}/>} 
                        </button> 

                        {isAuthenticated && (
                            <Link to="/notifications" className="relative text-[#52525B] hover:text-[#18181B] hover:scale-110 transition-colors cursor-pointer">
                                <Bell size={20} />
                                
                            </Link>
                        )}

                        <button className="text-[#52525B] hover:text-[#18181B] transition-all hidden sm:block cursor-pointer hover:scale-125 duration-500">
                            <Heart size={20} />
                        </button>

                        <Link to="/cart" className="relative text-[#52525B] hover:text-[#18181B] transition-colors">
                            <ShoppingCart size={20} />
                            <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#18181B] text-white text-[10px] rounded-full flex items-center justify-center">
                                {
                                    totalQuantity

                                }
                            </span>
                        </Link>

                        {isAuthenticated ? (
                            <div className="hidden md:flex items-center space-x-3">
                                <Link to="/orders">
                                    <Button variant="ghost" size="sm" className="text-[#52525B] cursor-pointer">
                                        <User size={16} className="mr-1" />
                                        {user?.name}
                                    </Button>
                                </Link>
                                <Button 
                                    size="sm" 
                                    onClick={handleLogout}
                                    className="bg-[#18181B] hover:bg-[#09090B] text-white"
                                >
                                    Logout
                                </Button>
                            </div>
                        ) : (
                            <Link to="/login" className="hidden md:block">
                                <Button size="lg" className="bg-[#18181B] hover:bg-[#f7ab08] font-bold text-[#e9b850] hover:text-black cursor-pointer hover:scale-105 transition-all duration-300">
                                    Login
                                </Button>
                            </Link>
                        )}

                        {/* Mobile Menu Button */}
                        <button 
                            className="md:hidden text-[#52525B]"
                            onClick={() => setMobileOpen(!mobileOpen)}
                        >
                            {mobileOpen ? <X size={22}/> : <Menu size={22} /> }
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                <div 
                  className={`md:hidden overflow-hidden transition-all duration-700 ease-in-out ${
                  mobileOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                  }`}
                  >
                  <div className="py-4 border-t border-[#E4E4E7] space-y-3">
                      <Link to="/products?category=men" className="block text-sm font-medium text-[#52525B]">Men</Link>
                      <Link to="/products?category=women" className="block text-sm font-medium text-[#52525B]">Women</Link>
                      <Link to="/products?category=kids" className="block text-sm font-medium text-[#52525B]">Kids</Link>
                      <Link to="/products?featured=true" className="block text-sm font-medium text-[#C6A969]">Sale</Link>
                      {isAuthenticated ? (
                          <Button onClick={handleLogout} className="w-full bg-[#18181B] text-white">Logout</Button>
                      ) : (
                          <Link to="/login">
                              <Button className="w-full bg-[#f7ab08] text-black">Login</Button>
                          </Link>
                      )}
                  </div>
                </div>
            </div>
        </nav>
    )
}
import { Link, useLocation, useNavigate } from "react-router-dom"
import { LayoutDashboard, Package, ShoppingBag, Tags, Ticket, LogOut } from "lucide-react"
import { useAuthStore } from "@/store/authStore"

export default function AdminSidebar() {
    const location = useLocation()
    const navigate = useNavigate()
    const logout = useAuthStore((state) => state.logout)

    const menuItems = [
        { name: "Dashboard", icon: LayoutDashboard, path: "/admin/dashboard" },
        { name: "Products", icon: Package, path: "/admin/products" },
        { name: "Categories", icon: Tags, path: "/admin/categories" },
        { name: "Orders", icon: ShoppingBag, path: "/admin/orders" },
        { name: "Coupons", icon: Ticket, path: "/admin/coupons" },
    ]

    const handleLogout = () => {
        logout()
        navigate("/login")
    }

    return (
        <aside className="w-64 bg-[#18181B] min-h-screen flex flex-col fixed left-0 top-0">
            <div className="p-6 border-b border-[#27272A]">
                <span className="text-2xl font-bold text-white" style={{ fontFamily: "Playfair Display, serif" }}>
                    Cloak<span className="text-[#C6A969]">PK</span>
                </span>
                <p className="text-[#71717A] text-xs mt-1">Admin Panel</p>
            </div>

            <nav className="flex-1 px-3 py-6 space-y-1">
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.path
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                                isActive 
                                    ? "bg-[#C6A969] text-white" 
                                    : "text-[#A1A1AA] hover:bg-[#27272A] hover:text-white"
                            }`}
                        >
                            <item.icon size={18} />
                            {item.name}
                        </Link>
                    )
                })}
            </nav>

            <div className="p-3 border-t border-[#27272A]">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-[#A1A1AA] hover:bg-[#27272A] hover:text-white w-full transition-colors"
                >
                    <LogOut size={18} />
                    Logout
                </button>
            </div>
        </aside>
    )
}
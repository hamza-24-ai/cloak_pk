import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Package, ChevronRight } from "lucide-react"
import { getOrders } from "@/api/order"
import type { Order } from "@/types"

const statusColors: Record<string, string> = {
    pending: "bg-yellow-50 text-yellow-700",
    processing: "bg-blue-50 text-blue-700",
    shipped: "bg-purple-50 text-purple-700",
    delivered: "bg-green-50 text-[#16A34A]",
    cancelled: "bg-red-50 text-[#DC2626]",
}

export default function Orders() {
    const [orders, setOrders] = useState<Order[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        getOrders()
            .then(setOrders)
            .finally(() => setLoading(false))
    }, [])

    if (loading) {
        return <div className="max-w-4xl mx-auto px-4 py-20 text-center text-[#71717A]">Loading...</div>
    }

    if (orders.length === 0) {
        return (
            <main className="max-w-4xl mx-auto px-4 py-20 text-center">
                <Package size={48} className="mx-auto text-[#E4E4E7] mb-4" />
                <h2 className="text-xl font-medium text-[#18181B] mb-2">No orders yet</h2>
                <p className="text-[#71717A] text-sm mb-6">Your order history will show up here.</p>
                <Link to="/products" className="text-[#C6A969] font-medium hover:underline text-sm">
                    Start Shopping
                </Link>
            </main>
        )
    }

    return (
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-2xl font-semibold text-[#18181B] mb-6" style={{ fontFamily: "Playfair Display, serif" }}>
                My Orders
            </h1>

            <div className="space-y-4">
                {orders.map((order) => (
                    <Link 
                        key={order.id} 
                        to={`/orders/${order.id}`}
                        className="block bg-white border border-[#E4E4E7] rounded-lg p-5 hover:border-[#C6A969] transition-colors"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-[#FAFAF9] rounded-md flex items-center justify-center">
                                    <Package size={20} className="text-[#71717A]" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-[#18181B]">Order #{order.id}</p>
                                    <p className="text-xs text-[#71717A] mt-0.5">
                                        {new Date(order.created_at).toLocaleDateString("en-PK", { day: "numeric", month: "short", year: "numeric" })}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="text-right">
                                    <p className="text-sm font-semibold text-[#18181B]">Rs. {order.total}</p>
                                    <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${statusColors[order.status] || "bg-gray-50 text-gray-700"}`}>
                                        {order.status}
                                    </span>
                                </div>
                                <ChevronRight size={18} className="text-[#71717A]" />
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </main>
    )
}
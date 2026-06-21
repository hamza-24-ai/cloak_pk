import { useEffect, useState } from "react"
import { getAllOrders, updateOrderStatus } from "@/api/admin"
import type { Order } from "@/types/index"
import { toast } from "sonner"

const statusColors: Record<string, string> = {
    pending: "bg-yellow-50 text-yellow-700",
    processing: "bg-blue-50 text-blue-700",
    shipped: "bg-purple-50 text-purple-700",
    delivered: "bg-green-50 text-[#16A34A]",
    cancelled: "bg-red-50 text-[#DC2626]",
}

const statuses = ["pending", "processing", "shipped", "delivered", "cancelled"]

export default function AdminOrders() {
    const [orders, setOrders] = useState<Order[]>([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState("all")

    const fetchOrders = async () => {
        try {
            const data = await getAllOrders()
            setOrders(data)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchOrders()
    }, [])

    const handleStatusChange = async (orderId: number, newStatus: string) => {
        try {
            await updateOrderStatus(orderId, newStatus)
            setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, status: newStatus as any } : o))
            toast.success("Status have changed Successfully")
        } catch (err: any) {
            toast.error(err.message)
        }
    }

    const filteredOrders = filter === "all" ? orders : orders.filter((o) => o.status === filter)

    return (
        <div>
            <h1 className="text-2xl font-semibold text-[#18181B] mb-6">Orders</h1>

            {/* Filter Tabs */}
            <div className="flex gap-2 mb-6 overflow-x-auto">
                {["all", ...statuses].map((s) => (
                    <button
                        key={s}
                        onClick={() => setFilter(s)}
                        className={`px-4 py-1.5 text-sm rounded-md capitalize whitespace-nowrap transition-colors ${
                            filter === s ? "bg-[#18181B] text-white" : "bg-white border border-[#E4E4E7] text-[#52525B]"
                        }`}
                    >
                        {s}
                    </button>
                ))}
            </div>

            <div className="bg-white border border-[#E4E4E7] rounded-lg overflow-hidden">
                {loading ? (
                    <p className="p-6 text-[#71717A] text-center">Loading...</p>
                ) : filteredOrders.length === 0 ? (
                    <p className="p-6 text-[#71717A] text-center">No orders found</p>
                ) : (
                    <table className="w-full">
                        <thead className="bg-[#FAFAF9] border-b border-[#E4E4E7]">
                            <tr>
                                <th className="text-left text-xs font-medium text-[#71717A] uppercase px-4 py-3">Order ID</th>
                                <th className="text-left text-xs font-medium text-[#71717A] uppercase px-4 py-3">Date</th>
                                <th className="text-left text-xs font-medium text-[#71717A] uppercase px-4 py-3">Total</th>
                                <th className="text-left text-xs font-medium text-[#71717A] uppercase px-4 py-3">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOrders.map((order) => (
                                <tr key={order.id} className="border-b border-[#E4E4E7] last:border-0">
                                    <td className="px-4 py-3 text-sm text-[#18181B] font-medium">#{order.id}</td>
                                    <td className="px-4 py-3 text-sm text-[#71717A]">
                                        {new Date(order.created_at).toLocaleDateString("en-PK", { day: "numeric", month: "short" })}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-[#18181B]">Rs. {order.total}</td>
                                    <td className="px-4 py-3">
                                        <select
                                            value={order.status}
                                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                            className={`text-xs px-2 py-1 rounded-full capitalize border-0 cursor-pointer ${statusColors[order.status]}`}
                                        >
                                            {statuses.map((s) => (
                                                <option key={s} value={s}>{s}</option>
                                            ))}
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    )
}
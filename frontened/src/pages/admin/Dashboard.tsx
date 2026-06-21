import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { DollarSign, ShoppingBag, Package, Users, ArrowRight } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { getDashboardStats, getRevenueChart, getRecentOrders } from "@/api/admin"
import type { DashboardStats, RevenuePoint } from "@/api/admin"
import type { Order } from "@/types"

const statusColors: Record<string, string> = {
    pending: "bg-yellow-50 text-yellow-700",
    processing: "bg-blue-50 text-blue-700",
    shipped: "bg-purple-50 text-purple-700",
    delivered: "bg-green-50 text-[#16A34A]",
    cancelled: "bg-red-50 text-[#DC2626]",
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<DashboardStats | null>(null)
    const [chartData, setChartData] = useState<RevenuePoint[]>([])
    const [recentOrders, setRecentOrders] = useState<Order[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsData, chart, recent] = await Promise.all([
                    getDashboardStats(),
                    getRevenueChart(),
                    getRecentOrders()
                ])
                setStats(statsData)
                setChartData(chart)
                setRecentOrders(recent)
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    const statCards = [
        { label: "Total Revenue", value: `Rs. ${stats?.total_revenue.toLocaleString() || 0}`, icon: DollarSign, color: "#16A34A" },
        { label: "Total Orders", value: stats?.total_orders || 0, icon: ShoppingBag, color: "#18181B" },
        { label: "Total Products", value: stats?.total_products || 0, icon: Package, color: "#C6A969" },
        { label: "Total Users", value: stats?.total_users || 0, icon: Users, color: "#71717A" },
    ]

    return (
        <div>
            <h1 className="text-2xl font-semibold text-[#18181B] mb-6">Dashboard</h1>

            {/* Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {statCards.map((card) => (
                    <div key={card.label} className="bg-white border border-[#E4E4E7] rounded-lg p-5">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs text-[#71717A] uppercase font-medium">{card.label}</span>
                            <div 
                                className="w-9 h-9 rounded-md flex items-center justify-center"
                                style={{ backgroundColor: `${card.color}15` }}
                            >
                                <card.icon size={16} style={{ color: card.color }} />
                            </div>
                        </div>
                        <p className="text-2xl font-semibold text-[#18181B]">
                            {loading ? "..." : card.value}
                        </p>
                    </div>
                ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Revenue Chart */}
                <div className="lg:col-span-2 bg-white border border-[#E4E4E7] rounded-lg p-5">
                    <h2 className="text-sm font-medium text-[#18181B] mb-4">Revenue — Last 7 Days</h2>
                    {loading ? (
                        <div className="h-64 flex items-center justify-center text-[#71717A] text-sm">Loading...</div>
                    ) : chartData.length === 0 ? (
                        <div className="h-64 flex items-center justify-center text-[#71717A] text-sm">No revenue data yet</div>
                    ) : (
                        <ResponsiveContainer width="100%" height={260}>
                            <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#E4E4E7" />
                                <XAxis 
                                    dataKey="date" 
                                    tick={{ fontSize: 12, fill: "#71717A" }}
                                    tickFormatter={(value) => new Date(value).toLocaleDateString("en-PK", { day: "numeric", month: "short" })}
                                />
                                <YAxis tick={{ fontSize: 12, fill: "#71717A" }} />
                                <Tooltip 
                                    contentStyle={{ borderRadius: 8, border: "1px solid #E4E4E7", fontSize: 13 }}
                                    formatter={(value: number) => [`Rs. ${value}`, "Revenue"]}
                                />
                                <Line 
                                    type="monotone" 
                                    dataKey="revenue" 
                                    stroke="#C6A969" 
                                    strokeWidth={2.5}
                                    dot={{ fill: "#C6A969", r: 4 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    )}
                </div>

                {/* Recent Orders */}
                <div className="bg-white border border-[#E4E4E7] rounded-lg p-5">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-sm font-medium text-[#18181B]">Recent Orders</h2>
                        <Link to="/admin/orders" className="text-xs text-[#C6A969] flex items-center gap-1 hover:underline">
                            View all <ArrowRight size={12} />
                        </Link>
                    </div>

                    {loading ? (
                        <p className="text-sm text-[#71717A]">Loading...</p>
                    ) : recentOrders.length === 0 ? (
                        <p className="text-sm text-[#71717A]">No orders yet</p>
                    ) : (
                        <div className="space-y-3">
                            {recentOrders.map((order) => (
                                <div key={order.id} className="flex items-center justify-between pb-3 border-b border-[#E4E4E7] last:border-0 last:pb-0">
                                    <div>
                                        <p className="text-sm font-medium text-[#18181B]">#{order.id}</p>
                                        <p className="text-xs text-[#71717A]">
                                            {new Date(order.created_at).toLocaleDateString("en-PK", { day: "numeric", month: "short" })}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-medium text-[#18181B]">Rs. {order.total}</p>
                                        <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${statusColors[order.status]}`}>
                                            {order.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
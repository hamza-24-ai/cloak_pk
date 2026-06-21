
import {getOrders,confirmPayment} from "@/api/order"
import {Button} from "@/components/ui/button"
import {Link} from "react-router-dom"
import type {Order} from "@/types/index"
import {Package,CheckCircle2} from "lucide-react"
import { useEffect, useState } from "react"

const OrderSuccess = () => {

  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLatestOrder = async () => {
        try {
            const orders = await getOrders()
            if (orders.length > 0) {
                const latest = orders[0]
                if (latest.status === "pending") {
                    await confirmPayment(latest.id)
                    latest.status = "processing"
                }
                setOrder(latest)
            }
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }
    fetchLatestOrder()
}, [])

  const estimatedDate = new Date()
  estimatedDate.setDate(estimatedDate.getDate() + 5)

  return (
    <main className="max-w-2xl mx-auto px-4 py-20 text-center">
            <div className="w-20 h-20 bg-[#16A34A]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={40} className="text-[#16A34A]" />
            </div>

            <h1 className="text-2xl font-semibold text-[#18181B] mb-2" style={{ fontFamily: "Playfair Display, serif" }}>
                Order Placed Successfully!
            </h1>
            <p className="text-[#71717A] text-sm mb-8">
                Thank you for shopping with CloakPK. Your order is being processed.
            </p>

            {!loading && order && (
                <div className="bg-white border border-[#E4E4E7] rounded-lg p-6 mb-8 text-left">
                    <div className="flex items-center justify-between mb-4 pb-4 border-b border-[#E4E4E7]">
                        <div className="flex items-center gap-2">
                            <Package size={18} className="text-[#C6A969]" />
                            <span className="text-sm font-medium text-[#18181B]">Order #{order.id}</span>
                        </div>
                        <span className="text-xs bg-[#FAFAF9] text-[#71717A] px-2.5 py-1 rounded-full capitalize">
                            {order.status}
                        </span>
                    </div>

                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-[#71717A]">Total Amount</span>
                            <span className="text-[#18181B] font-medium">Rs. {order.total}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-[#71717A]">Estimated Delivery</span>
                            <span className="text-[#18181B] font-medium">
                                {estimatedDate.toLocaleDateString("en-PK", { day: "numeric", month: "long", year: "numeric" })}
                            </span>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex gap-3 justify-center">
                <Link to="/orders">
                    <Button variant="outline" className="border-[#18181B] text-[#18181B]">
                        Track Order
                    </Button>
                </Link>
                <Link to="/products">
                    <Button className="bg-[#18181B] hover:bg-[#09090B] text-white">
                        Continue Shopping
                    </Button>
                </Link>
            </div>
        </main>
  )
}

export default OrderSuccess

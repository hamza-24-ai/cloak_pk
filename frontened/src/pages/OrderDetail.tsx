import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { ArrowLeft, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getOrder } from "@/api/order"
import type { Order } from "@/types"
import api from "@/api/axios"
import { toast } from "sonner"

const statusColors: Record<string, string> = {
    pending: "bg-yellow-50 text-yellow-700",
    processing: "bg-blue-50 text-blue-700",
    shipped: "bg-purple-50 text-purple-700",
    delivered: "bg-green-50 text-[#16A34A]",
    cancelled: "bg-red-50 text-[#DC2626]",
}

const voucherEligible = ["shipped", "delivered"]

export default function OrderDetail() {
    const { id } = useParams()
    const [order, setOrder] = useState<Order | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!id) return
        getOrder(Number(id))
            .then(setOrder)
            .finally(() => setLoading(false))
    }, [id])

const handleDownloadVoucher = async () => {
    try {
        const response = await api.get(`/orders/${id}/voucher`, {
            responseType: "blob"
        })
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement("a")
        link.href = url
        link.setAttribute("download", `CloakPK_Order_${id}.pdf`)
        document.body.appendChild(link)
        link.click()
        link.remove()
        window.URL.revokeObjectURL(url)
        toast.success("Voucher downloaded successfully")
    } catch (err) {
        toast.error("Failed to download voucher")
        console.error(err)
    }
}

    if (loading) {
        return <div className="max-w-2xl mx-auto px-4 py-20 text-center text-[#71717A]">Loading...</div>
    }

    if (!order) {
        return <div className="max-w-2xl mx-auto px-4 py-20 text-center text-[#71717A]">Order not found</div>
    }

    return (
        <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Link to="/orders" className="flex items-center gap-1 text-sm text-[#71717A] hover:text-[#18181B] mb-6">
                <ArrowLeft size={16} />
                Back to Orders
            </Link>

            <div className="bg-white border border-[#E4E4E7] rounded-lg p-6">
                <div className="flex items-center justify-between mb-6 pb-6 border-b border-[#E4E4E7]">
                    <div>
                        <h1 className="text-xl font-semibold text-[#18181B]">Order #{order.id}</h1>
                        <p className="text-xs text-[#71717A] mt-1">
                            Placed on {new Date(order.created_at).toLocaleDateString("en-PK", { day: "numeric", month: "long", year: "numeric" })}
                        </p>
                    </div>
                    <span className={`text-xs px-3 py-1 rounded-full capitalize font-medium ${statusColors[order.status]}`}>
                        {order.status}
                    </span>
                </div>

                <div className="mb-6">
                    <h3 className="text-sm font-medium text-[#18181B] mb-2">Delivery Address</h3>
                    <p className="text-sm text-[#52525B]">
                        {order.address.street}, {order.address.city}, {order.address.state} {order.address.zip_code}, {order.address.country}
                    </p>
                </div>

                <div className="flex justify-between items-center mb-6 pb-6 border-b border-[#E4E4E7]">
                    <span className="text-sm text-[#71717A]">Total Amount</span>
                    <span className="text-lg font-semibold text-[#18181B]">Rs. {order.total}</span>
                </div>

                {voucherEligible.includes(order.status) ? (
                    <Button 
                        onClick={handleDownloadVoucher}
                        className="w-full bg-[#C6A969] hover:bg-[#B89958] text-white cursor-pointer"
                    >
                        <Download size={16} className="mr-2" />
                        Download Voucher
                    </Button>
                ) : (
                    <p className="text-xs text-[#71717A] text-center bg-[#FAFAF9] py-3 rounded-md">
                        Voucher will be available once your order is shipped
                    </p>
                )}
            </div>
        </main>
    )
}
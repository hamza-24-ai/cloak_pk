import { useEffect, useState } from "react"
import { Plus, Trash2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getAllCoupons, createCouponAdmin, deleteCoupon } from "@/api/coupons"
import { toast } from "sonner"

interface Coupon {
    id: number
    code: string
    discount_percent: number
    max_uses: number
    used_count: number
    is_active: boolean
}

export default function AdminCoupons() {
    const [coupons, setCoupons] = useState<Coupon[]>([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [code, setCode] = useState("")
    const [discount, setDiscount] = useState("")
    const [maxUses, setMaxUses] = useState("100")
    const [submitting, setSubmitting] = useState(false)

    const fetchCoupons = async () => {
        try {
            const data = await getAllCoupons()
            setCoupons(data)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchCoupons()
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!code || !discount) return

        setSubmitting(true)
        try {
            await createCouponAdmin({
                code: code.toUpperCase(),
                discount_percent: Number(discount),
                max_uses: Number(maxUses)
            })
            setCode(""); setDiscount(""); setMaxUses("100")
            setShowForm(false)
            fetchCoupons()
            toast.success("Coupon have created Successfull")
        } catch (err: any) {
             toast.error(err.message)
        } finally {
            setSubmitting(false)
        }
    }

    const handleDelete = async (id: number) => {
        if (!confirm("Delete this coupon?")) return
        try {
            await deleteCoupon(id)
            fetchCoupons()
            toast.success("Coupon have deleted Successfull")
        } catch (err: any) {
            toast.error(err.message)
        }
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-semibold text-[#18181B]">Coupons</h1>
                <Button 
                    onClick={() => setShowForm(!showForm)}
                    className="bg-[#18181B] hover:bg-[#09090B] text-white"
                >
                    {showForm ? <X size={16} className="mr-1" /> : <Plus size={16} className="mr-1" />}
                    {showForm ? "Close" : "Add Coupon"}
                </Button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className="bg-white border border-[#E4E4E7] rounded-lg p-5 mb-6 grid grid-cols-4 gap-3">
                    <Input placeholder="CODE" value={code} onChange={(e) => setCode(e.target.value)} className="border-[#E4E4E7]" />
                    <Input type="number" placeholder="Discount %" value={discount} onChange={(e) => setDiscount(e.target.value)} className="border-[#E4E4E7]" />
                    <Input type="number" placeholder="Max Uses" value={maxUses} onChange={(e) => setMaxUses(e.target.value)} className="border-[#E4E4E7]" />
                    <Button type="submit" disabled={submitting} className="bg-[#C6A969] hover:bg-[#B89958] text-white">
                        {submitting ? "Saving..." : "Save"}
                    </Button>
                </form>
            )}

            <div className="bg-white border border-[#E4E4E7] rounded-lg overflow-hidden">
                {loading ? (
                    <p className="p-6 text-[#71717A] text-center">Loading...</p>
                ) : coupons.length === 0 ? (
                    <p className="p-6 text-[#71717A] text-center">No coupons yet</p>
                ) : (
                    <table className="w-full">
                        <thead className="bg-[#FAFAF9] border-b border-[#E4E4E7]">
                            <tr>
                                <th className="text-left text-xs font-medium text-[#71717A] uppercase px-4 py-3">Code</th>
                                <th className="text-left text-xs font-medium text-[#71717A] uppercase px-4 py-3">Discount</th>
                                <th className="text-left text-xs font-medium text-[#71717A] uppercase px-4 py-3">Usage</th>
                                <th className="text-right text-xs font-medium text-[#71717A] uppercase px-4 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {coupons.map((c) => (
                                <tr key={c.id} className="border-b border-[#E4E4E7] last:border-0">
                                    <td className="px-4 py-3 text-sm font-medium text-[#18181B]">{c.code}</td>
                                    <td className="px-4 py-3 text-sm text-[#52525B]">{c.discount_percent}%</td>
                                    <td className="px-4 py-3 text-sm text-[#71717A]">{c.used_count} / {c.max_uses}</td>
                                    <td className="px-4 py-3 text-right">
                                        <button onClick={() => handleDelete(c.id)} className="text-[#DC2626] hover:bg-red-50 p-1.5 rounded-md">
                                            <Trash2 size={16} />
                                        </button>
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
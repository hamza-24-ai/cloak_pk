import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getCart, updateCartItem, deleteCart } from "@/api/cart"
import { getProduct } from "@/api/product"
import { VerifyCoupon } from "@/api/coupons"
import type { CartItem, Product } from "@/types"

import { toast } from "sonner"

interface EnrichedCartItem extends CartItem {
    product: Product
}

export default function Cart() {
    const navigate = useNavigate()
    const [items, setItems] = useState<EnrichedCartItem[]>([])
    const [loading, setLoading] = useState(true)
    const [couponCode, setCouponCode] = useState("")
    const [applyingCoupon, setApplyingCoupon] = useState(false)
    const [discount, setDiscount] = useState(0)
    const [appliedCoupon, setAppliedCoupon] = useState("")

    const fetchCart = async () => {
        setLoading(true)
        try {
            const cartItems = await getCart()
            const enriched = await Promise.all(
                cartItems.map(async (item) => {
                    const product = await getProduct(item.product_id)
                    return { ...item, product }
                })
            )
            setItems(enriched)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchCart()
    }, [])

    const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
    const total = subtotal - discount

    const handleQuantityChange = async (cartId: number, newQty: number) => {
        if (newQty < 1) return
        try {
            await updateCartItem(cartId, newQty)
            setItems((prev) => prev.map((item) => item.id === cartId ? { ...item, quantity: newQty } : item))
            toast.success("Cart Update Successfully")
        } catch (err: any) {
            toast.error(err)
        }
    }

    const handleRemove = async (cartId: number) => {
        try {
            await deleteCart(cartId)
            setItems((prev) => prev.filter((item) => item.id !== cartId))
            toast.success("Item Deleted Successfully")
        } catch (err) {
            console.log(err)
            toast.error("Item cannot deleted")
        }
    }

    const handleApplyCoupon = async () => {
        if (!couponCode.trim()) {
          toast.error("Write Coupon Code")
          return
        }
        setApplyingCoupon(true)
        try {
            const result = await VerifyCoupon(couponCode, subtotal)
            setDiscount(result.discount_amount)
            setAppliedCoupon(couponCode)
            toast.success("Coupon Code Applied Successfully")
        } catch (err) {
            console.log(err.response.data)
            setDiscount(0)
            setAppliedCoupon("")
            toast.error("Coupon Code is Invalid or expired")
        } finally {
            setApplyingCoupon(false)
        }
    }

    if (loading) {
        return <div className="max-w-7xl mx-auto px-4 py-20 text-center text-[#71717A]">Loading...</div>
    }

    if (items.length === 0) {
        return (
            <main className="max-w-7xl mx-auto px-4 py-20 text-center">
                <ShoppingBag size={48} className="mx-auto text-[#E4E4E7] mb-4" />
                <h2 className="text-xl font-medium text-[#18181B] mb-2">Your cart is empty</h2>
                <p className="text-[#71717A] text-sm mb-6">Looks like you haven't added anything yet.</p>
                <Link to="/products">
                    <Button className="bg-[#18181B] hover:bg-[#09090B] text-white">Start Shopping</Button>
                </Link>
            </main>
        )
    }

    return (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-2xl font-semibold text-[#18181B] mb-6 font-serif" >
                Shopping Cart
            </h1>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-4">
                    {items.map((item) => (
                        <div key={item.id} className="flex gap-4 bg-white border border-[#E4E4E7] rounded-lg p-4">
                            <Link to={`/products/${item.product.id}`} className="w-20 h-20 rounded-md overflow-hidden bg-[#FAFAF9] shrink-0">
                                <img src={item.product.images[0] || "/placeholder.jpg"} className="w-full h-full object-cover" />
                            </Link>

                            <div className="flex-1">
                                <Link to={`/products/${item.product.id}`}>
                                    <h3 className="text-sm font-medium text-[#18181B] hover:text-[#C6A969]">{item.product.name}</h3>
                                </Link>
                                <p className="text-xs text-[#71717A] mt-1">
                                    {item.size && `Size: ${item.size}`} {item.color && `· Color: ${item.color}`}
                                </p>
                                <div className="flex items-center justify-between mt-3">
                                    <div className="flex items-center gap-2 border border-[#E4E4E7] rounded-md">
                                        <button onClick={() => handleQuantityChange(item.id, item.quantity - 1)} className="p-1.5 text-[#52525B]">
                                            <Minus size={12} />
                                        </button>
                                        <span className="text-sm w-6 text-center">{item.quantity}</span>
                                        <button onClick={() => handleQuantityChange(item.id, item.quantity + 1)} className="p-1.5 text-[#52525B]">
                                            <Plus size={12} />
                                        </button>
                                    </div>
                                    <span className="text-sm font-semibold text-[#18181B]">
                                        Rs. {item.product.price * item.quantity}
                                    </span>
                                </div>
                            </div>

                            <button onClick={() => handleRemove(item.id)} className="text-[#DC2626] hover:bg-red-50 p-1.5 rounded-md self-start">
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ))}
                </div>

                {/* Order Summary */}
                <div className="bg-white border border-[#E4E4E7] rounded-lg p-5 h-fit sticky top-20">
                    <h2 className="text-lg font-medium text-[#18181B] mb-4">Order Summary</h2>

                    {/* Coupon */}
                    <div className="mb-4">
                        <div className="flex gap-2">
                            <Input
                                placeholder="Coupon code"
                                value={couponCode}
                                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                className="border-[#E4E4E7]"
                            />
                            <Button 
                                onClick={handleApplyCoupon}
                                disabled={applyingCoupon}
                                variant="outline"
                                className="border-[#18181B] text-[#18181B] shrink-0"
                            >
                                Apply
                            </Button>
                        </div>
                        {appliedCoupon && <p className="text-xs text-[#16A34A] mt-1">"{appliedCoupon}" applied!</p>}
                    </div>

                    <div className="space-y-2 border-t border-[#E4E4E7] pt-4">
                        <div className="flex justify-between text-sm">
                            <span className="text-[#71717A]">Subtotal</span>
                            <span className="text-[#18181B]">Rs. {subtotal}</span>
                        </div>
                        {discount > 0 && (
                            <div className="flex justify-between text-sm">
                                <span className="text-[#71717A]">Discount</span>
                                <span className="text-[#16A34A]">- Rs. {discount}</span>
                            </div>
                        )}
                        <div className="flex justify-between text-base font-semibold border-t border-[#E4E4E7] pt-2 mt-2">
                            <span className="text-[#18181B]">Total</span>
                            <span className="text-[#18181B]">Rs. {total}</span>
                        </div>
                    </div>

                    <Button 
                        onClick={() => navigate("/checkout", { state: { couponCode: appliedCoupon } })}
                        className="w-full bg-[#C6A969] hover:bg-[#B89958] text-white mt-5"
                    >
                        Proceed to Checkout
                    </Button>
                </div>
            </div>
        </main>
    )
}
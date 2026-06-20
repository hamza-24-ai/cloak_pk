

import {useNavigate, useLocation} from "react-router-dom"
import {useForm} from "react-hook-form"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import type {CartItem,Product} from "@/types/index"
import { getProduct } from "@/api/product"
import { getCart } from "@/api/cart"
import { VerifyCoupon } from "@/api/coupons"
import { placeOrder,createPayment } from "@/api/order"
import { useEffect, useState} from "react"
import { toast } from "sonner"

interface checkOutForm {
  fullName : string
  phone : string
  city : string
  state : string
  street : string
  zip_code : string
}

interface enrichedCart extends CartItem {
  product : Product
}
const Checkout = () => {

  const navigate = useNavigate()
  const location = useLocation()

  const couponCode = (location.state as any)?.couponCode || ""

  const [items, setItems] = useState<enrichedCart[]>([])
  const [loading, setLoading] = useState(true)
  const [discount, setDiscount] = useState(0)
  const [paymentMethod, setPaymentMethod] = useState<"stripe" | "cod">("stripe")
  const [placing, setPlacing] = useState(false)

  const {register, handleSubmit, formState : { errors } }= useForm<checkOutForm>()

  const fetchcart = async () => {
      
      try {
        const cartItems = await getCart()
        console.log(cartItems.length)
        if(cartItems.length === 0){
          toast.error("Please add products in your cart")
          navigate("/cart")
          return
        }

        const enriched = await Promise.all(
          cartItems.map(async (item) => {
            const product = await getProduct(item.product_id)

            return {...item, product}
          })
        )

        setItems(enriched)

        const subtotal = enriched.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
        if (couponCode){
          const result = await VerifyCoupon(couponCode,subtotal)

          setDiscount(result.discount_amount)
        }
      }catch(err){
        toast.error("No Cart Found")
        console.log(err)
      }finally{
        setLoading(false)
      }


    }

  useEffect(() => {

    fetchcart()
  },[])

  const subtotal = items.reduce((sum,item) => sum + item.product.price * item.quantity , 0)
  const total = subtotal - discount

  const onSubmit = async ( formdata : checkOutForm) => {
    setPlacing(true)

    try {
      const order = await placeOrder( {
        city : formdata.city,
        street : formdata.street,
        zip_code : formdata.zip_code,
        state : formdata.state,
        country : "Pakistan"

      }, couponCode || undefined)

      if (paymentMethod === "stripe"){
        const {payment_url} = await createPayment(order.id)

        window.location.href = payment_url
      }else{
        toast.error("Currently we didn't accept Payment Cash on delievery")
        return
      }
    }catch(err){
      toast.error("Some Problem Occured in payment process")
      console.log(err)
    }finally{
      setPlacing(false)
    }
  }

  if (loading) return <div className="max-w-7xl mx-auto text-3xl text-[#71717A] px-4 py-16 text-center ">Loading ........</div>
  return (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-2xl font-semibold text-[#18181B] mb-6" style={{ fontFamily: "Playfair Display, serif" }}>
                Checkout
            </h1>

            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left — Address Form */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white border border-[#E4E4E7] rounded-lg p-5">
                            <h2 className="text-lg font-medium text-[#18181B] mb-4">Shipping Address</h2>

                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-medium text-[#18181B] mb-1.5">Full Name</label>
                                    <Input {...register("fullName", { required: "Required" })} className="border-[#E4E4E7]" />
                                    {errors.fullName && <p className="text-[#DC2626] text-xs mt-1">{errors.fullName.message}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#18181B] mb-1.5">Phone</label>
                                    <Input {...register("phone", { required: "Required" })} placeholder="03XXXXXXXXX" className="border-[#E4E4E7]" />
                                    {errors.phone && <p className="text-[#DC2626] text-xs mt-1">{errors.phone.message}</p>}
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-[#18181B] mb-1.5">Street Address</label>
                                <Input {...register("street", { required: "Required" })} placeholder="House 123, Block A" className="border-[#E4E4E7]" />
                                {errors.street && <p className="text-[#DC2626] text-xs mt-1">{errors.street.message}</p>}
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-[#18181B] mb-1.5">City</label>
                                    <Input {...register("city", { required: "Required" })} placeholder="Karachi" className="border-[#E4E4E7]" />
                                    {errors.city && <p className="text-[#DC2626] text-xs mt-1">{errors.city.message}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#18181B] mb-1.5">Province</label>
                                    <Input {...register("state", { required: "Required" })} placeholder="Sindh" className="border-[#E4E4E7]" />
                                    {errors.state && <p className="text-[#DC2626] text-xs mt-1">{errors.state.message}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#18181B] mb-1.5">ZIP Code</label>
                                    <Input {...register("zip_code", { required: "Required" })} placeholder="75000" className="border-[#E4E4E7]" />
                                    {errors.zip_code && <p className="text-[#DC2626] text-xs mt-1">{errors.zip_code.message}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Payment Method */}
                        <div className="bg-white border border-[#E4E4E7] rounded-lg p-5">
                            <h2 className="text-lg font-medium text-[#18181B] mb-4">Payment Method</h2>
                            <div className="space-y-3">
                                <label className={`flex items-center gap-3 border rounded-md p-3 cursor-pointer transition-colors ${
                                    paymentMethod === "stripe" ? "border-[#18181B] bg-[#FAFAF9]" : "border-[#E4E4E7]"
                                }`}>
                                    <input 
                                        type="radio" 
                                        checked={paymentMethod === "stripe"} 
                                        onChange={() => setPaymentMethod("stripe")}
                                        className="w-4 h-4"
                                    />
                                    <div>
                                        <p className="text-sm font-medium text-[#18181B]">Pay with Card</p>
                                        <p className="text-xs text-[#71717A]">Secure payment via Stripe</p>
                                    </div>
                                </label>
                                {/* <label className={`flex items-center gap-3 border rounded-md p-3 cursor-pointer transition-colors ${
                                    paymentMethod === "cod" ? "border-[#18181B] bg-[#FAFAF9]" : "border-[#E4E4E7]"
                                }`}>
                                    <input 
                                        type="radio" 
                                        checked={paymentMethod === "cod"} 
                                        onChange={() => setPaymentMethod("cod")}
                                        className="w-4 h-4"
                                    />
                                    <div>
                                        <p className="text-sm font-medium text-[#18181B]">Cash on Delivery</p>
                                        <p className="text-xs text-[#71717A]">Pay when your order arrives</p>
                                    </div>
                                </label> */}
                            </div>
                        </div>
                    </div>

                    {/* Right — Order Summary */}
                    <div className="bg-white border border-[#E4E4E7] rounded-lg p-5 h-fit sticky top-20">
                        <h2 className="text-lg font-medium text-[#18181B] mb-4">Order Summary</h2>

                        <div className="space-y-3 max-h-64 overflow-y-auto mb-4">
                            {items.map((item) => (
                                <div key={item.id} className="flex gap-3">
                                    <img src={item.product.images[0] || "/placeholder.jpg"} className="w-12 h-12 rounded-md object-cover" />
                                    <div className="flex-1">
                                        <p className="text-sm text-[#18181B] line-clamp-1">{item.product.name}</p>
                                        <p className="text-xs text-[#71717A]">Qty: {item.quantity}</p>
                                    </div>
                                    <span className="text-sm text-[#18181B]">Rs. {item.product.price * item.quantity}</span>
                                </div>
                            ))}
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
                            type="submit"
                            disabled={placing}
                            className="w-full bg-[#C6A969] hover:bg-[#B89958] text-white mt-5"
                        >
                            {placing ? "Placing Order..." : "Place Order"}
                        </Button>
                    </div>
                </div>
            </form>
        </main>
    )
}

export default Checkout
import { useEffect, useState } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { Star, Minus, Plus, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getProduct } from "@/api/product"
import { getProductReviews } from "@/api/reviews"
import { addToCart } from "@/api/cart"
import type { Product, Review } from "@/types"
import { useAuthStore } from "@/store/authStore"
import { toast } from "sonner"

export default function ProductDetail() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { isAuthenticated } = useAuthStore()

    const [product, setProduct] = useState<Product | null>(null)
    const [reviews, setReviews] = useState<Review[]>([])
    const [loading, setLoading] = useState(true)
    const [activeImage, setActiveImage] = useState(0)
    const [selectedSize, setSelectedSize] = useState("")
    const [selectedColor, setSelectedColor] = useState("")
    const [quantity, setQuantity] = useState(1)
    const [activeTab, setActiveTab] = useState<"description" | "reviews">("description")
    const [addingToCart, setAddingToCart] = useState(false)

    useEffect(() => {
        if (!id) return
        const fetchData = async () => {
            setLoading(true)
            try {
                const [prod, revs] = await Promise.all([
                    getProduct(Number(id)),
                    getProductReviews(Number(id))
                ])
                setProduct(prod)
                setReviews(revs)
                if (prod.sizes.length) setSelectedSize(prod.sizes[0])
                if (prod.colors.length) setSelectedColor(prod.colors[0])
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [id])

    const avgRating = reviews.length 
        ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
        : null

    const handleAddToCart = async () => {
        if (!isAuthenticated) {
            navigate("/login")
            return
        }
        if (!product) return

        setAddingToCart(true)
        try {
            await addToCart(product.id, quantity, selectedSize || undefined, selectedColor || undefined)
            toast.success("Products Added To Cart Successfully")
        } catch (err: any) {
            toast.error(err.message)
        } finally {
            setAddingToCart(false)
        }
    }

    const handleBuyNow = async () => {
        if (!isAuthenticated) {
            navigate("/login")
            return
        }
        await handleAddToCart()
        navigate("/cart")
    }

    if (loading) {
        return <div className="max-w-7xl mx-auto px-4 py-20 text-center text-[#71717A]">Loading...</div>
    }

    if (!product) {
        return <div className="max-w-7xl mx-auto px-4 py-20 text-center text-[#71717A]">Product not found</div>
    }

    return (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Breadcrumb */}
            <div className="text-sm text-[#71717A] mb-6">
                <Link to="/" className="hover:text-[#18181B]">Home</Link>
                {" / "}
                <Link to="/products" className="hover:text-[#18181B]">Products</Link>
                {" / "}
                <span className="text-[#18181B]">{product.name}</span>
            </div>

            <div className="grid md:grid-cols-2 gap-10">
                {/* Image Gallery */}
                <div>
                    <div className="aspect-square rounded-lg overflow-hidden bg-[#FAFAF9] mb-3">
                        <img 
                            src={product.images[activeImage] || "/placeholder.jpg"}
                            alt={product.name}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    {product.images.length > 1 && (
                        <div className="flex gap-2">
                            {product.images.map((img, i) => (
                                <button
                                    key={i}
                                    onClick={() => setActiveImage(i)}
                                    className={`w-16 h-16 rounded-md overflow-hidden border-2 ${
                                        activeImage === i ? "border-[#18181B]" : "border-[#E4E4E7]"
                                    }`}
                                >
                                    <img src={img} className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Product Info */}
                <div>
                    <h1 className="text-2xl font-semibold text-[#18181B] mb-2" style={{ fontFamily: "Playfair Display, serif" }}>
                        {product.name}
                    </h1>

                    {avgRating && (
                        <div className="flex items-center gap-2 mb-3">
                            <div className="flex items-center gap-0.5">
                                {[...Array(5)].map((_, i) => (
                                    <Star 
                                        key={i} 
                                        size={14} 
                                        className={i < Math.round(Number(avgRating)) ? "fill-[#C6A969] text-[#C6A969]" : "text-[#E4E4E7]"} 
                                    />
                                ))}
                            </div>
                            <span className="text-sm text-[#71717A]">{avgRating} ({reviews.length} reviews)</span>
                        </div>
                    )}

                    <div className="flex items-center gap-3 mb-6">
                        <span className="text-2xl font-semibold text-[#18181B]">Rs. {product.price}</span>
                        {product.original_price && (
                            <span className="text-[#71717A] line-through">Rs. {product.original_price}</span>
                        )}
                    </div>

                    {/* Color */}
                    {product.colors.length > 0 && (
                        <div className="mb-5">
                            <p className="text-sm font-medium text-[#18181B] mb-2">Color</p>
                            <div className="flex gap-2">
                                {product.colors.map((color) => (
                                    <button
                                        key={color}
                                        onClick={() => setSelectedColor(color)}
                                        className={`px-4 py-2 text-sm rounded-md border transition-colors ${
                                            selectedColor === color 
                                                ? "border-[#18181B] bg-[#18181B] text-white" 
                                                : "border-[#E4E4E7] text-[#52525B]"
                                        }`}
                                    >
                                        {color}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Size */}
                    {product.sizes.length > 0 && (
                        <div className="mb-5">
                            <p className="text-sm font-medium text-[#18181B] mb-2">Size</p>
                            <div className="flex gap-2">
                                {product.sizes.map((size) => (
                                    <button
                                        key={size}
                                        onClick={() => setSelectedSize(size)}
                                        className={`w-10 h-10 text-sm rounded-md border transition-colors ${
                                            selectedSize === size 
                                                ? "border-[#18181B] bg-[#18181B] text-white" 
                                                : "border-[#E4E4E7] text-[#52525B]"
                                        }`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Quantity */}
                    <div className="mb-6">
                        <p className="text-sm font-medium text-[#18181B] mb-2">Quantity</p>
                        <div className="flex items-center gap-3 border border-[#E4E4E7] rounded-md w-fit">
                            <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-2.5 text-[#52525B]">
                                <Minus size={14} />
                            </button>
                            <span className="text-sm font-medium w-8 text-center">{quantity}</span>
                            <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} className="p-2.5 text-[#52525B]">
                                <Plus size={14} />
                            </button>
                        </div>
                        {product.stock <= 5 && product.stock > 0 && (
                            <p className="text-xs text-[#DC2626] mt-1">Only {product.stock} left in stock</p>
                        )}
                        {product.stock === 0 && (
                            <p className="text-xs text-[#DC2626] mt-1">Out of stock</p>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 mb-8">
                        <Button 
                            onClick={handleAddToCart}
                            disabled={product.stock === 0 || addingToCart}
                            variant="outline"
                            className="flex-1 border-[#18181B] text-[#18181B] hover:bg-[#18181B] hover:text-white"
                        >
                            <ShoppingBag size={16} className="mr-2" />
                            {addingToCart ? "Adding..." : "Add to Cart"}
                        </Button>
                        <Button 
                            onClick={handleBuyNow}
                            disabled={product.stock === 0}
                            className="flex-1 bg-[#C6A969] hover:bg-[#B89958] text-white"
                        >
                            Buy Now
                        </Button>
                    </div>

                    {/* Tabs */}
                    <div className="border-t border-[#E4E4E7] pt-5">
                        <div className="flex gap-6 mb-4">
                            <button 
                                onClick={() => setActiveTab("description")}
                                className={`text-sm font-medium pb-2 border-b-2 transition-colors ${
                                    activeTab === "description" ? "border-[#18181B] text-[#18181B]" : "border-transparent text-[#71717A]"
                                }`}
                            >
                                Description
                            </button>
                            <button 
                                onClick={() => setActiveTab("reviews")}
                                className={`text-sm font-medium pb-2 border-b-2 transition-colors ${
                                    activeTab === "reviews" ? "border-[#18181B] text-[#18181B]" : "border-transparent text-[#71717A]"
                                }`}
                            >
                                Reviews ({reviews.length})
                            </button>
                        </div>

                        {activeTab === "description" ? (
                            <p className="text-sm text-[#52525B] leading-relaxed">
                                {product.description || "No description available."}
                            </p>
                        ) : (
                            <div className="space-y-4">
                                {reviews.length === 0 ? (
                                    <p className="text-sm text-[#71717A]">No reviews yet.</p>
                                ) : (
                                    reviews.map((review) => (
                                        <div key={review.id} className="border-b border-[#E4E4E7] pb-4 last:border-0">
                                            <div className="flex items-center gap-1 mb-1">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} size={12} className={i < review.rating ? "fill-[#C6A969] text-[#C6A969]" : "text-[#E4E4E7]"} />
                                                ))}
                                            </div>
                                            {review.comment && (
                                                <p className="text-sm text-[#52525B]">{review.comment}</p>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    )
}
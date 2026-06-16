// Initialize all the values
export interface User {
    id: number
    name: string
    email: string
    is_admin: boolean
    created_at: string
}

export interface Category {
    id: number
    name: string
    slug: string
    image: string | null
}

export interface Product {
    id: number
    name: string
    description: string | null
    price: number
    original_price: number | null
    category_id: number | null
    sizes: string[]
    colors: string[]
    images: string[]
    stock: number
    is_featured: boolean
    created_at: string
}

export interface CartItem {
    id: number
    user_id: number
    product_id: number
    quantity: number
    size: string | null
    color: string | null
}

export interface Order {
    id: number
    user_id: number
    total: number
    status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
    address: Address
    stripe_payment_id: string | null
    created_at: string
}

export interface Address {
    street: string
    city: string
    state: string
    zip_code: string
    country: string
}

export interface Review {
    id: number
    user_id: number
    product_id: number
    rating: number
    comment: string | null
    created_at: string
}

export interface Notification {
    id: number
    title: string
    message: string
    type: string | null
    is_read: boolean
    created_at: string
}
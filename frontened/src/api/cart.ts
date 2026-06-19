import api from "./axios"
import type { CartItem } from "@/types"

export const addToCart = async (productId: number, quantity: number, size?: string, color?: string): Promise<CartItem> => {
    const { data } = await api.post("/cart/", { product_id: productId, quantity, size, color })
    return data
}
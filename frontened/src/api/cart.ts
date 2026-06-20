import api from "./axios"
import type { CartItem, Product } from "@/types"

interface cartwithItem extends CartItem{
    product? : Product
}

export const addToCart = async (productId: number, quantity: number, size?: string, color?: string): Promise<CartItem> => {
    const { data } = await api.post("/cart/", { product_id: productId, quantity, size, Color: color })
    return data
}

export const getCart = async () :Promise<CartItem> => {
    const { data } = await api.get("/cart/")

    return data
}

export const updateCartItem = async (productId : number, quantity : number): Promise<CartItem> => {
    const { data } = await api.put(`/cart/${productId}`, {quantity})

    return data
}

export const deleteCart = async (productId : number) : Promise<void> =>{
    await api.delete(`/cart/${productId}`)
}
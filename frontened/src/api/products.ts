import api from "./axios"
import type { Product,Category } from "@/types"


export const getFeaturedProducts = async() : Promise<Product[]> => {
    const {data} = await api.get("/products/?featured=true")

    return data
}

export const getCategoryProducts = async() : Promise<Category[]> => {
    const {data} = await api.get("/categories/")

    return data
}
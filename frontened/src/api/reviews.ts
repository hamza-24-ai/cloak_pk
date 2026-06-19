import api from "@/api/axios"
import type {Review} from "@/types/index"

export const getProductReviews = async (productId : number) : Promise<Review[]> => {
    const {data} = await api.get(`/reviews/product/${productId}`)

    return data
}
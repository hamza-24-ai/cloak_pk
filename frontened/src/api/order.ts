import api from "@/api/axios"
import type {Order} from "@/types/index"

interface AddressOrder {
    street : string
    city :string
    state : string
    zip_code : string
    country : string
}


export const placeOrder = async (address : AddressOrder, couponCode? : string) : Promise<Order> => {
    const {data} = await api.post("/orders/", {address, coupon_code : couponCode})

    return data
}

export const createPayment = async(orderId : number) : Promise<{payment_url : string}> => {
    const { data } = await api.post(`/orders/${orderId}/payment`)

    return data
}

export const getOrders = async() : Promise<Order[]> => {
    const { data } = await api.get("/orders/")

    return data
}

export const getOrder = async(orderId : number) : Promise<Order[]> => {
    const {data} = await api.get(`/orders/${orderId}`)

    return data
}

export const confirmPayment = async (orderId: number): Promise<{ message: string; status: string }> => {
    const { data } = await api.post(`/orders/${orderId}/confirm-payment`)
    return data
}
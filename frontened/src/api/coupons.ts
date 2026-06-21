import api from "@/api/axios"


interface VerifyCoupons {
    valid : boolean
    discount_percent : number
    discount_amount : number
    total : number
}

export const VerifyCoupon = async (code : string, total : number) : Promise<VerifyCoupons> => {
    const {data} = await api.post("/coupons/verify",{code,total})

    return data
}

export const getAllCoupons = async (): Promise<any[]> => {
    const { data } = await api.get("/coupons/")
    return data
}

export const createCouponAdmin = async (payload: {
    code: string
    discount_percent: number
    max_uses: number
}): Promise<any> => {
    const { data } = await api.post("/coupons/", payload)
    return data
}

export const deleteCoupon = async (id: number): Promise<void> => {
    await api.delete(`/coupons/${id}`)
}
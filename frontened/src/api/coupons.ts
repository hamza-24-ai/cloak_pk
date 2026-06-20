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
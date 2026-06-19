import api from "@/api/axios"
import type {Product} from "@/types/index"

interface Productfiltern{
    category_id? : number
    featured? : boolean
    search? : string
    min_price? : number
    max_price? : number
}


export const getProducts = async(filter? : Productfiltern) : Promise<Product[]> => {
    const {data} = await api.get("/products/",{params : filter})

    return data 
}

export const getProduct = async(id : number) : Promise<Product> => {
    const {data} = await api.get(`/products/${id}`)

    return data 
}

export const getFeaturedProducts = async() : Promise<Product[]> => {
    const {data} = await api.get("/products/", {params : {featured : true}})

    return data
}

export const createProduct = async (formdata : FormData) : Promise<Product[]> => {
    const {data} = await api.post("/products/", formdata, {
        headers: {"Content-Type" : "multipart/form-data"}
    })

    return data 
}

export const updateProduct = async (id : number, payload : Partial<Product[]>) : Promise<Product[]> => {
    const {data} = await api.put(`/products/${id}`, payload)

    return data
}

export const deleteProduct = async(id : number) : Promise<void> => {
    await api.delete(`/products/${id}`)
}
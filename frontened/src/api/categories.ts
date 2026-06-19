import type {Category} from "@/types/index"
import api from "@/api/axios"

export const getCategories = async() : Promise<Category[]> => {
    const {data} = await api.get("/categories/")

    return data
}

export const createCategories = async(name : string, slug : string, image? : string) : Promise<Category[]> => {
    const {data} = await api.post("/categories/",{name,slug,image})

    return data
}

export const deleteCategories = async(id : number) : Promise<void> => {
    await api.delete(`/categories/${id}`)

}
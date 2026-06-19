import api from "@/api/axios"
import type {User} from "@/types/index"

interface Authrefer {
    access_token : string
    token_type : string
    user : User
}

export const getregister = async(name : string, email : string, password : string) : Promise<Authrefer> => {
    const {data} = await api.post("/auth/register", {name,email,password})
    return data
}

export const login = async(email : string, password : string) : Promise<Authrefer> => {
    const {data} = await api.post("/auth/login", {email,password})

    return data
}
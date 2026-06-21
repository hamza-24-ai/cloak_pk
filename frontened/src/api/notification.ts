import api from "./axios"
import type { Notification } from "@/types"

export const getNotifications = async (): Promise<Notification[]> => {
    const { data } = await api.get("/notifications/")
    return data
}

export const markAsRead = async (id: number): Promise<void> => {
    await api.put(`/notifications/${id}/read`)
}

export const markAllAsRead = async (): Promise<void> => {
    await api.put("/notifications/read-all")
}
import api from "./axios"
import type { Order } from "@/types"

export interface DashboardStats {
    total_revenue: number
    total_orders: number
    total_products: number
    total_users: number
}

export interface RevenuePoint {
    date: string
    revenue: number
}

export const getDashboardStats = async (): Promise<DashboardStats> => {
    const { data } = await api.get("/orders/admin/stats")
    return data
}

export const getRevenueChart = async (): Promise<RevenuePoint[]> => {
    const { data } = await api.get("/orders/admin/revenue-chart")
    return data
}

export const getRecentOrders = async (): Promise<Order[]> => {
    const { data } = await api.get("/orders/admin/recent")
    return data
}

export const getAllOrders = async (): Promise<Order[]> => {
    const { data } = await api.get("/orders/admin/all")
    return data
}

export const updateOrderStatus = async (orderId: number, status: string): Promise<{ message: string }> => {
    const { data } = await api.put(`/orders/admin/${orderId}/status`, null, {
        params: { status }
    })
    return data
}
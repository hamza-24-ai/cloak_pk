import { useEffect, useState } from "react"
import { Bell, CheckCheck } from "lucide-react"
import { getNotifications, markAsRead, markAllAsRead } from "@/api/notification"
import type { Notification } from "@/types"

export default function Notifications() {
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [loading, setLoading] = useState(true)

    const fetchData = async () => {
        try {
            const data = await getNotifications()
            setNotifications(data)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    const handleMarkRead = async (id: number) => {
        try {
            await markAsRead(id)
            setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, is_read: true } : n))
        } catch (err) {
            console.error(err)
        }
    }

    const handleMarkAllRead = async () => {
        try {
            await markAllAsRead()
            setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })))
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-semibold text-[#18181B]" style={{ fontFamily: "Playfair Display, serif" }}>
                    Notifications
                </h1>
                {notifications.some((n) => !n.is_read) && (
                    <button onClick={handleMarkAllRead} className="flex items-center gap-1 text-sm text-[#C6A969] hover:underline">
                        <CheckCheck size={16} />
                        Mark all read
                    </button>
                )}
            </div>

            {loading ? (
                <p className="text-center text-[#71717A] py-10">Loading...</p>
            ) : notifications.length === 0 ? (
                <div className="text-center py-20">
                    <Bell size={48} className="mx-auto text-[#E4E4E7] mb-4" />
                    <p className="text-[#71717A]">No notifications yet</p>
                </div>
            ) : (
                <div className="space-y-2">
                    {notifications.map((n) => (
                        <div
                            key={n.id}
                            onClick={() => !n.is_read && handleMarkRead(n.id)}
                            className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                                n.is_read ? "bg-white border-[#E4E4E7]" : "bg-[#FAFAF9] border-[#C6A969]"
                            }`}
                        >
                            <div className="flex items-start gap-3">
                                {!n.is_read && <span className="w-2 h-2 bg-[#C6A969] rounded-full mt-1.5 shrink-0" />}
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-[#18181B]">{n.title}</p>
                                    <p className="text-sm text-[#52525B] mt-0.5">{n.message}</p>
                                    <p className="text-xs text-[#71717A] mt-1">
                                        {new Date(n.created_at).toLocaleDateString("en-PK", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </main>
    )
}
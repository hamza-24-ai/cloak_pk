import { Outlet } from "react-router-dom"
import AdminSidebar from "./AdminSidebar"
import { useState } from "react"
import {X,Menu}  from "lucide-react"
import {Button} from "@/components/ui/button"
export default function AdminLayout() {
    const [mobile,setMobile] = useState(false)
    return (
        <div className="flex min-h-screen bg-[#FAFAF9]">

            <div className="hidden md:flex">
                <AdminSidebar />
            </div>

            <Button
                className="md:hidden fixed top-2 right-2 z-50"
                onClick={() => setMobile(!mobile)}
            >
                {mobile ? <X size={22} /> : <Menu size={22} />}
            </Button>

    {mobile && (
        <>
            <div
                className="fixed inset-0 bg-black/50 z-40"
                onClick={() => setMobile(false)}
            />

            <div className="fixed left-0 top-0 h-full z-50 transition-all duration-300 ease-linear">
                <AdminSidebar />
            </div>
        </>
    )}

    <main className="flex-1 md:ml-64 p-8">
        <Outlet />
    </main>

</div>
    )
}
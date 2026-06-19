import type{Category} from "@/types/index"
import { useState, useEffect } from "react"
import { toast } from "sonner"
import { getCategories,createCategories,deleteCategories } from "@/api/categories"
import { Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
const AdminCategories = () => {

    const formatError = (err: any) => {
        const detail = err?.response?.data?.detail
        if (Array.isArray(detail)) {
            return detail.map((d: any) => d?.msg || d?.message || JSON.stringify(d)).join(", ")
        }
        if (typeof detail === "string") return detail
        return err?.message || "Something went wrong"
    }
    const [categories,setCategories] = useState<Category[]>([])
    const [loading,setLoading] = useState<boolean>(true)
    const [showform,setShowform] = useState<boolean>(false)
    const [name,setName] = useState("")
    const [submitting,setSubmitting] = useState<boolean>(false)

    const fetchcategories = async() =>{
        try {
            const data = await getCategories()
            setCategories(data)
        }catch(err : any){
            toast.error(formatError(err))
        }finally{
            setLoading(!loading)
        }
    }

    useEffect(()=>{
        fetchcategories()
    }, [])

    const handleSubmit = async(e : React.FormEvent) => {
        e.preventDefault()
        setLoading(!loading)
        if(!name.trim()) return

        try{
            const slug = name.toLowerCase().trim().replace(/\s+/g, "-")
            await createCategories(name,slug)
            setShowform(false)
            setName("")
            fetchcategories()
        }catch(err : any){
            toast.error(formatError(err) || "Category is not created")
        }finally{
            setSubmitting(false)
        }
    }

    const handleDelete = async (id : number) => {
        try{
            await deleteCategories(id)
            toast.success("Category delete Successfully")
        }catch(err : any){
            toast.error(formatError(err) || "Catgeory cannot be deleted")
        }
    }

  return (
    <div>
        <div className="flex flex-col items-center justify-center mb-6">
            <h1 className="text-3xl font-serif font-semibold text-[#19182B] mb-3">
                Categories
            </h1>
            <Button
                onClick={() => setShowform(!showform)}
                className="bg-[#18181B] hover:bg-[#09090B] text-white cursor-pointer"
            >
                <Plus size={16} className="mr-1" />
                Add Category
            </Button>
        </div>

        {
            showform && (
                <form onSubmit={handleSubmit} className="mt-3 flex flex-col justify-center items-center">
                    <Input
                        placeholder="Category name eg..Men"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="border-[#C6A969] mb-2"
                     />
                    
                    <Button
                        type="submit"
                        disabled={submitting}
                        className="bg-[#C6A969] hover:bg-[#B89958] text-white shrink-0 px-10 mb-3 cursor-pointer text-center"
                    >
                        {submitting ? "Adding...." : "Save"}
                    </Button>
                </form>
            )
        }

        <div className="bg-white border border-[#E4E4E7] rounded-lg overflow-hidden">
            {loading ? (
                <p className="p-6 text-[#71717A] text-center">
                    Loading.... 
                </p>
            ) : categories.length === 0 ? (
                <p className="p-6 text-[#71717A] text-center">
                    No Categories Yet, Add One!
                </p>
            ) : (
                <table className="w-full">
                    <thead className="bg-[#FAFAF9] border-b border-[#E4E4E7]">
                        <tr>
                            <th className="p-6 text-sm text-left font-semibold text-[#71717A] uppercase">
                                Name
                            </th>
                            <th className="p-6 text-sm text-left uppercase font-semibold text-[#71717A]">
                                Slug
                            </th>
                            <th className="p-6 text-sm text-left uppercase font-semibold text-[#71717A]">
                                Action
                            </th>
                        </tr>

                    </thead>

                    <tbody>
                        {categories.map((category) => (
                            <tr key={category.id} className="border-b border-[#E4E4E7]">
                                <td className="p-6 text-[#71717A]">{category.name}</td>
                                <td className="p-6 text-[#71717A]">{category.slug}</td>
                                <td className="p-6 text-[#71717A]">
                                    <Button
                                        onClick={() => handleDelete(category.id)}
                                        className="text-[#DC2626] hover:bg-red-50 p-1.5 rounded-md cursor-pointer"
                                    >
                                        <Trash2 size={16} className="mr-1" />
                                        Delete
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    </div>
  )
}

export default AdminCategories
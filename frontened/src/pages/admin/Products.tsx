import { useEffect, useState } from "react"
import { toast } from "sonner"
import { getProducts,deleteProduct,updateProduct,createProduct } from "@/api/product"
import {Plus,Trash2,Pencil,X,Upload} from "lucide-react"
import {getCategories} from "@/api/categories"
import type {Product,Category} from "@/types/index"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"


const AdminProducts = () => {

  const [product,setProduct] = useState<Product[]>([])
  const [categories,setCategories] = useState<Category[]>([])
  const [loading,setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)


  // Form fields
  const [name,setName] = useState("")
  const [description,setDescription] = useState("")
  const [categoryId,setCategoryId] = useState("")
  const [sizes,setSizes] = useState("")
  const [colors, setColors] = useState("")
  const [stock, setStock] = useState("")
  const [isFeatured, setIsFeatured] = useState(false)
  const [images, setImages] = useState<FileList | null>(null)
  const [previews, setPreviews] = useState<string[]>([])
  const [price, setPrice] = useState("")
  const [originalprice, setOriginalprice] = useState("")

  const fetchdata = async() => {
    try{
      const [prod,cats] = await Promise.all([getProducts(),getCategories()])

      setCategories(cats)
      setProduct(prod)

    }catch(err : any){
      toast.error(err.message)
    }finally{
      setLoading(false)
    }
  }

  useEffect(()=>{
    fetchdata()
  },[])


  const handleImage = async(e : React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    setImages(files)
    if (files) {
      const urls = Array.from(files).map((f) => URL.createObjectURL(f))
      setPreviews(urls)
    }
  }

  const resetForm = () => {
    setName("");
    setDescription("");
    setPreviews([]);
    setPrice("")
    setOriginalprice("")
    setCategoryId("")
    setSizes("")
    setColors("")
    setStock("")
    setIsFeatured(false)
    setImages(null)
    setShowForm(false)
  }

  const handleSubmit = async (e : React.FormEvent) =>{
    e.preventDefault()

    if (!name || !price){
      toast.error("Name and Price are Required")
      return
    }

    setSubmitting(true)

    try{
      const formData = new FormData()
      formData.append("name" , name)
      formData.append("description" , description)
      formData.append("price", price)
      if(originalprice) formData.append("original_price", originalprice)
      if(categoryId) formData.append("Category_id", categoryId)
      formData.append("sizes",sizes)
      formData.append("colors",colors)
      formData.append("stock",stock)
      formData.append("is_featured", String(isFeatured))

      if (images) {
        Array.from(images).forEach((files) => {
          formData.append("images", files)
        })
      }

      await createProduct(formData)
      toast.success("New Data Uploaded Successfully")

      resetForm()
      fetchdata()
    }catch( err : any){
      toast.error(err.message)
    }finally{
      setSubmitting(false)
    }

  }

  const handleDelete = async(id : number) =>{
    try{
      await deleteProduct(id)
      toast.success("Data Delete Successfully")
      fetchdata()
    }catch(err : any){
      toast.error(err.message)
    }
  }


  return (
    <div>
      <div className="flex flex-col items-center justify-between mb-6">
        <h1 className="text-3xl font-semibold font-serif text-[#18181B]">
          Products
        </h1>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="bg-[#434346] hover:bg-[#09090B] text-white cursor-pointer mt-3"
        >
          {showForm ? <X size={22} className="mr-2"/> : <Plus size={22} className="mr-2"/>}
          {showForm ? "Close" : "Add Product"}
        </Button>
      </div>

      {/* Show Form data */}
      {
        showForm && (
          <form onSubmit={handleSubmit}
            className="bg-white border border-[#E4E4E7] rounded-lg p-6 mb-6 space-y-4"
          >
            <div
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <div>
                <label className="block text-md font-medium text-[#18181B] mb-1.5">
                  Product Name <span className="text-red-600">*</span>
                </label>
                <Input className="border-[#E4E4E7]" onChange={(e) => setName(e.target.value)} value={name} placeholder="Casual T-shirt"/>
              </div>

              <div>
                <label className="block text-md font-medium text-[#1B1B18] mb-1.5">
                  Category
                </label>
                <select 
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full border border-[#E4E4E7] rounded-md px-3 py-2 text-md focus:outline-none focus:border-[#18181B]"
                >
                  <option value="">
                    Select Category
                  </option>
                  {
                    categories.map((cats) => (
                      <option value={cats.id} key={cats.id}>
                        {cats.name}
                      </option>
                    ))
                  }
                </select>
              </div>

            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-[#18181B] mb-1.5">
                Description
              </label>
              <textarea
                onChange={(e) => setDescription(e.target.value)}
                value={description}
                placeholder="Premium Cotton t-shirt...."
                rows={4}
                className="w-full border border-[#E4E4E7] focus:outline-none focus:border-[#18181B] px-3 py-2 rounded-md"
               />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-md font-medium text-[#18181B] mb-1.5">Price Rs. <span className="text-red-600">*</span></label>
                <Input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="1500 Rs" className="border-[#E4E4E7]" />
              </div>
              <div>
                  <label className="block text-md font-medium text-[#18181B] mb-1.5">Original Price</label>
                  <Input type="number" value={originalprice} onChange={(e) => setOriginalprice(e.target.value)} placeholder="2000" className="border-[#E4E4E7]" />
              </div>
              <div>
                  <label className="block text-md font-medium text-[#18181B] mb-1.5">Stock</label>
                  <Input type="number" value={stock} onChange={(e) => setStock(e.target.value)} placeholder="50" className="border-[#E4E4E7]" />
              </div>
            </div>

            {/* set colors and sizes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-md font-medium text-[#18181B] mb-1.5">Sizes (comma separated)</label>
                    <Input value={sizes} onChange={(e) => setSizes(e.target.value)} placeholder="S,M,L,XL" className="border-[#E4E4E7]" />
                </div>
                <div>
                    <label className="block text-md font-medium text-[#18181B] mb-1.5">Colors (comma separated)</label>
                    <Input value={colors} onChange={(e) => setColors(e.target.value)} placeholder="Red,Blue,Black" className="border-[#E4E4E7]" />
                </div>
            </div>

            {/* Set Featured data */}
            <div className="flex items-center gap-2">
                <input 
                    type="checkbox" 
                    id="featured"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="w-4 h-4"
                />
                <label htmlFor="featured" className="text-sm font-medium text-[#18181B]">
                    Mark as Featured
                </label>
            </div>

            {/* Upload Image section */}

            <div>
              <label className="block text-lg font-medium text-[#18181B] mb-2"> 
                Images
              </label>
              <label className="flex items-center justify-center gap-2 border-2 border-dashed border-[#E4E4E7] rounded-lg p-6 cursor-pointer hover:border-[#C6A969] transition-colors">
                <Upload size={20} className="text-[#71717A]" />
                <span className="text-md text-[#71717A]">Click to Upload Image</span>
                <input type="file" multiple accept="images/*" onChange={handleImage} className="hidden"/>

              </label>

                {
                  previews.length > 0 && (
                    <div className="flex gap-2 mt-3">
                      {
                        previews.map((url,i)=> (
                          <img src={url} key={i} className="w-16 h-16 object-cover rounded-md border border-[#E4E4E7]" />
                        ))
                      }
                    </div>
                  )
                }
            </div>
            {/* Submit button */}
            <Button type="submit" disabled={submitting} className="bg-[#C6A969]  hover:bg-[#B89958] text-white" >
              {submitting ? "Creating...." : "Create Product"}
            </Button>
          </form>
        )
      }

      {/* Product Table */}
      <div className="bg-white border border-[#E4E4E7] rounded-lg overflow-hidden">
                {loading ? (
                    <p className="p-6 text-[#71717A] text-center">Loading...</p>
                ) : product.length === 0 ? (
                    <p className="p-6 text-[#71717A] text-center">No products yet. Add one!</p>
                ) : (
                    <table className="w-full">
                        <thead className="bg-[#FAFAF9] border-b border-[#E4E4E7]">
                            <tr>
                                <th className="text-left text-xs font-medium text-[#71717A] uppercase px-4 py-3">Image</th>
                                <th className="text-left text-xs font-medium text-[#71717A] uppercase px-4 py-3">Name</th>
                                <th className="text-left text-xs font-medium text-[#71717A] uppercase px-4 py-3">Price</th>
                                <th className="text-left text-xs font-medium text-[#71717A] uppercase px-4 py-3">Stock</th>
                                <th className="text-right text-xs font-medium text-[#71717A] uppercase px-4 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {product.map((p) => (
                                <tr key={p.id} className="border-b border-[#E4E4E7] last:border-0">
                                    <td className="px-4 py-3">
                                        <img 
                                            src={p.images[0] || "/placeholder.jpg"} 
                                            className="w-12 h-12 object-cover rounded-md"
                                        />
                                    </td>
                                    <td className="px-4 py-3 text-sm text-[#18181B] font-medium">{p.name}</td>
                                    <td className="px-4 py-3 text-sm text-[#18181B]">Rs. {p.price}</td>
                                    <td className="px-4 py-3 text-sm text-[#71717A]">{p.stock}</td>
                                    <td className="px-4 py-3 text-right">
                                        <button onClick={() => handleDelete(p.id)} className="text-[#DC2626] hover:bg-red-50 p-1.5 rounded-md">
                                            <Trash2 size={16} />
                                        </button>
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



export default AdminProducts
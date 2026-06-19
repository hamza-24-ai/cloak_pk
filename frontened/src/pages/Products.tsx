import {useSearchParams,Link} from "react-router-dom" 
import {SlidersHorizontal} from "lucide-react"
import {getProducts} from "@/api/product"
import {getCategories} from "@/api/categories"
import type {Product,Category} from "@/types/index"
import { useEffect, useState } from "react"
import { toast } from "sonner"

const Products = () => {
  const[searchParams,setSearchParams] = useSearchParams() // work with URL
  const[product,setProduct] = useState<Product[]>([])
  const[category,setCategory] = useState<Category[]>([])
  const[loading, setLoading] = useState(false)
  const[showFilter, setShowFilter] = useState(false)


  // URL Initializer things
  const search = searchParams.get("search") || ""
  const categoryslug = searchParams.get("category") || ""
  const featured = searchParams.get("featured") || ""
  const sort = searchParams.get("sort") || "newest"

  // Initializer filter for min and max values
  const[minprice, setMinprice] = useState("")
  const[maxprice, setMaxprice] = useState("")


  useEffect(()=> {
    getCategories().then(setCategory)
  },[])

  useEffect(()=> {

    if (category.length === 0) return
    const fetchproducts = async ()=> {
      setLoading(true)
      // useEffect ke andar temporarily add karo:
        console.log("URL slug:", categoryslug)
        console.log("All category slugs:", category.map(c => c.slug))
        console.log("Matched:", category.find(c => c.slug === categoryslug))

      try{
        const cate = category.find((c)=>c.slug === categoryslug )
        const data = await getProducts({
          search : search || undefined,
          category_id: cate?.id,
          featured: featured === "true" ? true : undefined,
          min_price : minprice ? Number(minprice) : undefined,
          max_price : maxprice ? Number(maxprice) : undefined
        }) 

          // Sort Client side data according to query
        const sorted = [...data]
        if (sort === "price-low") sorted.sort((a,b) => a.price - b.price)
        if (sort === "price-high") sorted.sort((a,b) => b.price - a.price)
        if (sort === "newest") sorted.sort((a,b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        
        setProduct(sorted)
        toast.success("Form is sorted Successfully")
      }catch(e : any){
        toast.error(e.message)
      }finally{
        setLoading(false)
      }
    }

    fetchproducts()
  },[search,categoryslug,featured,sort,minprice,maxprice,category])

  const updateParams = (key : string, value : string) => {
    const params = new URLSearchParams(searchParams)
    if (value) params.set(key,value)
    else params.delete(key)

    setSearchParams(params)
  }

  const clearFilter = () => {
    setSearchParams({})
    setMinprice("")
    setMaxprice("")
  }

const hasActiveFilters = categoryslug || featured || minprice || maxprice  

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-[#18181B] font-serif" >
          {search ? `Results for ${search}` : categoryslug ? category.find(c => c.slug === categoryslug)?.name || "Products" : "All Products" }
        </h1>

        <button
          onClick={() => setShowFilter(!showFilter)}
          className="lg:hidden flex items-center gap-2 text-md text-[#52525B] border border-[#E4E4E7] px-3 py-1.5 rounded-md"
        >
          <SlidersHorizontal size={16} className="mr-2" />
          Filters
        </button>
      </div>

      <div className="flex gap-8">
        {/* Side Bar Filters */}
        <aside className={`w-64 shrink-0 ${showFilter ? "block" : "hidden"} lg:block`}>
          <div className="bg-white border border-[#E4E4E7] rounded-lg p-5 space-y-6 sticky top-20">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-[#18181B] ">Filters</h3>
              {
                hasActiveFilters && (
                  <button onClick={clearFilter} className="text-md text-[#C6A969] hover:underline">
                    Clear ALL
                  </button>
                )
              }
            </div>

            {/* Category */}
            <div>
              <h4 className="text-md font-medium text-[#18181B] mb-3">
                Category
              </h4>
              <div className="space-y-2">
                {
                  category.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={()=> updateParams("category", categoryslug === cat.slug ? "" : cat.slug)}
                      className={`block text-sm text-left w-full px-2 py-1.5 rounded-md transition-colors ${
                          categoryslug === cat.slug 
                              ? "bg-[#18181B] text-white" 
                              : "text-[#52525B] hover:bg-[#FAFAF9]"
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))
                }
              </div>
            </div>

            {/* Price Range */}
            <div>
              <h4 className="text-md font-medium text-[#18181B] mb-3">Price Range</h4>
              <div className="flex gap-2">
                <input type="number" 
                  placeholder="Min Price"
                  value={minprice}
                  onChange={(e) => setMinprice(e.target.value)}
                  className="w-full border border-[#E4E4E7] rounded-md px-2 py-1.5 text-md focus:outline-none focus:border-[#18181B]"
                />
                <input type="number" 
                  placeholder="Max Price"
                  value={maxprice}
                  onChange={(e) => setMaxprice(e.target.value)}
                  className="w-full border border-[#E4E4E7] rounded-md px-2 py-1.5 text-md focus:outline-none focus:border-[#18181B]"
                />
              </div>
            </div>

            {/* Featured product */}
            <div>
              <label className="flex items-center gap-2 text-md text-[#52525B] cursor-pointer">
                <input type="checkbox"
                  checked={featured === "true"}
                  onChange={(e) => updateParams("featured", e.target.checked ? "true" : "" )}
                 />
                 Featured Only
              </label>
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
                    {/* Top bar */}
                    <div className="flex items-center justify-between mb-5">
                <p className="text-md text-[#71717A]">
                    {loading ? "Loading..." : `${product.length} results`}
                </p>
                <select
                    value={sort}
                    onChange={(e) => updateParams("sort", e.target.value)}
                    className="border border-[#E4E4E7] rounded-md px-3 py-1.5 text-sm focus:outline-none focus:border-[#18181B]"
                >
                    <option value="newest">Newest</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                </select>
            </div>

            {loading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="aspect-square bg-[#F4F4F5] rounded-lg animate-pulse" />
                    ))}
                </div>
            ) : product.length === 0 ? (
                <div className="text-center py-20">
                    <p className="text-[#71717A]">No products found</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {product.map((product) => (
                        <Link key={product.id} to={`/products/${product.id}`} className="group">
                            <div className="relative aspect-square rounded-lg overflow-hidden bg-[#FAFAF9] mb-3">
                                <img 
                                    src={product.images[0] || "/placeholder.jpg"}
                                    alt={product.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                                {product.original_price && (
                                    <span className="absolute top-2 left-2 bg-[#DC2626] text-white text-xs px-2 py-1 rounded-md">
                                        {Math.round(((product.original_price - product.price) / product.original_price) * 100)}% OFF
                                    </span>
                                )}
                            </div>
                            <h3 className="text-sm font-medium text-[#18181B] truncate">{product.name}</h3>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-[#18181B] font-semibold text-sm">Rs. {product.price}</span>
                                {product.original_price && (
                                    <span className="text-[#71717A] text-xs line-through">Rs. {product.original_price}</span>
                                )}
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
      </div>
    </main>
  )
}

export default Products
import { ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import {getCategoryProducts,getFeaturedProducts} from "@/api/products"
import type {Product,Category} from "@/types/index"
import AOS from "aos";
import "aos/dist/aos.css";
import { Link } from "react-router-dom"


export default function Hero() {

  useEffect(()=>{
    AOS.init({
      offset: 200,
      duration: 600,
      easing: 'ease-in-sine',
      delay: 200,
    });
  },[])
  // State initialize to get data 
  const [featured,setFeatured] = useState<Product[]>([])
  const [categories,setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)


  useEffect(()=>{

    const fetchdata = async() => {
      try{
        const [products,cats] = await Promise.all([
          getFeaturedProducts(),
          getCategoryProducts()
        ])
        setCategories(cats)
        setFeatured(products)
      }catch(error){
        console.log("Error occure due to fetching data from Category and prducts", error)
      }finally{
        setLoading(false)
      }
    }
    fetchdata()
  },[])


    return (
      <main>
        <section className="relative h-150 flex items-center justify-center overflow-hidden">
            {/* Background Image — paste your image path here */}
            <img 
                src="https://images.unsplash.com/photo-1613909671501-f9678ffc1d33?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwcnVud2F5JTIwbW9kZWx8ZW58MXx8fHwxNzgxNTQxNzczfDA&ixlib=rb-4.1.0&q=80&w=1080"
                className="absolute inset-0 w-full h-full object-cover"
                alt="CloakPK - Wear Your Story"
            />

            {/* Gradient Overlay */}
            <div 
                className="absolute inset-0"
                style={{
                    background: "linear-gradient(135deg, rgba(24,24,27,0.85) 0%, rgba(198,169,105,0.15) 100%)"
                }}
            />

            {/* Content */}
            <div className="relative z-10 text-center px-4 max-w-3xl">
                <p data-aos="fade-down" className="text-[#C6A969] text-sm font-medium uppercase tracking-[0.2em] mb-4">
                    New Collection 2026
                </p>
                
                <h1 
                    className="text-white text-5xl md:text-6xl font-bold mb-4" data-aos="fade-down"
                    style={{ fontFamily: "Playfair Display, serif" }}
                >
                    Wear Your Story
                </h1>
                
                <p className="text-white/70 text-lg mb-8" data-aos="zoom-in-down" data-aos-duration="1500">
                    Discover premium Pakistani fashion
                </p>

                <Button 
                    size="lg"
                    className="bg-[#C6A969] hover:bg-[#B89958] text-white px-8 py-6 text-base font-medium"
                    data-aos="fade-up" data-aos-duration="1000"
                >
                    Shop Now
                    <ChevronRight size={18} className="ml-1" />
                </Button>
            </div>
        </section >

        <section className="py-16 bg-white">
          <div className="max-w-7xl px-4 sm:px-6 lg:px-8 mx-auto">
            <div className="flex flex-col items-center justify-center mb-12">
              <h1 className="text-4xl mb-4 font-serif" data-aos = "fade-down">
                Shop By Category
              </h1>
              <p className="text-[#71717A]" data-aos="fade-down-left">
                Find your perfect style
              </p>
            </div>
            {/* Print categories */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {
                categories.map((data)=>(
                  <Link 
                    key={data.id}
                    to={`/products?category=${data.slug}`}
                    className="group relative h-64 rounded-lg overflow-hidden"
                  >

                  <img src={data.image || undefined} alt={data.slug}
                  className=" w-full h-full object-cover group-hover:scale-105 transition-all duration-300" 
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                      <span className="text-white text-xl font-semibold">
                          {data.name}
                      </span>
                    </div>
                  </Link>
                ))
              }
            </div>

          </div>

        </section>

        {/*  Featured Products section */}
        <section className="max-w-7xl mx-auto py-16 px-4 bg-white">
          <div className="flex flex-col items-center justify-center mb-12">
            <h2 className="text-4xl mb-4 font-serif" data-aos = "fade-down">
              Featured Products
            </h2>
            <p className="text-[#71717A]" data-aos="fade-down-left">
              Handpicked favorites just for you
            </p>
          </div>

          {
            loading ? (
              <div className="flex items-center justify-center text-3xl font-serif text-[#1A1A1B] m-6">
                Loading.......
              </div>
            ):
            (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {
                  featured.map((data)=> (
                    <Link
                     key={data.id}
                     to={`/products/?${data.id}`}
                     className="group"
                    >
                    <div className="aspect-square rounded-lg overflow-hidden bg-[#FAFAF9] mb-3">
                      <img 
                          src={data.images[0] || ""}
                          alt={data.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      </div>
                      <h3 className="text-sm font-medium text-[#18181B]">
                          {data.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                          <span className="text-[#18181B] font-semibold">
                              Rs. {data.price}
                          </span>
                            {data.original_price && (
                                <span className="text-[#71717A] text-sm line-through">
                                    Rs. {data.original_price}
                                </span>
                            )}
                        </div>
                    </Link>
                  ))
                }
              </div>
            )
          }
        </section>
      </main>
    )
}
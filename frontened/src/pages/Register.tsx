import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getregister } from "@/api/auth"
import { useAuthStore } from "@/store/authStore"
import { toast } from "sonner"

interface RegisterForm {
    name: string
    email: string
    password: string
    confirmPassword: string
}

export default function Register() {
    const navigate = useNavigate()
    const setAuth = useAuthStore((state) => state.setAuth)
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const { register, handleSubmit, watch, formState: { errors } } = useForm<RegisterForm>()
    const password = watch("password")

    const onSubmit = async (formData: RegisterForm) => {
        setLoading(true)
        setError("")
        try {
            const response = await getregister(formData.name, formData.email, formData.password)
            setAuth(response.user, response.access_token)
            navigate("/")
            toast.success("Welcome to CloakPk Store")
        } catch (err: any) {
            toast.error(err.response?.data?.detail || "Registration failed. Try again.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex">
            {/* Left — Brand Image */}
            <div className="hidden lg:flex lg:w-1/2 relative">
                <img 
                    src="https://plus.unsplash.com/premium_photo-1669688174622-0393f5c6baa2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8bWVucyUyMGNsb3RoaW5nfGVufDB8fDB8fHww"
                    className="absolute inset-0 w-full h-full object-cover"
                    alt="CloakPK"
                />
                <div 
                    className="absolute inset-0"
                    style={{
                        background: "linear-gradient(135deg, rgba(24,24,27,0.85) 0%, rgba(198,169,105,0.15) 100%)"
                    }}
                />
                <div className="relative z-10 flex flex-col items-center justify-center w-full px-12 text-center">
                    <h1 
                        className="text-white text-5xl font-bold mb-4"
                        style={{ fontFamily: "Playfair Display, serif" }}
                    >
                        Wear Your Story
                    </h1>
                    <p className="text-white/70 text-lg">
                        Join CloakPK and discover premium fashion
                    </p>
                </div>
            </div>

            {/* Right — Form */}
            <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-[#FAFAF9] py-8">
                <div className="w-full max-w-md">
                    <Link to="/" className="block text-center mb-8">
                        <span className="text-3xl font-bold text-[#18181B]" style={{ fontFamily: "Playfair Display, serif" }}>
                            Cloak<span className="text-[#C6A969]">PK</span>
                        </span>
                    </Link>

                    <div className="bg-white border border-[#E4E4E7] rounded-lg p-8">
                        <h2 className="text-2xl font-semibold text-[#18181B] mb-1">
                            Create an account
                        </h2>
                        <p className="text-[#71717A] text-sm mb-6">
                            Sign up to start shopping
                        </p>

                        {error && (
                            <div className="bg-red-50 border border-red-200 text-[#DC2626] text-sm rounded-md p-3 mb-4">
                                toast.error({error})
                            </div>
                        )}

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-[#18181B] mb-1.5">
                                    Full Name
                                </label>
                                <Input 
                                    placeholder="Muhammad Hamza"
                                    {...register("name", { required: "Name is required" })}
                                    className="border-[#E4E4E7] focus-visible:ring-[#18181B]"
                                />
                                {errors.name && (
                                    <p className="text-[#DC2626] text-xs mt-1">{errors.name.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[#18181B] mb-1.5">
                                    Email
                                </label>
                                <Input 
                                    type="email"
                                    placeholder="you@example.com"
                                    {...register("email", { 
                                        required: "Email is required",
                                        pattern: {
                                            value: /^\S+@\S+$/i,
                                            message: "Invalid email"
                                        }
                                    })}
                                    className="border-[#E4E4E7] focus-visible:ring-[#18181B]"
                                />
                                {errors.email && (
                                    <p className="text-[#DC2626] text-xs mt-1">{errors.email.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[#18181B] mb-1.5">
                                    Password
                                </label>
                                <div className="relative">
                                    <Input 
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        {...register("password", { 
                                            required: "Password is required",
                                            minLength: { value: 6, message: "Min 6 characters" }
                                        })}
                                        className="border-[#E4E4E7] focus-visible:ring-[#18181B] pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#71717A]"
                                    >
                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="text-[#DC2626] text-xs mt-1">{errors.password.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[#18181B] mb-1.5">
                                    Confirm Password
                                </label>
                                <Input 
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    {...register("confirmPassword", { 
                                        required: "Please confirm password",
                                        validate: (value) => value === password || "Passwords don't match"
                                    })}
                                    className="border-[#E4E4E7] focus-visible:ring-[#18181B]"
                                />
                                {errors.confirmPassword && (
                                    <p className="text-[#DC2626] text-xs mt-1">{errors.confirmPassword.message}</p>
                                )}
                            </div>

                            <Button 
                                type="submit"
                                disabled={loading}
                                className="w-full bg-[#18181B] hover:bg-[#09090B] text-white"
                            >
                                {loading ? "Creating account..." : "Create Account"}
                            </Button>
                        </form>

                        <p className="text-center text-sm text-[#71717A] mt-6">
                            Already have an account?{" "}
                            <Link to="/login" className="text-[#C6A969] font-medium hover:underline">
                                Login
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
import { Link } from "react-router-dom"
import {  Mail } from "lucide-react"
import { FaInstagram, FaFacebookF, FaXTwitter, FaLinkedinIn } from "react-icons/fa6";



export default function Footer() {
    return (
        <footer className="bg-[#18181B] text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    
                    {/* Brand */}
                    <div>
                        <h3 className="text-2xl font-bold mb-3" style={{ fontFamily: "Playfair Display, serif" }}>
                            Cloak<span className="text-[#C6A969]">PK</span>
                        </h3>
                        <p className="text-[#71717A] text-sm mb-4">
                            Wear Your Story
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="text-[#71717A] hover:text-[#C6A969] transition-colors">
                                <FaInstagram size={20} />
                            </a>
                            <a href="#" className="text-[#71717A] hover:text-[#C6A969] transition-colors">
                                <FaFacebookF size={20} />
                            </a>
                            <a href="#" className="text-[#71717A] hover:text-[#C6A969] transition-colors">
                                <FaXTwitter size={20} />
                            </a>
                            <a href="https://www.linkedin.com/in/muhammad-hamza-a785a7363/" className="text-[#71717A] hover:text-[#C6A969] transition-colors">
                                <FaLinkedinIn size={20} />
                            </a>
                        </div>
                    </div>

                    {/* Shop Links */}
                    <div>
                        <h4 className="font-semibold mb-4 text-sm uppercase tracking-wide">Shop</h4>
                        <ul className="space-y-2 text-sm text-[#71717A]">
                            <li><Link to="/products?category=men" className="hover:text-white transition-colors">Men</Link></li>
                            <li><Link to="/products?category=women" className="hover:text-white transition-colors">Women</Link></li>
                            <li><Link to="/products?category=kids" className="hover:text-white transition-colors">Kids</Link></li>
                            <li><Link to="/products?featured=true" className="hover:text-white transition-colors">Sale</Link></li>
                        </ul>
                    </div>

                    {/* Help Links */}
                    <div>
                        <h4 className="font-semibold mb-4 text-sm uppercase tracking-wide">Help</h4>
                        <ul className="space-y-2 text-sm text-[#71717A]">
                            <li><a href="#" className="hover:text-white transition-colors">Track Order</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Returns</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Shipping Info</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 className="font-semibold mb-4 text-sm uppercase tracking-wide">Newsletter</h4>
                        <p className="text-[#71717A] text-sm mb-3">
                            Subscribe for exclusive offers
                        </p>
                        <div className="flex">
                            <input 
                                type="email" 
                                placeholder="Email address"
                                className="bg-[#27272A] border border-[#3F3F46] rounded-l-md px-3 py-2 text-sm flex-1 focus:outline-none focus:border-[#C6A969]"
                            />
                            <button className="bg-[#C6A969] hover:bg-[#B89958] px-3 rounded-r-md transition-colors">
                                <Mail size={16} />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="border-t border-[#3F3F46] mt-10 pt-6 text-center text-sm text-[#71717A]">
                    © 2024 CloakPK. All rights reserved.
                </div>
            </div>
        </footer>
    )
}
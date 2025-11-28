"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Button } from "./Button";
import Image from "next/image";
import { Menu, X, ShoppingCart, CheckCircle, AlertCircle } from "lucide-react";
import { usePathname } from "next/navigation";

// Toast Component
const Toast = ({
  message,
  type,
  onClose,
}: {
  message: string;
  type: "success" | "error";
  onClose: () => void;
}) => {
  React.useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`fixed top-24 right-6 z-60 flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg animate-slide-in ${
        type === "success" ? "bg-green-500" : "bg-red-500"
      } text-white`}
    >
      {type === "success" ? (
        <CheckCircle className="h-5 w-5" />
      ) : (
        <AlertCircle className="h-5 w-5" />
      )}
      <span className="font-medium">{message}</span>
      <button
        onClick={onClose}
        className="ml-2 hover:opacity-80"
        aria-label="Close notification"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showCartPopup, setShowCartPopup] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const pathname = usePathname();

  // This would come from your global state/context
  const cartItems = [
    {
      id: 1,
      title: "Dinner party gown",
      price: 19999,
      quantity: 1,
      image: "/api/placeholder/80/100",
    },
  ];

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const navItems = [
    { label: "Home", href: "/" },
    { label: "About Us", href: "/about" },
    { label: "Marketplace", href: "/marketplace" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
  ];

  const formatPrice = (price: number) => {
    return price.toLocaleString();
  };

  // Listen for custom toast events
  React.useEffect(() => {
    const handleShowToast = (event: CustomEvent) => {
      setToast(event.detail);
    };
    window.addEventListener("showToast", handleShowToast as EventListener);
    return () => {
      window.removeEventListener("showToast", handleShowToast as EventListener);
    };
  }, []);

  return (
    <>
      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <header className="fixed top-0 left-0 right-0 bg-linear-to-r from-[#6b4e3d] to-[#5a3d2f] shadow-lg z-50">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center justify-between gap-10">
              {/* Logo */}
              <Link href="/" className="flex items-center">
                <Image
                  src="/images/logo.svg"
                  alt="logo"
                  width={76}
                  height={46}
                  className="rounded-lg w-full h-full object-contain"
                />
              </Link>

              {/* Navigation */}
              <nav className="hidden md:flex items-center space-x-8 ml-12">
                {navItems.map((item, index) => (
                  <Link
                    key={index}
                    href={item.href}
                    className={`text-[15px] font-medium transition-colors duration-200 pb-1 border-b-2 ${
                      pathname === item.href
                        ? "text-white border-[#F5A623]"
                        : "text-gray-300 hover:text-white border-transparent hover:border-[#F5A623]/50"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Action Buttons */}
            <div className="hidden md:flex items-center gap-4">
              {/* Cart Icon */}
              <div className="relative">
                <button
                  onClick={() => setShowCartPopup(!showCartPopup)}
                  className="text-white hover:text-gray-200 transition-colors relative"
                  aria-label={`Shopping cart with ${cartCount} items`}
                >
                  <ShoppingCart className="h-6 w-6" />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </button>

                {/* Cart Popup */}
                {showCartPopup && (
                  <div className="absolute right-0 top-12 w-80 bg-white rounded-lg shadow-xl p-4 z-50">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-gray-900">
                        Shopping Cart
                      </h3>
                      <button
                        onClick={() => setShowCartPopup(false)}
                        className="text-gray-500 hover:text-gray-700"
                        aria-label="Close cart"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>

                    {cartItems.length > 0 ? (
                      <>
                        <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                          {cartItems.map((item) => (
                            <div
                              key={item.id}
                              className="flex gap-3 border-b border-gray-100 pb-3"
                            >
                              <div className="w-16 h-20 bg-gray-200 rounded overflow-hidden shrink-0">
                                <Image
                                  src={item.image}
                                  alt={item.title}
                                  width={80}
                                  height={100}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="flex-1">
                                <h4 className="text-sm font-semibold text-gray-900">
                                  {item.title}
                                </h4>
                                <p className="text-sm text-gray-600">
                                  Qty: {item.quantity}
                                </p>
                                <p className="text-sm font-bold text-gray-900">
                                  ₦{formatPrice(item.price)}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="border-t border-gray-200 pt-3 mb-3">
                          <div className="flex justify-between text-lg font-bold text-gray-900">
                            <span>Total:</span>
                            <span>₦{formatPrice(cartTotal)}</span>
                          </div>
                        </div>

                        <Link href="/cart">
                          <button
                            onClick={() => setShowCartPopup(false)}
                            className="w-full py-3 bg-[#FAB75B] text-white font-semibold rounded-lg hover:bg-[#e9a548] transition-colors"
                          >
                            View Cart & Checkout
                          </button>
                        </Link>
                      </>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        Your cart is empty
                      </div>
                    )}
                  </div>
                )}
              </div>

              <Link
                href="/sign-in"
                className="text-white text-[15px] font-medium hover:text-gray-200 transition-colors duration-200 hidden lg:block"
              >
                Sign In
              </Link>
              <Link href="/sign-up">
                <Button size="medium">Get Started</Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-white hover:text-gray-200 transition-colors"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden pb-4 border-t border-white/10">
              <nav className="flex flex-col space-y-4 pt-4">
                {navItems.map((item, index) => (
                  <Link
                    key={index}
                    href={item.href}
                    className={`text-[15px] font-medium transition-colors duration-200 ${
                      pathname === item.href
                        ? "text-white"
                        : "text-gray-300 hover:text-white"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
                <div className="flex flex-col gap-3 pt-4 border-t border-white/10">
                  <Link
                    href="/sign-in"
                    className="text-white text-[15px] font-medium hover:text-gray-200 transition-colors duration-200"
                  >
                    Sign In
                  </Link>
                  <Link href="/sign-up">
                    <Button size="medium">Get Started</Button>
                  </Link>
                </div>
              </nav>
            </div>
          )}
        </div>

        {/* Backdrop for cart popup */}
        {showCartPopup && (
          <div
            className="fixed inset-0 bg-black/20 z-40"
            onClick={() => setShowCartPopup(false)}
          />
        )}
      </header>
    </>
  );
};

export default Header;

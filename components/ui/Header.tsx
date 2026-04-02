/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "./Button";
import Image from "next/image";
import {
  Menu,
  X,
  ShoppingCart,
  CheckCircle,
  AlertCircle,
  Bell,
  LogOut,
  LayoutDashboard,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { useCart } from "@/hooks/useCart";

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
      className={`fixed top-24 right-6 z-60 flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg animate-slide-in ${type === "success" ? "bg-green-500" : "bg-red-500"
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
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { data: cartData, isLoading: isCartLoading } = useCart({
    enabled: isAuthenticated,
  });

  const cartItems = useMemo(() => cartData?.cart?.items ?? [], [cartData]);
  const cartCount = useMemo(() => {
    if (cartData?.cart?.item_count != null) return cartData.cart.item_count;
    if (cartData?.item_count != null) return cartData.item_count;
    return cartItems.reduce((sum, item) => sum + (item.quantity ?? 0), 0);
  }, [cartData, cartItems]);

  const cartTotal = useMemo(() => {
    if (cartData?.cart?.total != null) return cartData.cart.total;
    return cartItems.reduce(
      (sum, item) => sum + (item.quantity ?? 0) * (item.unit_price ?? 0),
      0
    );
  }, [cartData, cartItems]);

  const navItems = [
    { label: "Home", href: "/" },
    { label: "About Us", href: "/about" },
    { label: "Marketplace", href: "/marketplace" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
    {
      label: "Studio",
      href: process.env.NEXT_PUBLIC_STUDIO_URL,
      target: "_blank",
      external: true,
    },
  ];

  const renderNavItem = (
    item: (typeof navItems)[number],
    key: React.Key,
    onClick?: () => void
  ) => {
    if (!item.href) return null;

    const className = `text-[15px] font-medium transition-colors duration-200 ${!item.external && pathname === item.href
      ? "text-[#FAB75B]"
      : "text-white/90 hover:text-white"
      }`;

    if (item.external) {
      return (
        <a
          key={key}
          href={item.href}
          target={item.target ?? "_blank"}
          rel="noopener noreferrer"
          className={className}
          onClick={onClick}
        >
          {item.label}
        </a>
      );
    }

    return (
      <Link key={key} href={item.href} className={className} onClick={onClick}>
        {item.label}
      </Link>
    );
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString();
  };

  const handleLogout = async () => {
    try {
      await logout();
      setShowProfileMenu(false);
      router.push("/");
      setToast({ message: "Logged out successfully", type: "success" });
    } catch (error) {
      console.error("Logout failed:", error);
      setToast({ message: "Logout failed", type: "error" });
    }
  };

  // Get user display info
  const displayName =
    user?.display_name ||
    `${user?.first_name || ""} ${user?.last_name || ""}`.trim() ||
    "User";

  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

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

      <header className="fixed top-0 left-0 right-0 bg-[#5C4033] shadow-md z-50">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="flex items-center justify-between h-20">
            {/* Left side: Logo + Navigation */}
            <div className="flex items-center gap-12">
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
              <nav className="hidden lg:flex items-center space-x-8">
                {navItems.map((item, index) => renderNavItem(item, index))}
              </nav>
            </div>

            {/* Right side: Actions */}
            <div className="hidden lg:flex items-center gap-4">
              {/* Authenticated User UI */}
              {isAuthenticated && user ? (
                <>
                  {/* Go to Dashboard Button */}
                  <Link href="/dashboard">
                    <Button
                      size="medium"
                      className="bg-[#FAB75B] hover:bg-[#e9a548] text-white font-medium px-6"
                    >
                      Go to Dashboard
                    </Button>
                  </Link>

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

                        {isCartLoading ? (
                          <div className="py-6 text-center text-gray-500">Loading cart…</div>
                        ) : cartItems.length > 0 ? (
                          <>
                            <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                              {cartItems.map((item) => (
                                <div
                                  key={item.id}
                                  className="flex gap-3 border-b border-gray-100 pb-3"
                                >
                                  <div className="w-16 h-20 bg-gray-200 rounded overflow-hidden shrink-0">
                                    <Image
                                      src={item.thumbnail || "/images/ankara-gown.jpg"}
                                      alt={item.title || "Cart item"}
                                      width={80}
                                      height={100}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <div className="flex-1">
                                    <h4 className="text-sm font-semibold text-gray-900">
                                      {item.title || "Item"} ({item.variant_title || "title"})
                                    </h4>
                                    <p className="text-sm text-gray-600">
                                      Qty: {item.quantity}
                                    </p>
                                    <p className="text-sm font-bold text-gray-900">
                                      ₦{formatPrice(item.unit_price ?? 0)}
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

                  {/* Notifications Icon */}
                  <button
                    className="text-white hover:text-gray-200 transition-colors relative"
                    aria-label="Notifications"
                  >
                    <Bell className="h-6 w-6" />
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
                      3
                    </span>
                  </button>

                  {/* Profile Avatar */}
                  <div className="relative">
                    <button
                      onClick={() => setShowProfileMenu(!showProfileMenu)}
                      className="flex items-center transition-transform hover:scale-105"
                      aria-label="User menu"
                    >
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-linear-to-br from-amber-400 to-orange-500 flex items-center justify-center ring-2 ring-white/20">
                        {user.avatar_url ? (
                          <img
                            src={user.avatar_url}
                            alt={displayName}
                            width={40}
                            height={40}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-white text-sm font-semibold">
                            {initials}
                          </span>
                        )}
                      </div>
                    </button>

                    {/* Profile Dropdown Menu */}
                    {showProfileMenu && (
                      <div className="absolute right-0 top-14 w-64 bg-white rounded-lg shadow-xl py-2 z-50">
                        <div className="px-4 py-3 border-b border-gray-100">
                          <p className="text-sm font-semibold text-gray-900">
                            {displayName}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {user.email}
                          </p>
                        </div>

                        <Link
                          href="/dashboard"
                          className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          onClick={() => setShowProfileMenu(false)}
                        >
                          <LayoutDashboard className="h-4 w-4" />
                          Go to Dashboard
                        </Link>

                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors border-t border-gray-100"
                        >
                          <LogOut className="h-4 w-4" />
                          Sign Out
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                /* Unauthenticated User Buttons */
                <>
                  <Link
                    href="/sign-in"
                    className="text-white text-[15px] font-medium hover:text-gray-200 transition-colors duration-200"
                  >
                    Sign In
                  </Link>
                  <Link href="/sign-up">
                    <Button
                      size="medium"
                      className="bg-[#FAB75B] hover:bg-[#e9a548]"
                    >
                      Get Started
                    </Button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden text-white hover:text-gray-200 transition-colors"
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
            <div className="lg:hidden pb-4 border-t border-white/10">
              <nav className="flex flex-col space-y-4 pt-4">
                {navItems.map((item, index) =>
                  renderNavItem(item, index, () => setIsMenuOpen(false))
                )}
                <div className="flex flex-col gap-3 pt-4 border-t border-white/10">
                  {isAuthenticated && user ? (
                    <>
                      <div className="flex items-center gap-3 text-white">
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-linear-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                          {user.avatar_url ? (
                            <img
                              src={user.avatar_url}
                              alt={displayName}
                              width={40}
                              height={40}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-white text-sm font-semibold">
                              {initials}
                            </span>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-semibold">{displayName}</p>
                          <p className="text-xs text-gray-300">{user.email}</p>
                        </div>
                      </div>
                      <Link
                        href="/dashboard"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Button
                          size="medium"
                          className="w-full justify-center bg-[#FAB75B] hover:bg-[#e9a548]"
                        >
                          <LayoutDashboard className="h-4 w-4 mr-2" />
                          Go to Dashboard
                        </Button>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="text-red-400 text-[15px] font-medium hover:text-red-300 transition-colors duration-200 text-left"
                      >
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/sign-in"
                        className="text-white text-[15px] font-medium hover:text-gray-200 transition-colors duration-200"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Sign In
                      </Link>
                      <Link
                        href="/sign-up"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Button
                          size="medium"
                          className="bg-[#FAB75B] hover:bg-[#e9a548]"
                        >
                          Get Started
                        </Button>
                      </Link>
                    </>
                  )}
                </div>
              </nav>
            </div>
          )}
        </div>

        {/* Backdrop for popups */}
        {(showCartPopup || showProfileMenu) && (
          <div
            className="fixed inset-0 bg-black/20 z-40"
            onClick={() => {
              setShowCartPopup(false);
              setShowProfileMenu(false);
            }}
          />
        )}
      </header>
    </>
  );
};

export default Header;

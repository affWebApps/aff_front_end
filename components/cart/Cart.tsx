"use client";
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Minus, Plus, ShieldOff, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart, useCartMutations, useShippingOptions } from "@/hooks/useCart";
import { NIGERIA_STATES } from "@/data/states";
import { useAuthStore } from "@/store/authStore";

interface CartItem {
  id: string;
  title?: string;
  thumbnail?: string | null;
  quantity: number;
  unit_price?: number;
}

const isNotProduction = (process.env.CUSTOM_NODE_ENV !== "production") || (process.env.NODE_ENV !== "production");

interface ShippingInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  street: string;
  apartment: string;
  city: string;
  state: string;
  postalCode: string;
  country_code: string;
}

interface OrderSummaryProps {
  showButton?: boolean;
  buttonText?: string;
  onButtonClick: () => void;
  subtotal: number;
  serviceFee: number;
  shippingFee: number;
  total: number;
  formatPrice: (price: number) => string;
}

interface CartStepProps {
  cartItems: CartItem[];
  removeItem: (id: string) => void;
  updateQuantity: (id: string, change: number) => void;
  formatPrice: (price: number) => string;
  setCurrentStep: (step: string) => void;
  fadeInUp: {
    hidden: { opacity: number; y: number };
    visible: { opacity: number; y: number };
  };
  subtotal: number;
  serviceFee: number;
  shippingFee: number;
  total: number;
}

interface ShippingStepProps {
  shippingInfo: ShippingInfo;
  billingInfo: ShippingInfo;
  setBillingInfo: (info: ShippingInfo) => void;
  setShippingInfo: (info: ShippingInfo) => void;
  setCurrentStep: (step: string) => void;
  onSaveAddresses: () => Promise<void>;
  savingAddresses: boolean;
  hasSavedAddresses: boolean;
  onSkipExisting: () => void;
  shippingAddressRaw?: any;
  billingAddressRaw?: any;
  fadeInUp: {
    hidden: { opacity: number; y: number };
    visible: { opacity: number; y: number };
  };
}

interface PaymentStepProps {
  paymentMethod: string;
  setPaymentMethod: (method: string) => void;
  setCurrentStep: (step: string) => void;
  fadeInUp: {
    hidden: { opacity: number; y: number };
    visible: { opacity: number; y: number };
  };
  subtotal: number;
  serviceFee: number;
  shippingFee: number;
  total: number;
  formatPrice: (price: number) => string;
  cartId?: string;
  onPaymentCreated: () => void;
  isCreatingPayment: boolean;
}

interface ConfirmationStepProps {
  cartItems: CartItem[];
  formatPrice: (price: number) => string;
  setCurrentStep: (step: string) => void;
  setShippingInfo: (info: ShippingInfo) => void;
  subtotal: number;
  serviceFee: number;
  shippingFee: number;
  total: number;
  orderNumber: string;
  fadeInUp: {
    hidden: { opacity: number; y: number };
    visible: { opacity: number; y: number };
  };
}

type ShippingOption = {
  id: string;
  name: string;
  amount: number;
  is_tax_inclusive?: boolean;
};

interface ShippingMethodStepProps {
  cartId: string;
  onBack: () => void;
  onConfirm: (optionId: string) => Promise<void>;
  currentOption?: string;
}

const OrderSummary = ({
  showButton = true,
  buttonText = "Proceed to Checkout",
  onButtonClick,
  subtotal,
  serviceFee,
  shippingFee,
  total,
  formatPrice,
}: OrderSummaryProps) => (
  <div className="bg-white rounded-2xl p-6 shadow-lg h-fit">
    <h3 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h3>

    <div className="space-y-4 mb-6">
      <div className="flex justify-between text-gray-700">
        <span>Subtotal</span>
        <span className="font-medium">₦ {formatPrice(subtotal)}</span>
      </div>
      <div className="flex justify-between text-gray-700">
        <span>Service fee</span>
        <span className="font-medium">₦ {formatPrice(serviceFee)}</span>
      </div>
      <div className="flex justify-between text-gray-700">
        <span>Shipping fee</span>
        <span className="font-medium">₦ {formatPrice(shippingFee)}</span>
      </div>
    </div>

    <div className="border-t border-gray-200 pt-4 mb-6">
      <div className="flex justify-between text-lg font-bold text-gray-900">
        <span>Total</span>
        <span>₦ {formatPrice(total)}</span>
      </div>
    </div>

    {showButton && (
      <button
        onClick={onButtonClick}
        className="w-full py-4 bg-[#FAB75B] text-white font-semibold rounded-lg hover:bg-[#e9a548] transition-colors"
      >
        {buttonText}
      </button>
    )}
  </div>
);

const CartStep = ({
  cartItems,
  removeItem,
  updateQuantity,
  formatPrice,
  setCurrentStep,
  fadeInUp,
  subtotal,
  serviceFee,
  shippingFee,
  total,
}: CartStepProps) => (
  <div className="min-h-screen bg-linear-to-b from-orange-50 to-white py-8">
    <div className="container mx-auto px-4">
      <button
        onClick={() => console.log("Go back", process.env.NODE_ENV === "development")}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <ChevronLeft className="w-5 h-5" />
        Back
      </button>

      <h1 className="text-3xl font-bold text-gray-900 mb-2">Cart</h1>
      <p className="text-gray-600 mb-8">
        {cartItems.length} {cartItems.length === 1 ? "item" : "items"} in your
        cart
      </p>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item: CartItem, index: number) => (
            <motion.div
              key={item.id}
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl p-4 shadow-md flex gap-4"
            >
              <div className="w-24 h-32 bg-gray-200 rounded-lg overflow-hidden shrink-0">
                <Image
                  src={item.thumbnail || "/images/ankara-gown.jpg"}
                  alt={item.title || "Cart item"}
                  width={96}
                  height={128}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {item.title || "Item"}
                    </h3>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                    title="Remove item"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-gray-900">
                    ₦ {formatPrice(item.unit_price ?? 0)}
                  </span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      disabled={item.quantity <= 1}
                      className="w-8 h-8 rounded-lg bg-[#FAB75B] text-white flex items-center justify-center hover:bg-[#e9a548] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Decrease quantity"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="font-medium text-gray-900 w-6 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      className="w-8 h-8 rounded-lg bg-[#FAB75B] text-white flex items-center justify-center hover:bg-[#e9a548] transition-colors"
                      title="Increase quantity"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div>
          <OrderSummary
            buttonText="Proceed to Checkout"
            onButtonClick={() => {
              setCurrentStep("shipping");
              if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "auto" });
            }}
            subtotal={subtotal}
            serviceFee={serviceFee}
            shippingFee={shippingFee}
            total={total}
            formatPrice={formatPrice}
          />
        </div>
      </div>
    </div>
  </div>
);

const ShippingStep = ({
  shippingInfo,
  billingInfo,
  setShippingInfo,
  setBillingInfo,
  setCurrentStep,
  onSaveAddresses,
  savingAddresses,
  hasSavedAddresses,
  onSkipExisting,
  shippingAddressRaw,
  billingAddressRaw,
  fadeInUp,
}: ShippingStepProps) => {
  const [isEditing, setIsEditing] = useState(!hasSavedAddresses);

  useEffect(() => {
    setIsEditing(!hasSavedAddresses);
  }, [hasSavedAddresses]);

  const savedShippingRaw = hasSavedAddresses ? shippingAddressRaw : null;
  const savedBillingRaw = hasSavedAddresses ? billingAddressRaw : null;

  const pickDisplayFields = (addr: any) => {
    if (!addr) return null;
    const {
      first_name,
      last_name,
      address_1,
      city,
      country_code,
      province,
      postal_code,
      phone,
      email,
    } = addr;
    return {
      first_name,
      last_name,
      address_1,
      city,
      country_code,
      province,
      postal_code,
      phone,
      email,
    };
  };

  const savedShipping = pickDisplayFields(savedShippingRaw);
  const savedBilling = pickDisplayFields(savedBillingRaw);

  const renderAddress = (title: string, addr: any) => (
    <div className="border rounded-lg p-4 bg-gray-50">
      <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
      <div className="text-sm text-gray-700 space-y-1">
        {addr && Object.keys(addr).length
          ? Object.entries(addr).map(([key, value]) => (
            <div key={key}>
              <span className="font-medium capitalize">{key.replace(/_/g, " ")}: </span>
              <span>{String(value ?? "")}</span>
            </div>
          ))
          : <div className="text-gray-500">No address on file.</div>}
      </div>
    </div>
  );

  const isFormValid = () => {
    return (
      shippingInfo.firstName &&
      shippingInfo.lastName &&
      shippingInfo.email &&
      shippingInfo.phone &&
      shippingInfo.street &&
      shippingInfo.city &&
      shippingInfo.state &&
      shippingInfo.postalCode &&
      shippingInfo.country_code &&
      billingInfo.firstName &&
      billingInfo.lastName &&
      billingInfo.email &&
      billingInfo.phone &&
      billingInfo.street &&
      billingInfo.city &&
      billingInfo.state &&
      billingInfo.postalCode &&
      billingInfo.country_code
    );
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-orange-50 to-white py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <button
          onClick={() => {
            setCurrentStep("cart");
            if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "auto" });
          }}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          Back
        </button>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="bg-white rounded-2xl p-8 shadow-lg"
        >

          {hasSavedAddresses && (
            <div className="space-y-4 mb-10">
              {renderAddress("Saved Shipping Address", savedShipping)}
              {renderAddress("Saved Billing Address", savedBilling)}

              <div className="flex gap-3 flex-col sm:flex-row">
                <button
                  onClick={() => {
                    onSkipExisting();
                    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "auto" });
                  }}
                  className="w-full sm:w-1/2 py-4 border-2 border-[#FAB75B] text-[#FAB75B] font-semibold rounded-lg hover:bg-orange-50 transition-colors"
                >
                  Continue with existing
                </button>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="w-full sm:w-1/2 py-4 bg-[#FAB75B] text-white font-semibold rounded-lg hover:bg-[#e9a548] transition-colors"
                >
                  {isEditing ? "Close Address Form" : "Edit addresses"}
                </button>
              </div>

              <div className="h-px w-full bg-gray-200" />

            </div>
          )}

          {(!hasSavedAddresses || isEditing) && (
            <>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Shipping address</h1>
              <p className="text-gray-600 mb-8">
                Please provide your delivery address below.
              </p>
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter first name"
                    value={shippingInfo.firstName}
                    onChange={(e) =>
                      setShippingInfo({
                        ...shippingInfo,
                        firstName: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FAB75B] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter last name"
                    value={shippingInfo.lastName}
                    onChange={(e) =>
                      setShippingInfo({
                        ...shippingInfo,
                        lastName: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FAB75B] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    placeholder="Enter email"
                    value={shippingInfo.email}
                    onChange={(e) =>
                      setShippingInfo({ ...shippingInfo, email: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FAB75B] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    placeholder="Enter phone number"
                    value={shippingInfo.phone}
                    onChange={(e) =>
                      setShippingInfo({ ...shippingInfo, phone: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FAB75B] focus-border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Street Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter street address"
                    value={shippingInfo.street}
                    onChange={(e) =>
                      setShippingInfo({ ...shippingInfo, street: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FAB75B] focus-border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Apartment, Suite, etc (optional)
                  </label>
                  <input
                    type="text"
                    placeholder="Enter number"
                    value={shippingInfo.apartment}
                    onChange={(e) =>
                      setShippingInfo({
                        ...shippingInfo,
                        apartment: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FAB75B] focus-border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter city"
                    value={shippingInfo.city}
                    onChange={(e) =>
                      setShippingInfo({ ...shippingInfo, city: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FAB75B] focus-border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={shippingInfo.state}
                    onChange={(e) =>
                      setShippingInfo({ ...shippingInfo, state: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FAB75B] focus-border-transparent appearance-none bg-white"
                    title="Select your state"
                  >
                    <option value="">Select state</option>
                    {NIGERIA_STATES.map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Postal Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter code"
                    value={shippingInfo.postalCode}
                    onChange={(e) =>
                      setShippingInfo({
                        ...shippingInfo,
                        postalCode: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FAB75B] focus-border-transparent"
                  />
                </div>
              </div>
            </>
          )}

          <div className="mt-12 border-t pt-8 space-y-6">

            {(!hasSavedAddresses || isEditing) && (
              <>
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">Billing address</h2>
                  <button
                    onClick={() => setBillingInfo({ ...shippingInfo })}
                    className="text-sm text-[#FAB75B] font-semibold hover:text-[#e9a548]"
                  >
                    Same as shipping
                  </button>
                </div>                <p className="text-gray-600 mb-8">
                  Please provide your delivery address below.
                </p>
                <div className="grid md:grid-cols-2 gap-6 mb-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter first name"
                      value={billingInfo.firstName}
                      onChange={(e) =>
                        setBillingInfo({ ...billingInfo, firstName: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FAB75B] focus-border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter last name"
                      value={billingInfo.lastName}
                      onChange={(e) =>
                        setBillingInfo({ ...billingInfo, lastName: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus-ring-[#FAB75B] focus-border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      placeholder="Enter email"
                      value={billingInfo.email}
                      onChange={(e) =>
                        setBillingInfo({ ...billingInfo, email: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus-ring-[#FAB75B] focus-border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      placeholder="Enter phone number"
                      value={billingInfo.phone}
                      onChange={(e) =>
                        setBillingInfo({ ...billingInfo, phone: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus-ring-[#FAB75B] focus-border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Street Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter street address"
                      value={billingInfo.street}
                      onChange={(e) =>
                        setBillingInfo({ ...billingInfo, street: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus-ring-[#FAB75B] focus-border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Apartment, Suite, etc (optional)
                    </label>
                    <input
                      type="text"
                      placeholder="Enter number"
                      value={billingInfo.apartment}
                      onChange={(e) =>
                        setBillingInfo({
                          ...billingInfo,
                          apartment: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus-ring-[#FAB75B] focus-border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter city"
                      value={billingInfo.city}
                      onChange={(e) =>
                        setBillingInfo({ ...billingInfo, city: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus-ring-[#FAB75B] focus-border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={billingInfo.state}
                      onChange={(e) =>
                        setBillingInfo({ ...billingInfo, state: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FAB75B] focus-border-transparent appearance-none bg-white"
                      title="Select your state"
                    >
                      <option value="">Select state</option>
                      {NIGERIA_STATES.map((state) => (
                        <option key={state} value={state}>
                          {state}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Postal Code <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter code"
                      value={billingInfo.postalCode}
                      onChange={(e) =>
                        setBillingInfo({
                          ...billingInfo,
                          postalCode: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus-ring-[#FAB75B] focus-border-transparent"
                    />
                  </div>
                </div>
              </>
            )}
          </div>
          {(!hasSavedAddresses || isEditing) && (
            <button
              onClick={onSaveAddresses}
              disabled={!isFormValid() || savingAddresses}
              className="w-full py-4 bg-[#FAB75B] text-white font-semibold rounded-lg hover:bg-[#e9a548] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {savingAddresses ? "Saving..." : hasSavedAddresses ? "Update addresses" : "Select Shipping Method"}
            </button>
          )}
        </motion.div>
      </div>
    </div>
  );
};

// Move PaymentStep outside the main component
const PaymentStep = ({
  paymentMethod,
  setPaymentMethod,
  setCurrentStep,
  fadeInUp,
  subtotal,
  serviceFee,
  shippingFee,
  total,
  formatPrice,
  cartId,
  onPaymentCreated,
  isCreatingPayment,
}: PaymentStepProps) => (
  <div className="min-h-screen bg-linear-to-b from-orange-50 to-white py-8">
    <div className="container mx-auto px-4">
      <button
        onClick={() => {
          setCurrentStep("shippingMethod");
          if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "auto" });
        }}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <ChevronLeft className="w-5 h-5" />
        Back
      </button>

      <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="lg:col-span-2 bg-white rounded-2xl p-8 shadow-lg"
        >
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Select payment method
          </h1>
          <p className="text-gray-600 mb-8">
            Select your preferred payment method below.
          </p>

          <div className="space-y-4">
            {[
              {
                value: "pp_paystack_paystack-live",
                label: "",
                icon: <Image
                  src="/icons/paystackLogo.svg"
                  alt={""}
                  width={150}
                  height={150}
                />,
                show: true,
              },
              {
                value: "pp_paystack_paystack-test",
                label: "----> Test",
                icon: <Image
                  src="/icons/paystackLogo.svg"
                  alt={""}
                  width={150}
                  height={150}
                />,
                show: isNotProduction,
              },
            ]
              .filter((method) => method.show)
              .map((method) => (
                <label
                  key={method.value}
                  className={`flex items-center gap-4 p-6 border-2 rounded-xl cursor-pointer transition-all ${paymentMethod === method.value
                    ? "border-[#FAB75B] bg-orange-50"
                    : "border-gray-200 hover:border-gray-300"
                    }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={method.value}
                    checked={paymentMethod === method.value}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-5 h-5 accent-[#FAB75B]"
                  />
                  <div className="flex items-center gap-2">
                    {method.icon}
                    {method.value === "stripe" ? null : (
                      <span className="font-semibold text-gray-900">{method.label}</span>
                    )}
                  </div>
                </label>
              ))}
          </div>
        </motion.div>

        <div>
          <OrderSummary
            buttonText="Complete Order"
            onButtonClick={() => setCurrentStep("confirmation")}
            subtotal={subtotal}
            serviceFee={serviceFee}
            shippingFee={shippingFee}
            total={total}
            formatPrice={formatPrice}
            showButton={false}
          />
          <button
            onClick={onPaymentCreated}
            disabled={!paymentMethod || !cartId || isCreatingPayment}
            className="mt-4 w-full py-4 bg-[#FAB75B] text-white font-semibold rounded-lg hover:bg-[#e9a548] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCreatingPayment
              ? "Redirecting to Paystack..."
              : paymentMethod
                ? "Complete Order"
                : "Select a payment method"}
          </button>
        </div>
      </div>
    </div>
  </div>
);

const ShippingMethodStep = ({
  cartId,
  onBack,
  onConfirm,
  currentOption,
}: ShippingMethodStepProps) => {
  const { data, isLoading, error } = useShippingOptions(cartId);

  const options: ShippingOption[] = data?.map((opt: any) => ({
    id: opt.id,
    name: opt.name ?? opt.type?.label ?? "Shipping",
    amount: opt.calculated_price?.calculated_amount ?? opt.amount ?? 0,
    is_tax_inclusive: opt.is_tax_inclusive,
  })) ?? [];

  const [selected, setSelected] = useState<string | undefined>(currentOption);

  useEffect(() => {
    setSelected(currentOption);
  }, [currentOption]);

  return (
    <div className="min-h-screen bg-linear-to-b from-orange-50 to-white py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <button
          onClick={() => {
            onBack();
            if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "auto" });
          }}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          Back to addresses
        </button>

        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Shipping method</h1>
          <p className="text-gray-600 mb-6">
            Choose how you’d like your order delivered.
          </p>

          {isLoading && <div className="text-gray-600">Loading options...</div>}
          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              Failed to load shipping options.
            </div>
          )}

          <div className="space-y-4">
            {options.map((opt) => (
              <label
                key={opt.id}
                className={`flex items-center justify-between p-4 border-2 rounded-xl cursor-pointer transition-all ${selected === opt.id
                  ? "border-[#FAB75B] bg-orange-50"
                  : "border-gray-200 hover:border-gray-300"
                  }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="shipping-option"
                    value={opt.id}
                    checked={selected === opt.id}
                    onChange={() => setSelected(opt.id)}
                    className="w-5 h-5 accent-[#FAB75B]"
                  />
                  <div>
                    <div className="font-semibold text-gray-900">{opt.name}</div>
                    <div className="text-sm text-gray-600">
                      {opt.is_tax_inclusive ? "Tax included" : "Tax exclusive"}
                    </div>
                  </div>
                </div>
                <div className="text-lg font-bold text-gray-900">₦ {opt.amount}</div>
              </label>
            ))}

            {!isLoading && !options.length && (
              <div className="text-gray-600">No shipping options available.</div>
            )}
          </div>

          <button
            onClick={() => selected && onConfirm(selected)}
            disabled={!selected}
            className="mt-6 w-full py-4 bg-[#FAB75B] text-white font-semibold rounded-lg hover:bg-[#e9a548] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue to Payment
          </button>
        </div>
      </div>
    </div>
  );
};

const ConfirmationStep = ({
  cartItems,
  formatPrice,
  setCurrentStep,
  setShippingInfo,
  subtotal,
  serviceFee,
  shippingFee,
  total,
  orderNumber,
  fadeInUp,
}: ConfirmationStepProps) => (
  <div className="min-h-screen bg-linear-to-b from-orange-50 to-white py-8">
    <div className="container mx-auto px-4 max-w-3xl">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="text-center mb-8"
      >
        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-linear-to-br from-green-400 to-green-600 flex items-center justify-center shadow-lg">
          <svg
            className="w-12 h-12 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          Your Order has been placed
        </h1>
        <p className="text-gray-600 mb-6">Your payment was successful.</p>

        <div className="mb-2">
          <span className="text-gray-700">Order Number: </span>
          <span className="text-red-500 font-semibold">#{orderNumber}</span>
        </div>
        <p className="text-sm text-gray-600">
          An email with the order details has been sent to your registered email
          address.
        </p>
      </motion.div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl p-8 shadow-lg mb-6"
      >
        <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

        <div className="space-y-4 mb-6">
          {cartItems.map((item: CartItem) => (
            <div
              key={item.id}
              className="flex gap-4 pb-4 border-b border-gray-100 last:border-0"
            >
              <div className="w-20 h-24 bg-gray-200 rounded-lg overflow-hidden shrink-0">
                <Image
                  src={item.thumbnail || "/images/ankara-gown.jpg"}
                  alt={item.title || "Cart item"}
                  width={80}
                  height={96}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">
                  {item.title || "Item"}
                </h3>
                <div className="text-lg font-bold text-gray-900">
                  ₦ {formatPrice((item.unit_price ?? 0) * item.quantity)}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-3 mb-6">
          <div className="flex justify-between text-gray-700">
            <span>Subtotal</span>
            <span className="font-medium">₦ {formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between text-gray-700">
            <span>Service fee</span>
            <span className="font-medium">₦ {formatPrice(serviceFee)}</span>
          </div>
          <div className="flex justify-between text-gray-700">
            <span>Shipping fee</span>
            <span className="font-medium">₦ {formatPrice(shippingFee)}</span>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-4 mb-6">
          <div className="flex justify-between text-xl font-bold text-gray-900">
            <span>Total</span>
            <span>₦ {formatPrice(total)}</span>
          </div>
        </div>

        <div className="bg-green-50 rounded-lg p-4 text-center border border-green-200">
          <span className="text-gray-700">Estimated Delivery: </span>
          <span className="text-green-600 font-semibold">December 5, 2025</span>
        </div>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-4">
        <button className="py-4 bg-[#FAB75B] text-white font-semibold rounded-lg hover:bg-[#e9a548] transition-colors">
          Download receipt
        </button>
        <button
          onClick={() => {
            setCurrentStep("cart");
            setShippingInfo({
              firstName: "",
              lastName: "",
              email: "",
              phone: "",
              street: "",
              apartment: "",
              city: "",
              state: "",
              postalCode: "",
              country_code: "",
            });
          }}
          className="py-4 border-2 border-[#FAB75B] text-[#FAB75B] font-semibold rounded-lg hover:bg-orange-50 transition-colors"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  </div>
);

// Main component
export default function CheckoutFlow() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState("cart");
  const { data: cartData, isLoading, error } = useCart();
  const {
    removeItem: removeMutation,
    updateQty,
    updateAddresses,
    addShipping,
    createPaymentSession,
    verifyPayment,
    completeCart,
  } = useCartMutations();
  const { user } = useAuthStore();
  const cartItems = useMemo<CartItem[]>(
    () => cartData?.cart?.items ?? [],
    [cartData]
  );

  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    street: "",
    apartment: "",
    city: "",
    state: "",
    postalCode: "",
    country_code: "ng",
  });
  const [billingInfo, setBillingInfo] = useState<ShippingInfo>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    street: "",
    apartment: "",
    city: "",
    state: "",
    postalCode: "",
    country_code: "ng",
  });

  const [paymentMethod, setPaymentMethod] = useState("");
  const [orderNumber] = useState("");
  const [paymentSessionData, setPaymentSessionData] = useState<any>(null);
  const [redirecting, setRedirecting] = useState(false);

  const serviceFee = 0;
  const shippingFee = cartData?.cart?.shipping_total ?? 0;
  const subtotal = useMemo(
    () =>
      cartData?.cart?.subtotal ??
      cartItems.reduce(
        (sum, item) => sum + (item.unit_price ?? 0) * item.quantity,
        0
      ),
    [cartData, cartItems]
  );
  const total = cartData?.cart?.total ?? subtotal + serviceFee + shippingFee;

  const updateQuantity = async (id: string, change: number) => {
    const cartId = cartData?.cart?.id;
    const item = cartItems.find((c) => c.id === id);
    if (!cartId || !item) return;
    const nextQty = Math.max(1, item.quantity + change);
    await updateQty.mutateAsync({ cart_id: cartId, item_id: id, quantity: nextQty });
  };

  const removeItem = async (id: string) => {
    const cartId = cartData?.cart?.id;
    if (!cartId) return;
    await removeMutation.mutateAsync({ cart_id: cartId, item_id: id });
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString();
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };

  const handleSaveAddresses = async () => {
    const cartId = cartData?.cart?.id;
    if (!cartId) return;
    await updateAddresses.mutateAsync({
      cart_id: cartId,
      shipping_address: shippingInfo,
      billing_address: billingInfo,
    });
    setCurrentStep("shippingMethod");
  };

  const handleCreatePayment = async () => {
    const cartId = cartData?.cart?.id;
    if (!cartId || !paymentMethod) return;
    setRedirecting(true);
    try {
      const res = await createPaymentSession.mutateAsync({
        provider_id: paymentMethod,
        cart_id: cartId,
      });
      setPaymentSessionData(res);
      const session = res?.payment_collection?.payment_sessions?.[0];
      const ref =
        session?.data?.paystackTxRef ||
        session?.data?.reference ||
        session?.data?.txRef ||
        session?.data?.Txref ||
        session?.reference;
      // Persist identifiers so the callback page can recover them even if Paystack doesn't append them.
      localStorage.setItem("pendingCartId", cartId);
      if (ref) localStorage.setItem("pendingReference", ref);

      const url =
        session?.data?.paystackTxAuthorizationUrl ||
        session?.data?.authorization_url;
      if (url) {
        window.location.href = url;
      } else {
        alert("Payment session created but no redirect URL was returned.");
      }
    } catch (err) {
      console.error(err);
      alert("Unable to start payment. Please try again.");
    } finally {
      setRedirecting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-linear-to-b from-orange-50 to-white py-10">
        <div className="container mx-auto px-4">
          <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-6" />
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {Array.from({ length: 3 }).map((_, idx) => (
                <div key={idx} className="bg-white p-4 rounded-xl shadow animate-pulse h-40" />
              ))}
            </div>
            <div className="bg-white p-6 rounded-xl shadow h-64 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-linear-to-b from-orange-50 to-white py-10">
        <div className="container mx-auto px-4">
          <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            {error instanceof Error ? error.message : "Failed to load cart"}
          </div>
        </div>
      </div>
    );
  }

  if (!cartItems.length) {
    return (
      <div className="min-h-screen bg-linear-to-b from-orange-50 to-white py-10">
        <div className="container mx-auto px-4 text-center space-y-6">
          <h1 className="text-3xl font-bold text-gray-900">Your cart is empty</h1>
          <p className="text-gray-600">Add products from the marketplace to see them here.</p>
          <button
            onClick={() => router.push("/marketplace")}
            className="px-6 py-3 bg-[#FAB75B] text-white rounded-lg font-semibold hover:bg-[#e9a548] transition-colors"
          >
            Go to Marketplace
          </button>
        </div>
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      {currentStep === "cart" && (
        <CartStep
          key="cart"
          cartItems={cartItems}
          removeItem={removeItem}
          updateQuantity={updateQuantity}
          formatPrice={formatPrice}
          setCurrentStep={setCurrentStep}
          fadeInUp={fadeInUp}
          subtotal={subtotal}
          serviceFee={serviceFee}
          shippingFee={shippingFee}
          total={total}
        />
      )}
      {currentStep === "shipping" && (
        <ShippingStep
          key="shipping"
          shippingInfo={shippingInfo}
          billingInfo={billingInfo}
          setBillingInfo={setBillingInfo}
          setShippingInfo={setShippingInfo}
          setCurrentStep={setCurrentStep}
          onSaveAddresses={handleSaveAddresses}
          savingAddresses={updateAddresses.isPending}
          hasSavedAddresses={Boolean(cartData?.cart?.shipping_address || cartData?.cart?.billing_address)}
          onSkipExisting={() => setCurrentStep("shippingMethod")}
          shippingAddressRaw={cartData?.cart?.shipping_address}
          billingAddressRaw={cartData?.cart?.billing_address}
          fadeInUp={fadeInUp}
        />
      )}
      {currentStep === "shippingMethod" && cartData?.cart?.id && (
        <ShippingMethodStep
          key="shipping-method"
          cartId={cartData.cart.id}
          currentOption={cartData.cart.shipping_methods?.[0]?.shipping_option_id}
          onBack={() => {
            setCurrentStep("shipping");
            if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "auto" });
          }}
          onConfirm={async (optionId) => {
            const currentId = cartData.cart.shipping_methods?.[0]?.shipping_option_id;
            if (currentId === optionId) {
              setCurrentStep("payment");
              if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "auto" });
              return;
            }
            await addShipping.mutateAsync({ option_id: optionId, cart_id: cartData.cart!.id });
            setCurrentStep("payment");
            if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "auto" });
          }}
        />
      )}
      {currentStep === "payment" && (
        <PaymentStep
          key="payment"
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
          setCurrentStep={setCurrentStep}
          fadeInUp={fadeInUp}
          subtotal={subtotal}
          serviceFee={serviceFee}
          shippingFee={shippingFee}
          total={total}
          formatPrice={formatPrice}
          cartId={cartData?.cart?.id}
          onPaymentCreated={handleCreatePayment}
          isCreatingPayment={redirecting || createPaymentSession.isPending}
        />
      )}
      {currentStep === "confirmation" && (
        <ConfirmationStep
          key="confirmation"
          cartItems={cartItems}
          formatPrice={formatPrice}
          setCurrentStep={setCurrentStep}
          setShippingInfo={setShippingInfo}
          subtotal={subtotal}
          serviceFee={serviceFee}
          shippingFee={shippingFee}
          total={total}
          orderNumber={orderNumber}
          fadeInUp={fadeInUp}
        />
      )}
    </AnimatePresence>
  );
}

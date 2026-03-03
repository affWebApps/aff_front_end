"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Minus, Plus, X } from "lucide-react";
import Image from "next/image";

interface CartItem {
  id: number;
  image: string;
  title: string;
  seller: string;
  color: string;
  size: string;
  price: number;
  quantity: number;
}

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
  removeItem: (id: number) => void;
  updateQuantity: (id: number, change: number) => void;
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
  setShippingInfo: (info: ShippingInfo) => void;
  setCurrentStep: (step: string) => void;
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
        onClick={() => console.log("Go back")}
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
                  src={item.image}
                  alt={item.title}
                  width={96}
                  height={128}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {item.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="w-4 h-4 rounded-full bg-orange-400"></div>
                      <span className="text-sm text-gray-600">
                        {item.seller}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                    title="Remove item"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="text-sm text-gray-600 mb-3">
                  <span>Color: {item.color}</span>
                  <span className="ml-4">Size: {item.size}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-gray-900">
                    ₦ {formatPrice(item.price)}
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
            onButtonClick={() => setCurrentStep("shipping")}
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
  setShippingInfo,
  setCurrentStep,
  fadeInUp,
}: ShippingStepProps) => {
  const isFormValid = () => {
    return (
      shippingInfo.firstName &&
      shippingInfo.lastName &&
      shippingInfo.email &&
      shippingInfo.phone &&
      shippingInfo.street &&
      shippingInfo.city &&
      shippingInfo.state &&
      shippingInfo.postalCode
    );
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-orange-50 to-white py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <button
          onClick={() => setCurrentStep("cart")}
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
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Shipping address
          </h1>
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FAB75B] focus:border-transparent"
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FAB75B] focus:border-transparent"
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FAB75B] focus:border-transparent"
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FAB75B] focus:border-transparent"
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FAB75B] focus:border-transparent appearance-none bg-white"
                title="Select your state"
              >
                <option value="">Select state</option>
                <option value="lagos">Lagos</option>
                <option value="abuja">Abuja</option>
                <option value="rivers">Rivers</option>
                <option value="kano">Kano</option>
                <option value="oyo">Oyo</option>
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FAB75B] focus:border-transparent"
              />
            </div>
          </div>

          <button
            onClick={() => setCurrentStep("payment")}
            disabled={!isFormValid()}
            className="w-full py-4 bg-[#FAB75B] text-white font-semibold rounded-lg hover:bg-[#e9a548] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue to Payment
          </button>
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
}: PaymentStepProps) => (
  <div className="min-h-screen bg-linear-to-b from-orange-50 to-white py-8">
    <div className="container mx-auto px-4">
      <button
        onClick={() => setCurrentStep("shipping")}
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
            <label
              className={`flex items-center gap-4 p-6 border-2 rounded-xl cursor-pointer transition-all ${paymentMethod === "paystack"
                  ? "border-[#FAB75B] bg-orange-50"
                  : "border-gray-200 hover:border-gray-300"
                }`}
            >
              <input
                type="radio"
                name="payment"
                value="paystack"
                checked={paymentMethod === "paystack"}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-5 h-5 accent-[#FAB75B]"
              />
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-400 rounded"></div>
                <span className="font-semibold text-gray-900">Paystack</span>
              </div>
            </label>

            <label
              className={`flex items-center gap-4 p-6 border-2 rounded-xl cursor-pointer transition-all ${paymentMethod === "paypal"
                  ? "border-[#FAB75B] bg-orange-50"
                  : "border-gray-200 hover:border-gray-300"
                }`}
            >
              <input
                type="radio"
                name="payment"
                value="paypal"
                checked={paymentMethod === "paypal"}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-5 h-5 accent-[#FAB75B]"
              />
              <div className="flex items-center gap-2">
                <span className="font-bold text-blue-900">Pay</span>
                <span className="font-bold text-blue-500">Pal</span>
              </div>
            </label>

            <label
              className={`flex items-center gap-4 p-6 border-2 rounded-xl cursor-pointer transition-all ${paymentMethod === "stripe"
                  ? "border-[#FAB75B] bg-orange-50"
                  : "border-gray-200 hover:border-gray-300"
                }`}
            >
              <input
                type="radio"
                name="payment"
                value="stripe"
                checked={paymentMethod === "stripe"}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-5 h-5 accent-[#FAB75B]"
              />
              <span className="font-semibold text-purple-600">Stripe</span>
            </label>

            <label
              className={`flex items-center gap-4 p-6 border-2 rounded-xl cursor-pointer transition-all ${paymentMethod === "opay"
                  ? "border-[#FAB75B] bg-orange-50"
                  : "border-gray-200 hover:border-gray-300"
                }`}
            >
              <input
                type="radio"
                name="payment"
                value="opay"
                checked={paymentMethod === "opay"}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-5 h-5 accent-[#FAB75B]"
              />
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-green-500 rounded-full"></div>
                <span className="font-semibold text-gray-900">OPay</span>
              </div>
            </label>
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
          />
        </div>
      </div>
    </div>
  </div>
);

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
                  src={item.image}
                  alt={item.title}
                  width={80}
                  height={96}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">
                  {item.title}
                </h3>
                <div className="text-sm text-gray-600 mb-2">
                  Color: {item.color} • Size: {item.size} • Qty: {item.quantity}
                </div>
                <div className="text-lg font-bold text-gray-900">
                  ₦ {formatPrice(item.price * item.quantity)}
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
  const [currentStep, setCurrentStep] = useState("cart");
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: 1,
      image: "/images/gal3.jpg",
      title: "Dinner party gown",
      seller: "@sellers_username",
      color: "Emerald green",
      size: "M",
      price: 19999,
      quantity: 1,
    },
    {
      id: 2,
      image: "/images/gal3.jpg",
      title: "Evening dress",
      seller: "@sellers_username",
      color: "Navy blue",
      size: "L",
      price: 24999,
      quantity: 1,
    },
    {
      id: 3,
      image: "/images/gal3.jpg",
      title: "Cocktail dress",
      seller: "@sellers_username",
      color: "Burgundy",
      size: "S",
      price: 17999,
      quantity: 1,
    },
  ]);

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
  });

  const [paymentMethod, setPaymentMethod] = useState("paystack");
  const [orderNumber] = useState("123456");

  const serviceFee = 19999;
  const shippingFee = 4999;

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const total = subtotal + serviceFee + shippingFee;

  const updateQuantity = (id: number, change: number) => {
    setCartItems(
      cartItems.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item
      )
    );
  };

  const removeItem = (id: number) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString();
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };

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
          setShippingInfo={setShippingInfo}
          setCurrentStep={setCurrentStep}
          fadeInUp={fadeInUp}
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

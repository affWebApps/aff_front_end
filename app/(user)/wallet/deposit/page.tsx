"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

const DepositFundsPage = () => {
  const router = useRouter();
  const [amount, setAmount] = useState("");
  const [selectedMethod, setSelectedMethod] = useState("paystack");

  const paymentMethods = [
    { id: "paystack", name: "paystack", logo: "🔷" },
    { id: "paypal", name: "PayPal", logo: "🅿️" },
    { id: "stripe", name: "stripe", logo: "💳" },
    { id: "opay", name: "Pay", logo: "⭕" },
  ];

  const handleProceed = () => {
    console.log("Proceeding with payment:", { amount, method: selectedMethod });
    // Navigate to success page
    router.push("/wallet/deposit-success");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6 sm:mb-8">
        <button
          onClick={() => router.back()}
          className="text-gray-600 hover:text-gray-800"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800">
          Deposit Funds
        </h1>
      </div>

      <div className="max-w-2xl">
        {/* Available Balance */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 mb-6">
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">Available Balance</span>
            <span className="text-2xl font-bold text-gray-800">
              ₦350,000.00
            </span>
          </div>
        </div>

        {/* Amount Input */}
        <div className="mb-6">
          <label className="block text-gray-800 font-medium mb-3">Amount</label>
          <input
            type="text"
            placeholder="Enter amount to deposit"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E9A556] focus:border-transparent"
          />
        </div>

        {/* Choose Deposit Method */}
        <div className="mb-6">
          <label className="block text-gray-800 font-medium mb-3">
            Choose Deposit Method
          </label>
          <div className="space-y-3">
            {paymentMethods.map((method) => (
              <button
                key={method.id}
                onClick={() => setSelectedMethod(method.id)}
                className={`w-full flex items-center gap-3 p-4 border-2 rounded-lg transition-all ${
                  selectedMethod === method.id
                    ? "border-[#4FA3C1] bg-[#E6F7FB]"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    selectedMethod === method.id
                      ? "border-[#4FA3C1]"
                      : "border-gray-300"
                  }`}
                >
                  {selectedMethod === method.id && (
                    <div className="w-3 h-3 rounded-full bg-[#4FA3C1]"></div>
                  )}
                </div>
                <span className="text-lg font-medium text-gray-800">
                  {method.logo} {method.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Proceed Button */}
        <button
          onClick={handleProceed}
          className="w-full bg-[#E9A556] text-white py-3 rounded-lg hover:bg-[#d89444] transition-colors font-medium text-lg"
        >
          Proceed to Payment
        </button>
      </div>
    </div>
  );
};

export default DepositFundsPage;

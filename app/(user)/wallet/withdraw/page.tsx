"use client";
import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";

const WithdrawFundsPage = () => {
  const [amount, setAmount] = useState("");
  const [pin, setPin] = useState(["", "", "", ""]);

  const handlePinChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newPin = [...pin];
      newPin[index] = value;
      setPin(newPin);

      // Auto focus next input
      if (value && index < 3) {
        const nextInput = document.getElementById(`pin-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  const handleWithdraw = () => {
    console.log("Processing withdrawal:", {
      amount,
      pin: pin.join(""),
    });
    // Navigate to success page
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6 sm:mb-8">
        <button className="text-gray-600 hover:text-gray-800">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800">
          Withdraw Funds
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

        {/* Withdrawal Account */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 mb-6">
          <div className="flex justify-between items-start mb-4">
            <span className="text-sm text-gray-600">Withdrawal Account</span>
            <button className="text-[#E9A556] text-sm font-medium hover:underline">
              Change account
            </button>
          </div>
          <div>
            <p className="font-semibold text-gray-800 mb-1">
              United Bank of Africa
            </p>
            <p className="text-sm text-gray-600 mb-1">Acc no: ********456</p>
            <p className="text-sm text-gray-600">Acc name: John Doe</p>
          </div>
        </div>

        {/* Amount Input */}
        <div className="mb-6">
          <label className="block text-gray-800 font-medium mb-3">Amount</label>
          <input
            type="text"
            placeholder="Enter amount to withdraw"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E9A556] focus:border-transparent"
          />
        </div>

        {/* Enter PIN */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            Enter PIN
          </h2>
          <p className="text-sm text-gray-600 mb-6">
            Enter your PIN to authorize this transaction.
          </p>

          <div className="flex gap-4 justify-start">
            {pin.map((digit, index) => (
              <input
                key={index}
                id={`pin-${index}`}
                type="password"
                maxLength={1}
                value={digit}
                onChange={(e) => handlePinChange(index, e.target.value)}
                className="w-16 h-16 text-center text-2xl border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E9A556] focus:border-transparent"
              />
            ))}
          </div>
        </div>

        <button
          onClick={handleWithdraw}
          className="w-full bg-[#E9A556] text-white py-3 rounded-lg hover:bg-[#d89444] transition-colors font-medium text-lg"
        >
          Withdraw Funds
        </button>
      </div>
    </div>
  );
};

export default WithdrawFundsPage;

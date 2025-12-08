"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  Eye,
  Download,
} from "lucide-react";
import ReusableTable from "../../../components/table/ReusableTable";
import { Button } from "../../../components/ui/Button";

const MyWalletPage = () => {
  const router = useRouter();
  const transactions = [
    {
      id: 1,
      date: "October 28, 2025",
      transactionId: "TRX-1A2B3C4D",
      type: "Payment to Olivia Chen",
      typeIcon: "payment",
      amount: "₦70,000",
      status: "Successful",
    },
    {
      id: 2,
      date: "October 26, 2025",
      transactionId: "TRX-5E7W665I",
      type: "Deposit",
      typeIcon: "deposit",
      amount: "₦100,000",
      status: "Failed",
    },
    {
      id: 3,
      date: "October 23, 2025",
      transactionId: "TRX-7S0D5V2M",
      type: "Withdrawal",
      typeIcon: "withdrawal",
      amount: "₦500,000",
      status: "Successful",
    },
    {
      id: 4,
      date: "October 18, 2025",
      transactionId: "TRX-2U4B8K0D",
      type: "Payment to Benita Jones",
      typeIcon: "payment",
      amount: "₦30,000",
      status: "Pending",
    },
    {
      id: 5,
      date: "October 18, 2025",
      transactionId: "TRX-3M0A7V4X",
      type: "Payment into Escrow",
      typeIcon: "escrow",
      amount: "₦30,000",
      status: "Successful",
    },
    {
      id: 6,
      date: "October 15, 2025",
      transactionId: "TRX-9K3L5M2N",
      type: "Withdrawal",
      typeIcon: "withdrawal",
      amount: "₦150,000",
      status: "Successful",
    },
    {
      id: 7,
      date: "October 12, 2025",
      transactionId: "TRX-4P7Q8R1S",
      type: "Deposit",
      typeIcon: "deposit",
      amount: "₦200,000",
      status: "Successful",
    },
    {
      id: 8,
      date: "October 10, 2025",
      transactionId: "TRX-6T2U9V3W",
      type: "Payment to Sarah Smith",
      typeIcon: "payment",
      amount: "₦45,000",
      status: "Failed",
    },
    {
      id: 9,
      date: "October 08, 2025",
      transactionId: "TRX-1X5Y7Z8A",
      type: "Withdrawal",
      typeIcon: "withdrawal",
      amount: "₦80,000",
      status: "Pending",
    },
    {
      id: 10,
      date: "October 05, 2025",
      transactionId: "TRX-3B4C6D2E",
      type: "Payment into Escrow",
      typeIcon: "escrow",
      amount: "₦120,000",
      status: "Successful",
    },
  ];

  const columns = [
    { key: "date", label: "Date" },
    { key: "transactionId", label: "Transaction ID" },
    { key: "type", label: "Type" },
    { key: "amount", label: "Amount" },
    { key: "status", label: "Status" },
  ];

  const getTypeIcon = (typeIcon: string) => {
    switch (typeIcon) {
      case "payment":
        return <ArrowUpRight className="text-green-600" size={18} />;
      case "deposit":
        return <ArrowDownLeft className="text-red-600" size={18} />;
      case "withdrawal":
        return <ArrowUpRight className="text-green-600" size={18} />;
      case "escrow":
        return <Clock className="text-yellow-600" size={18} />;
      default:
        return null;
    }
  };

  // Custom render for type column to include icon
  const renderTypeColumn = (row: any) => {
    return (
      <div className="flex items-center gap-2">
        {getTypeIcon(row.typeIcon)}
        <span>{row.type}</span>
      </div>
    );
  };

  // Modify columns to use custom rendering
  const modifiedColumns = columns.map((col) => {
    if (col.key === "type") {
      return { ...col, render: renderTypeColumn };
    }
    return col;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-6 sm:mb-8 font-(family-name:--font-montserrat)">
        My Wallet
      </h1>

      {/* Top Section - Balance and Account Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-4">
        {/* Available Balance Card */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <p className="text-sm text-gray-600 mb-3">Available Balance</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-3">
            ₦350,000.00
          </h2>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-gray-600">Today</span>
            <span className="text-green-600 font-medium">+ ₦250,000</span>
            <span className="text-red-600 font-medium">- ₦50,000</span>
          </div>
        </div>

        {/* Withdrawal Account Card */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex justify-between items-start mb-4">
            <p className="text-sm text-gray-600">Withdrawal Account</p>
            <button
              onClick={() => router.push("/wallet/create-account")}
              className="text-[#E9A556] text-sm font-medium hover:underline"
            >
              Add withdrawal account
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
      </div>

      {/* Buttons Below Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-8">
        <Button variant="default" onClick={() => router.push("/wallet/deposit")}>
          Deposit Funds
        </Button>
        <Button variant="default" outlined onClick={() => router.push("/wallet/withdraw")}>
          Withdraw Funds
        </Button>
      </div>

      {/* Transaction History */}
      <div className="mb-4">
        <h2 className="text-xl sm:text-2xl font-normal text-gray-800 font-(family-name:--font-montserrat)">
          Transaction History
        </h2>
      </div>

      {/* Reusable Table */}
      <ReusableTable
        columns={modifiedColumns}
        data={transactions}
        itemsPerPage={5}
        showCheckbox={false}
        showActions={false}
        customActionColumn={(row) => (
          <div className="flex gap-2">
            <button className="text-gray-600 hover:text-gray-800 p-2">
              <Eye size={18} />
            </button>
            <button className="text-gray-600 hover:text-gray-800 p-2">
              <Download size={18} />
            </button>
          </div>
        )}
      />
    </div>
  );
};

export default MyWalletPage;

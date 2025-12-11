"use client";
import React, { useState } from "react";
import { Plus } from "lucide-react";
import ReusableTable from "../../../components/table/ReusableTable";
import { Button } from "../../../components/ui/Button";

interface Service {
  id: number;
  projectTitle: string;
  postedDate: string;
  bidsReceived: number;
  status: string;
  action: string;
}

const MyServicesPage = () => {
  const [activeTab, setActiveTab] = useState("posted");

  const services: Service[] = [
    {
      id: 1,
      projectTitle: "High Fashion Evening Gown Pattern",
      postedDate: "12 Feb, 2024",
      bidsReceived: 7,
      status: "Completed",
      action: "Manage project",
    },
    {
      id: 2,
      projectTitle: "Bespoke Bridal Veil Design",
      postedDate: "12 Feb, 2024",
      bidsReceived: 10,
      status: "Open to bids",
      action: "View bids",
    },
    {
      id: 3,
      projectTitle: "Sustainable Fabric sourcing",
      postedDate: "12 Feb, 2024",
      bidsReceived: 5,
      status: "In Progress",
      action: "Manage project",
    },
    {
      id: 4,
      projectTitle: "Vintage Jacket Restoration",
      postedDate: "12 Feb, 2024",
      bidsReceived: 3,
      status: "Cancelled",
      action: "Manage project",
    },
    {
      id: 5,
      projectTitle: "Custom Tailored Suit",
      postedDate: "13 Feb, 2024",
      bidsReceived: 8,
      status: "Open to bids",
      action: "View bids",
    },
    {
      id: 6,
      projectTitle: "Wedding Dress Alteration",
      postedDate: "14 Feb, 2024",
      bidsReceived: 12,
      status: "In Progress",
      action: "Manage project",
    },
    {
      id: 7,
      projectTitle: "Leather Jacket Repair",
      postedDate: "15 Feb, 2024",
      bidsReceived: 4,
      status: "Completed",
      action: "Manage project",
    },
    {
      id: 8,
      projectTitle: "Evening Gown Design",
      postedDate: "16 Feb, 2024",
      bidsReceived: 9,
      status: "Open to bids",
      action: "View bids",
    },
    {
      id: 9,
      projectTitle: "Vintage Dress Restoration",
      postedDate: "17 Feb, 2024",
      bidsReceived: 6,
      status: "In Progress",
      action: "Manage project",
    },
    {
      id: 10,
      projectTitle: "Custom Embroidery Work",
      postedDate: "18 Feb, 2024",
      bidsReceived: 11,
      status: "Completed",
      action: "Manage project",
    },
    {
      id: 11,
      projectTitle: "Silk Scarf Design",
      postedDate: "19 Feb, 2024",
      bidsReceived: 7,
      status: "Open to bids",
      action: "View bids",
    },
    {
      id: 12,
      projectTitle: "Coat Hemming Service",
      postedDate: "20 Feb, 2024",
      bidsReceived: 5,
      status: "In Progress",
      action: "Manage project",
    },
  ];

  const columns = [
    { key: "projectTitle", label: "Project title" },
    { key: "postedDate", label: "Posted date" },
    { key: "bidsReceived", label: "Bids received" },
    { key: "status", label: "Status" },
  ];

  const handleActionClick = (service: Service) => {
    console.log("Action clicked for:", service);
    // Add your action logic here
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex justify-between items-center gap-4 mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800 font-(family-name:--font-montserrat)">
          My Services
        </h1>
        <Button size="small">
          <Plus size={16} className="sm:w-5 sm:h-5" />
          <span className="hidden sm:inline">Post Job</span>
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 sm:gap-8 border-b border-gray-300 mb-6 overflow-x-auto">
        <button
          onClick={() => setActiveTab("posted")}
          className={`pb-3 px-1 whitespace-nowrap ${
            activeTab === "posted"
              ? "border-b-2 border-gray-800 text-gray-800 font-medium font-(family-name:--font-montserrat)"
              : "text-gray-500"
          }`}
        >
          Posted Services
        </button>
        <button
          onClick={() => setActiveTab("rendered")}
          className={`pb-3 px-1 whitespace-nowrap ${
            activeTab === "rendered"
              ? "border-b-2 border-gray-800 text-gray-800 font-medium font-(family-name:--font-montserrat)"
              : "text-gray-500"
          }`}
        >
          Rendered Services
        </button>
      </div>

      {/* Total Jobs */}
      <div className="mb-6">
        <h2 className="text-lg sm:text-xl font-medium text-gray-800">
          {services.length} Total Jobs
        </h2>
      </div>

      {/* Reusable Table */}
      <ReusableTable
        columns={columns}
        data={services}
        itemsPerPage={10}
        showActions={false}
        showCheckbox={true}
        customActionColumn={(row) => (
          <button
            onClick={() => handleActionClick(row)}
            className="text-[#E9A556] hover:underline text-sm font-medium"
          >
            {row.action}
          </button>
        )}
      />
    </div>
  );
};

export default MyServicesPage;

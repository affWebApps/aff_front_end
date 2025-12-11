
'use client';
import React, { useState } from "react";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp, TrendingDown, Calendar } from "lucide-react";


interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
}

const MetricCard = ({ title, value, change, isPositive }: MetricCardProps) => (
  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
    <div className="text-sm text-gray-600 mb-2">{title}</div>
    <div className="text-3xl font-bold text-gray-900 mb-2">{value}</div>
    <div
      className={`flex items-center text-sm ${
        isPositive ? "text-green-600" : "text-red-600"
      }`}
    >
      {isPositive ? (
        <TrendingUp className="w-4 h-4 mr-1" />
      ) : (
        <TrendingDown className="w-4 h-4 mr-1" />
      )}
      {change}
    </div>
  </div>
);

const Analytics = () => {
  const [activeTab, setActiveTab] = useState("tailor");
  const [timeRange, setTimeRange] = useState("Last 7 days");

  const tailorEarningsData = [
    { day: "Mon", value: 40 },
    { day: "Tue", value: 85 },
    { day: "Wed", value: 65 },
    { day: "Thu", value: 25 },
    { day: "Fri", value: 60 },
    { day: "Sat", value: 45 },
    { day: "Sun", value: 15 },
  ];

  const designerPerformanceData = [
    { day: "Mon", value: 30 },
    { day: "Tue", value: 50 },
    { day: "Wed", value: 10 },
    { day: "Thu", value: 75 },
    { day: "Fri", value: 20 },
    { day: "Sat", value: 5 },
    { day: "Sun", value: 100 },
  ];

  const projectStatusData = [
    { name: "Completed", value: 12, color: "#14b8a6" },
    { name: "In Progress", value: 5, color: "#1e3a8a" },
    { name: "Revisions", value: 3, color: "#f97316" },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 font-(family-name:--font-montserrat)">
            Analytics
          </h1>
          <div className="relative">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 90 days</option>
            </select>
            <Calendar className="absolute right-3 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-8 mb-8 border-b border-gray-200">
          <button
            onClick={() => setActiveTab("tailor")}
            className={`pb-4 px-2 font-medium transition-colors relative font-(family-name:--font-montserrat) ${
              activeTab === "tailor"
                ? "text-gray-900"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Tailor Performance
            {activeTab === "tailor" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900"></div>
            )}
          </button>
          <button
            onClick={() => setActiveTab("designer")}
            className={`pb-4 px-2 font-medium transition-colors relative font-(family-name:--font-montserrat) ${
              activeTab === "designer"
                ? "text-gray-900"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Designer Performance
            {activeTab === "designer" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900"></div>
            )}
          </button>
        </div>

        {/* Tailor Performance View */}
        {activeTab === "tailor" && (
          <>
            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <MetricCard
                title="Total Earnings"
                value="₦320,000"
                change="+23%"
                isPositive={true}
              />
              <MetricCard
                title="Projects Completed"
                value="82"
                change="-1.8%"
                isPositive={false}
              />
              <MetricCard
                title="Avg Rating"
                value="4.8/5"
                change="+0.1"
                isPositive={true}
              />
              <MetricCard
                title="On-Time Delivery"
                value="98%"
                change="-1.0%"
                isPositive={false}
              />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Earnings Chart */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  Earnings over time
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={tailorEarningsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="day" stroke="#6b7280" fontSize={12} />
                    <YAxis stroke="#6b7280" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#fff",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#000"
                      strokeWidth={2}
                      dot={{ fill: "#000", r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Project Status */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  Project status breakdown
                </h3>
                <div className="relative flex items-center justify-center">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={projectStatusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={80}
                        outerRadius={120}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {projectStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-gray-900">20</div>
                      <div className="text-sm text-gray-500">Projects</div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-center gap-6 mt-6">
                  {projectStatusData.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      ></div>
                      <span className="text-sm text-gray-600">
                        {item.name} ({item.value})
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {/* Designer Performance View */}
        {activeTab === "designer" && (
          <>
            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <MetricCard
                title="Portfolio views"
                value="150"
                change="+2.1%"
                isPositive={true}
              />
              <MetricCard
                title="Design Downloads"
                value="110"
                change="+1.3%"
                isPositive={true}
              />
              <MetricCard
                title="Total likes"
                value="3,128"
                change="+15.1%"
                isPositive={true}
              />
              <MetricCard
                title="Collaborations"
                value="21"
                change="-5.8%"
                isPositive={false}
              />
            </div>

            {/* Performance Chart */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Performance over time
              </h3>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={designerPerformanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="day" stroke="#6b7280" fontSize={12} />
                  <YAxis stroke="#6b7280" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#000"
                    strokeWidth={2}
                    dot={{ fill: "#000", r: 5 }}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Analytics;

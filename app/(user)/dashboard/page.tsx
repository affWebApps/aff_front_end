"use client";

import React from "react";
import {
  FolderOpen,
  Package,
  Wrench,
  Wallet,
  ShoppingCart,
  Hammer,
  ShoppingBag,
  Lightbulb,
} from "lucide-react";
import { useAuthStore } from "../../../store/authStore";

export default function Dashboard() {
  const { user } = useAuthStore();
  const activeProjects =
    user?.projects?.filter((project: any) => {
      const status = project?.status?.toLowerCase?.();
      return status === "open" || status === "in progress";
    }).length || 0;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Welcome back, {user?.first_name || user?.display_name}
          </h1>
          <p className="text-gray-500">
            Here&apos;s the overview of your engagements
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Active Projects */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <FolderOpen className="w-5 h-5 text-gray-600 fill-gray-600" />
              <span className="text-gray-600 font-medium">Active Projects</span>
            </div>
            <div className="text-4xl font-bold text-gray-900 mb-2">
              {activeProjects}
            </div>
            <div className="text-sm text-gray-500">Based on your projects</div>
          </div>

          {/* Total Products */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <Package className="w-5 h-5 text-gray-600 fill-gray-600" />
              <span className="text-gray-600 font-medium">
                Total Products listed
              </span>
            </div>
            <div className="text-4xl font-bold text-gray-900 mb-2">12</div>
            <div className="text-sm text-gray-500">(3 new this week)</div>
          </div>

          {/* Total Services */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <Wrench className="w-5 h-5 text-gray-600 fill-gray-600" />
              <span className="text-gray-600 font-medium">
                Total Services posted
              </span>
            </div>
            <div className="text-4xl font-bold text-gray-900 mb-2">0</div>
            {/* <div className="text-sm text-gray-500">(1 new bid sent)</div> */}
          </div>

          {/* Wallet Balance */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <Wallet className="w-5 h-5 text-gray-600 fill-gray-600" />
              <span className="text-gray-600 font-medium">Wallet Balance</span>
            </div>
            <div className="text-4xl font-bold text-gray-900 mb-2">
              ₦0.00
            </div>
            {/* <div className="text-sm text-green-600">+ ₦250,000 today</div> */}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Designs */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-thin text-gray-900">
                Recent Designs
              </h2>
              <button className="text-[#FBC57C] hover:text-[#dfac68] font-medium cursor-pointer">
                View all projects
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Design 1 */}
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-gray-50 p-4 h-64 flex items-center justify-center">
                  <div className="w-full h-full bg-white rounded shadow-sm flex">
                    <div className="w-1/3 bg-amber-50 p-3 flex flex-col gap-2">
                      <div className="bg-amber-900 h-6 rounded"></div>
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="bg-gray-200 h-8 rounded"></div>
                      ))}
                    </div>
                    <div className="w-1/3 flex items-center justify-center">
                      <div className="w-16 h-32 border-2 border-gray-300 rounded-full"></div>
                    </div>
                    <div className="w-1/3 bg-gray-50 p-3 flex flex-col gap-1">
                      <div className="text-xs text-gray-500 mb-2">
                        Properties
                      </div>
                      <div className="grid grid-cols-4 gap-1">
                        {["#334", "#667", "#889", "#f0a"].map((color, i) => (
                          <div
                            key={i}
                            className="w-4 h-4 rounded"
                            style={{ backgroundColor: color }}
                          ></div>
                        ))}
                      </div>
                      <div className="grid grid-cols-4 gap-1 mt-2">
                        {["#334", "#667", "#889", "#f0a"].map((color, i) => (
                          <div
                            key={i}
                            className="w-4 h-4 rounded"
                            style={{ backgroundColor: color }}
                          ></div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Wrench className="w-4 h-4 text-gray-600 fill-gray-600" />
                    <span className="font-semibold text-gray-900">
                      Two-piece design
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">Edited 5 mins ago</div>
                </div>
              </div>

              {/* Design 2 */}
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-gray-50 p-4 h-64 flex items-center justify-center">
                  <div className="w-full h-full bg-white rounded shadow-sm flex">
                    <div className="w-1/3 bg-amber-50 p-3 flex flex-col gap-2">
                      <div className="bg-amber-900 h-6 rounded"></div>
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="bg-gray-200 h-8 rounded"></div>
                      ))}
                    </div>
                    <div className="w-1/3 flex items-center justify-center">
                      <div className="w-16 h-32 border-2 border-gray-300 rounded-full"></div>
                    </div>
                    <div className="w-1/3 bg-gray-50 p-3 flex flex-col gap-1">
                      <div className="text-xs text-gray-500 mb-2">
                        Properties
                      </div>
                      <div className="grid grid-cols-4 gap-1">
                        {["#334", "#667", "#889", "#f0a"].map((color, i) => (
                          <div
                            key={i}
                            className="w-4 h-4 rounded"
                            style={{ backgroundColor: color }}
                          ></div>
                        ))}
                      </div>
                      <div className="grid grid-cols-4 gap-1 mt-2">
                        {["#334", "#667", "#889", "#f0a"].map((color, i) => (
                          <div
                            key={i}
                            className="w-4 h-4 rounded"
                            style={{ backgroundColor: color }}
                          ></div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Wrench className="w-4 h-4 text-gray-600 fill-gray-600" />
                    <span className="font-semibold text-gray-900">
                      Untitled design
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">
                    Edited 2 weeks ago
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Marketplace Activity */}
          <div className="bg-[#FBF6F0] rounded-lg shadow-sm overflow-hidden">
            <div className="flex items-center gap-2 p-4 bg-[#FBC57C]">
              <Lightbulb className="w-5 h-5 text-gray-900" />
              <h2 className="text-xl font-thin text-gray-900">
                Marketplace activity
              </h2>
            </div>

            <div className="space-y-4 bg-[#FBF6F0] p-4">
              {/* Activity 1 */}
              <div className="flex items-start gap-3">
                <div className="bg-amber-900 p-2.5 rounded-lg flex-shrink-0">
                  <ShoppingCart className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <span className="font-semibold text-gray-900">
                      New Product sold
                    </span>
                    <span className="text-green-600 font-semibold whitespace-nowrap">
                      + ₦15,000
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    "Vintage Leather Jacket"
                  </div>
                  <div className="text-sm text-gray-500 mt-1">2h ago</div>
                </div>
              </div>

              {/* Activity 2 */}
              <div className="flex items-start gap-3">
                <div className="bg-amber-900 p-2.5 rounded-lg flex-shrink-0">
                  <Hammer className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <span className="font-semibold text-gray-900">
                      New Bids on service
                    </span>
                    <span className="font-semibold text-gray-900 whitespace-nowrap">
                      ₦140,000
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    "Photoshoot Stylist"
                  </div>
                  <div className="text-sm text-gray-500 mt-1">1d ago</div>
                </div>
              </div>

              {/* Activity 3 */}
              <div className="flex items-start gap-3">
                <div className="bg-amber-900 p-2.5 rounded-lg flex-shrink-0">
                  <ShoppingBag className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <span className="font-semibold text-gray-900">
                      Product Purchased
                    </span>
                    <span className="text-red-600 font-semibold whitespace-nowrap">
                      - ₦35,000
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    "Organic Cotton Fabric"
                  </div>
                  <div className="text-sm text-gray-500 mt-1">2d ago</div>
                </div>
              </div>

              {/* Activity 4 */}
              <div className="flex items-start gap-3">
                <div className="bg-amber-900 p-2.5 rounded-lg flex-shrink-0">
                  <ShoppingCart className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <span className="font-semibold text-gray-900">
                      New Product Listed
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    "Handcrafted Silk Scarf"
                  </div>
                  <div className="text-sm text-gray-500 mt-1">3d ago</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

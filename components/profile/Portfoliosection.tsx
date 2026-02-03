/* eslint-disable @next/next/no-img-element */
"use client";
import { useState } from "react";
import { Pencil, Briefcase, Trash2 } from "lucide-react";
import { Portfolio } from "@/services/portfolioService";
import { Button } from "../ui/Button";

interface PortfolioSectionProps {
  portfolios: Portfolio[];
  isLoading: boolean;
  onAddPortfolio: () => void;
  onEditPortfolio: (portfolio: Portfolio) => void;
  onPortfolioClick: (portfolio: Portfolio) => void;
  onDeletePortfolio: (portfolio: Portfolio) => void;
}

export default function PortfolioSection({
  portfolios,
  isLoading,
  onAddPortfolio,
  onEditPortfolio,
  onPortfolioClick,
  onDeletePortfolio,
}: PortfolioSectionProps) {
  const [activeTab, setActiveTab] = useState("published");
  console.log(
    "onDeletePortfolio:",
    typeof onDeletePortfolio,
    onDeletePortfolio
  );

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Portfolio</h2>
          {portfolios.length > 0 && (
            <p className="text-sm text-gray-500 mt-1">
              {portfolios.length} portfolio{portfolios.length !== 1 ? "s" : ""}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={onAddPortfolio}
            className="w-10 h-10 bg-[#FAB75B] rounded-full flex items-center justify-center hover:bg-amber-500 transition-colors"
            aria-label="Add portfolio item"
          >
            <span className="text-white text-xl">+</span>
          </button>
        </div>
      </div>

      <div className="flex gap-4 mb-6 border-b">
        <button
          onClick={() => setActiveTab("published")}
          className={`pb-3 px-1 font-medium text-sm ${
            activeTab === "published"
              ? "text-gray-900 border-b-2 border-gray-900"
              : "text-gray-500"
          }`}
        >
          Published
        </button>
        <button
          onClick={() => setActiveTab("drafts")}
          className={`pb-3 px-1 font-medium text-sm ${
            activeTab === "drafts"
              ? "text-gray-900 border-b-2 border-gray-900"
              : "text-gray-500"
          }`}
        >
          Drafts
        </button>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="w-12 h-12 border-4 border-[#FAB75B] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-gray-500">Loading portfolio...</p>
        </div>
      ) : portfolios.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {portfolios.map((portfolio: Portfolio) => (
            <div
              key={portfolio.id}
              className="relative group cursor-pointer bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100"
              onClick={() => onPortfolioClick(portfolio)}
            >
              <div className="relative aspect-4/3 overflow-hidden bg-linear-to-br from-[#FAB75B] to-amber-500">
                {portfolio.Image && portfolio.Image.length > 0 ? (
                  <>
                    <img
                      src={
                        portfolio.Image.find((img) => img.is_primary)
                          ?.image_url || portfolio.Image[0].image_url
                      }
                      alt={portfolio.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {portfolio.Image.length > 1 && (
                      <div className="absolute top-3 right-3 bg-black/60 text-white text-xs px-2.5 py-1 rounded-full backdrop-blur-sm">
                        {portfolio.Image.length} images
                      </div>
                    )}
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Briefcase className="w-12 h-12 text-white/80" />
                  </div>
                )}
              </div>

              <div className="p-4 bg-white">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-base font-semibold text-gray-900 truncate flex-1">
                    {portfolio.title}
                  </h3>
                  <div className="flex gap-1 shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditPortfolio(portfolio);
                      }}
                      className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                      aria-label="Edit portfolio"
                    >
                      <Pencil className="w-4 h-4 text-gray-600" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeletePortfolio(portfolio);
                      }}
                      className="w-8 h-8 bg-red-50 rounded-full flex items-center justify-center hover:bg-red-100 transition-colors"
                      aria-label="Delete portfolio"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </div>
                {portfolio.description && (
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                    {portfolio.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 mb-4">No portfolio items yet</p>
          <Button onClick={onAddPortfolio}>
            Add your first portfolio item
          </Button>
        </div>
      )}
    </div>
  );
}

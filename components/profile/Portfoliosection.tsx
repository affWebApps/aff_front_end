"use client";
import { useState } from "react";
import Image from "next/image";
import { Star, Pencil, Briefcase } from "lucide-react";
import { Portfolio, PortfolioImage } from "@/services/portfolioService";
import { Button } from "../ui/Button";

interface PortfolioSectionProps {
  portfolio: Portfolio | null;
  isLoading: boolean;
  onAddPortfolio: () => void;
  onEditPortfolio: () => void;
  onPortfolioClick: (portfolio: Portfolio) => void;
}

export default function PortfolioSection({
  portfolio,
  isLoading,
  onAddPortfolio,
  onEditPortfolio,
  onPortfolioClick,
}: PortfolioSectionProps) {
  const [activeTab, setActiveTab] = useState("published");

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Portfolio</h2>
          {portfolio && portfolio.Image && portfolio.Image.length > 0 && (
            <p className="text-sm text-gray-500 mt-1">
              {portfolio.Image.length} image
              {portfolio.Image.length !== 1 ? "s" : ""} • {portfolio.title}
            </p>
          )}
          {portfolio && (!portfolio.Image || portfolio.Image.length === 0) && (
            <p className="text-sm text-gray-500 mt-1">
              {portfolio.title} • No images yet
            </p>
          )}
        </div>
        <div className="flex gap-2">
          {portfolio && (
            <button
              onClick={onEditPortfolio}
              className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
              aria-label="Edit portfolio"
            >
              <Pencil className="w-5 h-5 text-gray-700" />
            </button>
          )}
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
      ) : portfolio && portfolio.Image && portfolio.Image.length > 0 ? (
        <>
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">
              About this portfolio
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              {portfolio.description}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {portfolio.Image.map((image: PortfolioImage, index: number) => (
              <div key={image.id} className="group cursor-pointer">
                <div
                  className="relative aspect-square rounded-xl overflow-hidden mb-2 bg-gray-100"
                  onClick={() => onPortfolioClick(portfolio)}
                >
                  <Image
                    src={image.image_url}
                    alt={`${portfolio.title} - Image ${index + 1}`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                  />
                  {image.is_primary && (
                    <div className="absolute top-2 left-2 bg-[#FAB75B] text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                      <Star className="w-3 h-3 fill-current" />
                      Primary
                    </div>
                  )}
                </div>
                <p className="text-sm text-gray-700 font-medium">
                  {`Portfolio Item ${index + 1}`}
                </p>
              </div>
            ))}
          </div>
        </>
      ) : portfolio ? (
        <div className="text-center py-12">
          <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 mb-2">Portfolio created!</p>
          <p className="text-sm text-gray-400 mb-4">
            Add some images to showcase your work
          </p>
          <Button onClick={onEditPortfolio}>Add images to portfolio</Button>
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

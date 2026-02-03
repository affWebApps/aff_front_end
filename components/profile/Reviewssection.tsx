"use client";
import { Star } from "lucide-react";
import { Review } from "@/services/authServices";

interface ReviewsSectionProps {
  reviews: Review[];
  averageRating: string;
}

export default function ReviewsSection({
  reviews,
  averageRating,
}: ReviewsSectionProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Reviews</h2>
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-gray-900">
            {averageRating}
          </span>
          <div className="flex text-[#FAB75B]">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(Number(averageRating)) ? "fill-current" : ""
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      <p className="text-sm text-gray-500 mb-6">
        {reviews?.length || 0} Total reviews
      </p>

      {reviews && reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((review: Review, index: number) => (
            <div
              key={review.id || index}
              className="border-b pb-4 last:border-b-0"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center font-semibold text-amber-700">
                  {review.reviewer_name?.charAt(0) || "U"}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-gray-900">
                      {review.reviewer_name || "Anonymous"}
                    </h3>
                    <div className="flex text-[#FAB75B]">
                      {[...Array(review.rating || 0)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 mb-1">
                    {review.comment || "No comment"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {review.created_at
                      ? new Date(review.created_at).toLocaleDateString()
                      : "Date unknown"}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">No reviews yet</div>
      )}
    </div>
  );
}

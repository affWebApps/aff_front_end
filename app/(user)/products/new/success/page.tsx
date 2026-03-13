"use client";

import Image from "next/image";
import Link from "next/link";

export default function ProductSuccessPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">
      <div className="bg-white rounded-2xl shadow-md max-w-3xl w-full p-8 sm:p-10 text-center space-y-6">
        <div className="flex justify-center">
          <div className="relative w-20 h-20">
            <Image
              src="/images/checkmark-illustration.png"
              alt="Success"
              fill
              className="object-contain"
            />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Product Listed Successfully</h1>
          <p className="text-sm sm:text-base text-gray-600 max-w-xl mx-auto">
            Your product is now live in the marketplace. You can view it, manage inventory, or add another listing.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-3 max-w-xl mx-auto">
          <Link
            href="/products"
            className="w-full inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-800 hover:bg-gray-50 transition"
          >
            View My Products
          </Link>
          <Link
            href="/products/new"
            className="w-full inline-flex items-center justify-center rounded-lg bg-[#FBC57C] text-white px-4 py-3 text-sm font-semibold hover:bg-[#e9a548] transition"
          >
            List Another Product
          </Link>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-left space-y-2">
          <div className="text-sm font-semibold text-amber-900">What’s next?</div>
          <ul className="text-sm text-amber-900 space-y-1 list-disc list-inside">
            <li>Add more images or details from the product edit page.</li>
            <li>Set promotional pricing or publish to specific channels.</li>
            <li>Track orders and inventory from your dashboard.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

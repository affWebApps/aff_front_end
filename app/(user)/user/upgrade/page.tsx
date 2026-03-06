"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Zap, Crown, Star } from "lucide-react";

interface PlanFeature {
  text: string;
  included: boolean;
}

interface Plan {
  id: string;
  name: string;
  icon: React.ReactNode;
  monthlyPrice: number;
  yearlyPrice: number;
  description: string;
  features: PlanFeature[];
  cta: string;
  highlighted: boolean;
  badge?: string;
}

const plans: Plan[] = [
  {
    id: "free",
    name: "Free",
    icon: <Star size={22} />,
    monthlyPrice: 0,
    yearlyPrice: 0,
    description: "Perfect for getting started with African Fashion Fusion.",
    features: [
      { text: "Up to 3 active designs", included: true },
      { text: "Basic marketplace access", included: true },
      { text: "Community support", included: true },
      { text: "Standard profile listing", included: true },
      { text: "Priority support", included: false },
      { text: "Unlimited designs", included: false },
      { text: "Advanced analytics", included: false },
      { text: "Custom branding", included: false },
    ],
    cta: "Current Plan",
    highlighted: false,
  },
  {
    id: "pro",
    name: "Pro",
    icon: <Zap size={22} />,
    monthlyPrice: 12,
    yearlyPrice: 9,
    description:
      "For active designers and tailors scaling their business.",
    features: [
      { text: "Up to 3 active designs", included: true },
      { text: "Basic marketplace access", included: true },
      { text: "Community support", included: true },
      { text: "Standard profile listing", included: true },
      { text: "Priority support", included: true },
      { text: "Unlimited designs", included: true },
      { text: "Advanced analytics", included: false },
      { text: "Custom branding", included: false },
    ],
    cta: "Upgrade to Pro",
    highlighted: true,
    badge: "Most Popular",
  },
  {
    id: "premium",
    name: "Premium",
    icon: <Crown size={22} />,
    monthlyPrice: 29,
    yearlyPrice: 22,
    description:
      "Full power for established fashion professionals and studios.",
    features: [
      { text: "Up to 3 active designs", included: true },
      { text: "Basic marketplace access", included: true },
      { text: "Community support", included: true },
      { text: "Standard profile listing", included: true },
      { text: "Priority support", included: true },
      { text: "Unlimited designs", included: true },
      { text: "Advanced analytics", included: true },
      { text: "Custom branding", included: true },
    ],
    cta: "Upgrade to Premium",
    highlighted: false,
  },
];

export default function UpgradePage() {
  const [isYearly, setIsYearly] = useState(false);
  const router = useRouter();

  const getPrice = (plan: Plan) =>
    isYearly ? plan.yearlyPrice : plan.monthlyPrice;

  const handleUpgrade = (planId: string) => {
    router.push(`/user/upgrade/checkout?plan=${planId}&billing=${isYearly ? "yearly" : "monthly"}`);
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Page Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 bg-[#FAB75B]/15 border border-[#FAB75B]/30 rounded-full px-4 py-1.5 mb-4">
          <Zap size={14} className="text-[#FAB75B]" />
          <span className="text-[#6b4e3d] text-xs font-semibold font-poppins uppercase tracking-wider">
            Upgrade Your Plan
          </span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-[#3d2b1f] font-poppins mb-3">
          Unlock Your Full Potential
        </h1>
        <p className="text-gray-500 text-base max-w-xl mx-auto leading-relaxed">
          Choose the plan that fits your creative journey. Upgrade or downgrade
          at any time.
        </p>

        {/* Billing Toggle */}
        <div className="inline-flex items-center gap-3 mt-6 bg-white border border-gray-200 rounded-full p-1 shadow-sm">
          <button
            onClick={() => setIsYearly(false)}
            className={`px-5 py-2 rounded-full text-sm font-medium font-poppins transition-all duration-200 ${
              !isYearly
                ? "bg-[#6b4e3d] text-white shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setIsYearly(true)}
            className={`px-5 py-2 rounded-full text-sm font-medium font-poppins transition-all duration-200 ${
              isYearly
                ? "bg-[#6b4e3d] text-white shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Yearly
            <span className="ml-1.5 text-[11px] font-semibold text-[#FAB75B]">
              Save 25%
            </span>
          </button>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`relative flex flex-col rounded-2xl border transition-all duration-300 overflow-hidden
              ${
                plan.highlighted
                  ? "border-[#FAB75B] shadow-xl shadow-[#FAB75B]/20 scale-[1.02]"
                  : "border-gray-200 shadow-sm hover:shadow-md"
              }
              bg-white
            `}
          >
            {/* Badge */}
            {plan.badge && (
              <div className="absolute top-0 left-0 right-0 flex justify-center">
                <span className="bg-[#FAB75B] text-[#5a3d2f] text-[11px] font-bold font-poppins px-4 py-1 rounded-b-lg uppercase tracking-wide">
                  {plan.badge}
                </span>
              </div>
            )}

            {/* Card Header */}
            <div
              className={`p-6 ${plan.highlighted ? "pt-8" : ""} border-b border-gray-100`}
            >
              <div
                className={`inline-flex items-center justify-center w-10 h-10 rounded-xl mb-4
                ${plan.highlighted ? "bg-[#FAB75B] text-[#5a3d2f]" : "bg-[#6b4e3d]/10 text-[#6b4e3d]"}
              `}
              >
                {plan.icon}
              </div>
              <h2 className="text-lg font-bold text-[#3d2b1f] font-poppins mb-1">
                {plan.name}
              </h2>
              <p className="text-gray-500 text-sm leading-relaxed mb-4">
                {plan.description}
              </p>

              <div className="flex items-end gap-1">
                <span className="text-3xl font-bold text-[#3d2b1f] font-poppins">
                  {getPrice(plan) === 0 ? "Free" : `$${getPrice(plan)}`}
                </span>
                {getPrice(plan) > 0 && (
                  <span className="text-gray-400 text-sm mb-1">/mo</span>
                )}
              </div>
              {isYearly && plan.yearlyPrice > 0 && (
                <p className="text-xs text-gray-400 mt-1">
                  Billed as ${plan.yearlyPrice * 12}/year
                </p>
              )}
            </div>

            {/* Features */}
            <div className="p-6 flex-1">
              <ul className="space-y-3">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span
                      className={`shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5
                      ${
                        feature.included
                          ? "bg-[#FAB75B]/20 text-[#6b4e3d]"
                          : "bg-gray-100 text-gray-300"
                      }`}
                    >
                      <Check size={11} strokeWidth={3} />
                    </span>
                    <span
                      className={`text-sm font-poppins ${
                        feature.included ? "text-gray-700" : "text-gray-300"
                      }`}
                    >
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA */}
            <div className="p-6 pt-0">
              <button
                className={`w-full py-3 rounded-xl text-sm font-semibold font-poppins transition-all duration-200
                  ${
                    plan.highlighted
                      ? "bg-[#FAB75B] text-[#5a3d2f] hover:bg-[#E4A753] shadow-md hover:shadow-lg"
                      : plan.id === "free"
                      ? "bg-gray-100 text-gray-400 cursor-default"
                      : "bg-[#6b4e3d] text-white hover:bg-[#5a3d2f]"
                  }
                `}
                disabled={plan.id === "free"}
                onClick={plan.id !== "free" ? () => handleUpgrade(plan.id) : undefined}
              >
                {plan.cta}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Note */}
      <p className="text-center text-sm text-gray-400 mt-8 font-poppins">
        All plans include a{" "}
        <span className="font-semibold text-[#6b4e3d]">7-day free trial</span>.
        No credit card required to start. Cancel anytime.
      </p>
    </div>
  );
}

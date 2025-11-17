import React from "react";
import { Scissors, User, FileEdit, ShoppingBag } from "lucide-react";

export default function HowItWorks() {
  const clientSteps = [
    {
      icon: <FileEdit className="w-6 h-6" />,
      title: "Design Your Garment",
      description:
        "Use our interactive 2D design studio to create your custom outfit.",
    },
    {
      icon: <ShoppingBag className="w-6 h-6" />,
      title: "Customize & Preview",
      description: "Adjust fabrics, colors, and fit on a real-scale avatar.",
    },
    {
      icon: <Scissors className="w-6 h-6" />,
      title: "Hire a Tailor",
      description:
        "Post your design and get bids from skilled tailors worldwide.",
    },
  ];

  const tailorSteps = [
    {
      icon: <User className="w-6 h-6" />,
      title: "Create Your Tailor Profile",
      description:
        "Set up your professional profile with your specialties and experience.",
    },
    {
      icon: <FileEdit className="w-6 h-6" />,
      title: "Browse & Bid on Projects",
      description:
        "Find design projects that fit your skills and place competitive bids.",
    },
    {
      icon: <ShoppingBag className="w-6 h-6" />,
      title: "Deliver & Get Paid",
      description:
        "Craft quality garments, delight your clients, and grow your business.",
    },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br py-16 px-4 mt-48">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-12 bg-amber-600"></div>
            <span className="text-amber-700 font-medium">How it Works</span>
            <div className="h-px w-12 bg-amber-600"></div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            From idea to outfit in just a few steps.
          </h1>
          <p className="text-gray-600 text-lg">
            Design, customize, and connect as a client, designer, or tailor all
            in seamless flows
          </p>
        </div>

        {/* For Clients/Designers Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            For Clients/Designers
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {clientSteps.map((step, index) => (
              <div
                key={index}
                className="bg-[#FAF6F0] text-gray-900 rounded-2xl p-8 shadow-sm transition-all duration-300 cursor-pointer hover:bg-[#5C4033] hover:text-white hover:scale-105 hover:shadow-lg group"
              >
                <div className="bg-[#FCCF91] w-14 h-14 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <div className="text-[#5C4033]">{step.icon}</div>
                </div>
                <h3 className="text-xl font-bold mb-3 group-hover:text-white transition-colors duration-300">
                  {step.title}
                </h3>
                <p className="text-gray-600 group-hover:text-white transition-colors duration-300">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* For Tailors Section */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-8">For Tailors</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {tailorSteps.map((step, index) => (
              <div
                key={index}
                className="bg-[#FAF6F0] rounded-2xl p-8 shadow-sm transition-all duration-300 cursor-pointer hover:bg-[#5C4033] hover:text-white group hover:scale-105 hover:shadow-lg"
              >
                <div className="bg-[#FCCF91] w-14 h-14 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <div className="text-[#5C4033]">{step.icon}</div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-white transition-colors duration-300">
                  {step.title}
                </h3>
                <p className="text-gray-600 group-hover:text-white transition-colors duration-300">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

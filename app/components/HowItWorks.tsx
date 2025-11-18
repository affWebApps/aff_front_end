"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
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

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const headerVariants: Variants = {
    hidden: { opacity: 0, y: -30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
      },
    },
  };

  const sectionTitleVariants: Variants = {
    hidden: { opacity: 0, x: -30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  return (
    <div className="min-h-screen bg-linear-to-br py-16 px-4 mt-48 relative z-10">
      {" "}
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={headerVariants}
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-12 bg-[#B28241]"></div>
            <span className="homeH5">How it Works</span>
            <div className="h-px w-12 bg-[#B28241]"></div>
          </div>
          <h1 className="homeH2 mb-4">
            From idea to outfit in just a few steps.
          </h1>
          <p className="text-gray-600 lg:text-lg">
            Design, customize, and connect as a client, designer, or tailor all
            in seamless flows
          </p>
        </motion.div>

        {/* For Clients/Designers Section */}
        <motion.div
          className="mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerVariants}
        >
          <motion.h2
            className="lg:text-2xl lg:font-bold font-bold  text-gray-900 mb-8"
            variants={sectionTitleVariants}
          >
            For Clients/Designers
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-6">
            {clientSteps.map((step, index) => (
              <motion.div
                key={index}
                variants={cardVariants}
                className="bg-[#FAF6F0] text-gray-900 rounded-2xl p-8 shadow-sm transition-all duration-300 cursor-pointer hover:bg-[#5C4033] hover:text-white hover:scale-105 hover:shadow-lg group"
              >
                <div className="bg-[#FCCF91] w-14 h-14 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <div className="text-[#5C4033]">{step.icon}</div>
                </div>
                <h3 className="lg:text-xl lg:font-bold text-normal font-semibold mb-3 group-hover:text-white transition-colors duration-300">
                  {step.title}
                </h3>
                <p className="text-gray-600 group-hover:text-white transition-colors duration-300">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* For Tailors Section */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerVariants}
        >
          <motion.h2
            className="lg:text-2xl lg:font-bold font-bold  text-gray-900 mb-8"
            variants={sectionTitleVariants}
          >
            For Tailors
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-6">
            {tailorSteps.map((step, index) => (
              <motion.div
                key={index}
                variants={cardVariants}
                className="bg-[#FAF6F0] rounded-2xl p-8 shadow-sm transition-all duration-300 cursor-pointer hover:bg-[#5C4033] hover:text-white group hover:scale-105 hover:shadow-lg"
              >
                <div className="bg-[#FCCF91] w-14 h-14 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <div className="text-[#5C4033]">{step.icon}</div>
                </div>
                <h3 className="lg:text-xl lg:font-bold text-normal font-semibold text-gray-900 mb-3 group-hover:text-white transition-colors duration-300">
                  {step.title}
                </h3>
                <p className="text-gray-600 group-hover:text-white transition-colors duration-300">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

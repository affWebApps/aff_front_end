"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, Variants } from "framer-motion";
import { Palette, Ruler, Package, Briefcase, Download } from "lucide-react";

export default function FeaturesSection() {
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      icon: <Palette className="w-6 h-6" />,
      title: "2D Design Studio",
      description:
        "Mix and match sleeves, collars, and garment blocks using our 2D editor. Visualize your creations and make real-time adjustments with simple drag-and-drop tools.",
    },
    {
      icon: <Ruler className="w-6 h-6" />,
      title: "Parametric Measurements",
      description:
        "Input precise measurements for custom-fitted garments. Our intelligent system ensures perfect fit every time.",
    },
    {
      icon: <Package className="w-6 h-6" />,
      title: "Fabric & Pattern Library",
      description:
        "Access thousands of fabrics and patterns. Browse, preview, and select materials that bring your designs to life.",
    },
    {
      icon: <Briefcase className="w-6 h-6" />,
      title: "Designer-Tailor Marketplace",
      description:
        "Connect with skilled tailors worldwide. Post projects, receive bids, and collaborate seamlessly from design to delivery.",
    },
    {
      icon: <Download className="w-6 h-6" />,
      title: "Export Options",
      description:
        "Export your designs in multiple formats. Share specifications with tailors or save for future reference.",
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

  const featureItemVariants: Variants = {
    hidden: { opacity: 0, x: -30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  const imageVariants: Variants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.7,
      },
    },
  };

  return (
    <div className="min-h-screen py-16 px-4 bg-gray-50">
      <motion.div
        className="max-w-7xl mx-auto"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={containerVariants}
      >
        {/* Header */}
        <motion.div className="mb-16" variants={headerVariants}>
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px w-12 bg-[#B28241]"></div>
            <span className="homeH5">Features</span>
            <div className="h-px w-12 bg-[#B28241]"></div>
          </div>
          <h1 className="homeH2 mb-4">Discover what sets AFF apart</h1>
          <p className="text-gray-600 lg:text-lg max-w-2xl">
            Discover the tools that make designing, and collaborating effortless
            for both designers and tailors.
          </p>
        </motion.div>

        {/* Features Layout */}
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Side - Feature List */}
          <div className="space-y-4">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={featureItemVariants}
                onClick={() => setActiveFeature(index)}
                className={`flex items-start gap-4 p-6 rounded-xl cursor-pointer transition-all duration-300 border-b border-amber-200 ${
                  activeFeature === index
                    ? "bg-white shadow-md "
                    : "bg-transparent hover:bg-white/50"
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 transition-colors duration-300 ${
                    activeFeature === index
                      ? "bg-amber-600 text-white"
                      : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {feature.icon}
                </div>
                <div>
                  <h3 className="lg:text-xl text-lg lg:font-bold font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  {activeFeature === index && (
                    <p className="text-gray-600 text-sm lg:text-[15px]">
                      {feature.description}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Right Side - Image */}
          <motion.div className="sticky top-8" variants={imageVariants}>
            <div className="rounded-3xl overflow-hidden shadow-xl bg-linear-to-br from-amber-50 to-orange-50 h-full">
              <Image
                src="/images/features-img.jpg"
                alt="Designer working on fashion designs"
                width={800}
                height={600}
                className="w-full h-full object-cover"
                priority
              />
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

"use client";
import React, { useState, useEffect } from "react";
import { motion, Variants } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function TestimonialSection() {
  const [activeSlide, setActiveSlide] = useState(0);

  const testimonials = [
    {
      id: 1,
      quote:
        "AFF Designer helped me bring my sketches to life! The 2D design studio makes it so easy to visualize and adjust every detail before sending it to a tailor. It's like having a mini fashion lab right on my laptop.",
      name: "Farmer Motun",
      title: "Independent Fashion Designer, Lagos",
      avatar: "/api/placeholder/80/80",
    },
    {
      id: 2,
      quote:
        "The precision and ease of use are unmatched. I can iterate on designs quickly and communicate exactly what I want to my production team.",
      name: "John Smith",
      title: "Fashion Designer, New York",
      avatar: "/api/placeholder/80/80",
    },
    {
      id: 3,
      quote:
        "This tool has revolutionized my workflow. What used to take hours now takes minutes, and the results are always professional.",
      name: "Sarah Johnson",
      title: "Tailor & Designer, London",
      avatar: "/api/placeholder/80/80",
    },
  ];

  // Auto-slide functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [testimonials.length]);

  const nextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setActiveSlide(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
      },
    },
  };

  return (
    <motion.section
      className="bg-gray-50 py-12 lg:py-20 px-4 sm:px-6 lg:px-8"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={containerVariants}
    >
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.h2
          className="text-3xl lg:text-4xl font-bold text-center text-gray-800 mb-12 lg:mb-16 homeH2"
          variants={itemVariants}
        >
          Trusted by Designers and Tailors
          <span className="lg:inline "> Everywhere</span>
        </motion.h2>

        {/* Testimonial Card */}
        <motion.div
          className="relative bg-white rounded-2xl shadow-lg p-8 lg:p-12 mx-auto max-w-4xl"
          variants={itemVariants}
        >
          {/* Navigation Arrows - Desktop */}
          <button
            onClick={prevSlide}
            className="hidden lg:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-20 w-12 h-12 bg-white rounded-full shadow-lg items-center justify-center hover:bg-gray-50 transition-colors z-10"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-6 h-6 text-gray-600" />
          </button>

          <button
            onClick={nextSlide}
            className="hidden lg:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-20 w-12 h-12 bg-white rounded-full shadow-lg items-center justify-center hover:bg-gray-50 transition-colors z-10"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-6 h-6 text-gray-600" />
          </button>

          {/* Quote Icon Top */}
          <div className="text-amber-800 text-4xl lg:text-5xl mb-4 lg:mb-6">
            ❝
          </div>

          {/* Testimonial Content */}
          <motion.div
            key={activeSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-gray-700 text-base lg:text-lg leading-relaxed mb-6 lg:mb-8 text-center lg:text-left">
              {testimonials[activeSlide].quote}
            </p>
          </motion.div>

          {/* Quote Icon Bottom */}
          <div className="text-amber-800 text-4xl lg:text-5xl text-right mb-6 lg:mb-8">
            ❞
          </div>

          {/* Author Info */}
          <div className="flex items-center justify-center gap-4">
            <div className="w-14 h-14 lg:w-16 lg:h-16 rounded-full bg-gray-300 overflow-hidden shrink-0">
              <div className="w-full h-full bg-linear-to-br from-amber-200 to-amber-400 flex items-center justify-center text-2xl font-bold text-amber-800">
                {testimonials[activeSlide].name.charAt(0)}
              </div>
            </div>
            <div className="text-left">
              <h4 className="font-semibold text-gray-900 text-base lg:text-lg">
                {testimonials[activeSlide].name}
              </h4>
              <p className="text-sm lg:text-base text-gray-600">
                {testimonials[activeSlide].title}
              </p>
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-8 lg:mt-10">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveSlide(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === activeSlide ? "w-8 bg-amber-600" : "w-2 bg-gray-300"
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </motion.div>

        {/* Mobile Navigation Arrows */}
        <motion.div
          className="flex lg:hidden justify-center gap-4 mt-6"
          variants={itemVariants}
        >
          <button
            onClick={prevSlide}
            className="w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <button
            onClick={nextSlide}
            className="w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </motion.div>
      </div>
    </motion.section>
  );
}

"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "./ui/Button";

export default function FashionGallery() {
  const desktopImages = [
    {
      id: 1,
      span: "row-span-2",
      position: "col-start-1 row-start-1",
      image:
        "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&h=600&fit=crop",
    },
    {
      id: 2,
      span: "row-span-2",
      position: "col-start-1 row-start-3",
      image:
        "https://images.unsplash.com/photo-1558769132-cb1aea6c6e7d?w=400&h=600&fit=crop",
    },
    {
      id: 3,
      span: "row-span-2",
      position: "col-start-2 row-start-1",
      image:
        "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=500&fit=crop",
    },
    {
      id: 4,
      span: "row-span-2",
      position: "col-start-2 row-start-3",
      image:
        "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&h=500&fit=crop",
    },
    {
      id: 5,
      span: "row-span-2",
      position: "col-start-2 row-start-5",
      image:
        "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=600&fit=crop",
    },
    {
      id: 6,
      span: "row-span-5",
      position: "col-start-3 row-start-2",
      image:
        "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=400&h=800&fit=crop",
    },
    {
      id: 7,
      span: "row-span-6",
      position: "col-start-4 row-start-1",
      image:
        "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=800&fit=crop",
    },
    {
      id: 8,
      span: "row-span-5",
      position: "col-start-5 row-start-2",
      image:
        "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=800&fit=crop",
    },
    {
      id: 9,
      span: "row-span-2",
      position: "col-start-6 row-start-1",
      image:
        "https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?w=400&h=500&fit=crop",
    },
    {
      id: 10,
      span: "row-span-2",
      position: "col-start-6 row-start-3",
      image:
        "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=600&fit=crop",
    },
    {
      id: 11,
      span: "row-span-2",
      position: "col-start-6 row-start-5",
      image:
        "https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=500&fit=crop",
    },
    {
      id: 12,
      span: "row-span-2",
      position: "col-start-7 row-start-1",
      image:
        "https://images.unsplash.com/photo-1470309864661-68328b2cd0a5?w=400&h=600&fit=crop",
    },
    {
      id: 13,
      span: "row-span-3",
      position: "col-start-7 row-start-3",
      image:
        "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&h=700&fit=crop",
    },
  ];

  const images = [
    "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&h=600&fit=crop",
    "https://images.unsplash.com/photo-1558769132-cb1aea6c6e7d?w=400&h=600&fit=crop",
    "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=500&fit=crop",
    "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&h=500&fit=crop",
    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=600&fit=crop",
    "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=400&h=800&fit=crop",
    "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=800&fit=crop",
    "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=800&fit=crop",
    "https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?w=400&h=500&fit=crop",
    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=600&fit=crop",
    "https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=500&fit=crop",
  ];

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 },
  };

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  return (
    <div className="bg-[#FAF6F0] py-12 px-4 lg:py-20">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-12 lg:mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            hidden: {},
            visible: {
              transition: { staggerChildren: 0.15 },
            },
          }}
        >
          <motion.div
            className="flex items-center justify-center gap-3 mb-4"
            variants={fadeInUp}
            transition={{ duration: 0.5 }}
          >
            <div className="h-px w-12 bg-[#B28241]"></div>
            <span className="homeH5">Gallery</span>
            <div className="h-px w-12 bg-[#B28241]"></div>
          </motion.div>

          <motion.h2
            className="homeH2 mb-4 "
            variants={fadeInUp}
            transition={{ duration: 0.5 }}
          >
            See What Others Are Creating
          </motion.h2>

          <motion.p
            className="text-base lg:text-lg text-gray-600 max-w-2xl mx-auto"
            variants={fadeInUp}
            transition={{ duration: 0.5 }}
          >
            Discover inspiring designs and real projects from talented creators
            across the AFF Designer community.
          </motion.p>
        </motion.div>

        {/* Mobile Grid - 3 columns, staggered bento-style */}
        <motion.div
          className="grid grid-cols-3 gap-3 mb-12 lg:hidden"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={containerVariants}
        >
          {/* Column 1 */}
          <div className="flex flex-col gap-3">
            <motion.div
              className="rounded-3xl overflow-hidden shadow-md aspect-[3/4] border-4 border-amber-600"
              variants={fadeInUp}
              transition={{ duration: 0.4 }}
            >
              <img
                src={images[0]}
                alt="Fashion design 1"
                className="w-full h-full object-cover"
              />
            </motion.div>
            <motion.div
              className="rounded-3xl overflow-hidden shadow-md aspect-square border-4 border-amber-600"
              variants={fadeInUp}
              transition={{ duration: 0.4 }}
            >
              <img
                src={images[3]}
                alt="Fashion design 4"
                className="w-full h-full object-cover"
              />
            </motion.div>
            <motion.div
              className="rounded-3xl overflow-hidden shadow-md aspect-[3/4] border-4 border-amber-600"
              variants={fadeInUp}
              transition={{ duration: 0.4 }}
            >
              <img
                src={images[6]}
                alt="Fashion design 7"
                className="w-full h-full object-cover"
              />
            </motion.div>
            <motion.div
              className="rounded-3xl overflow-hidden shadow-md aspect-square border-4 border-amber-600"
              variants={fadeInUp}
              transition={{ duration: 0.4 }}
            >
              <img
                src={images[9]}
                alt="Fashion design 10"
                className="w-full h-full object-cover"
              />
            </motion.div>
          </div>

          {/* Column 2 - Center, taller images */}
          <div className="flex flex-col gap-3">
            <motion.div
              className="rounded-3xl overflow-hidden shadow-md aspect-[3/5] border-4 border-amber-600"
              variants={fadeInUp}
              transition={{ duration: 0.4 }}
            >
              <img
                src={images[1]}
                alt="Fashion design 2"
                className="w-full h-full object-cover"
              />
            </motion.div>
            <motion.div
              className="rounded-3xl overflow-hidden shadow-md aspect-[2/3] border-4 border-amber-600"
              variants={fadeInUp}
              transition={{ duration: 0.4 }}
            >
              <img
                src={images[4]}
                alt="Fashion design 5"
                className="w-full h-full object-cover"
              />
            </motion.div>
            <motion.div
              className="rounded-3xl overflow-hidden shadow-md aspect-[3/5] border-4 border-amber-600"
              variants={fadeInUp}
              transition={{ duration: 0.4 }}
            >
              <img
                src={images[7]}
                alt="Fashion design 8"
                className="w-full h-full object-cover"
              />
            </motion.div>
          </div>

          {/* Column 3 */}
          <div className="flex flex-col gap-3">
            <motion.div
              className="rounded-3xl overflow-hidden shadow-md aspect-square border-4 border-amber-600"
              variants={fadeInUp}
              transition={{ duration: 0.4 }}
            >
              <img
                src={images[2]}
                alt="Fashion design 3"
                className="w-full h-full object-cover"
              />
            </motion.div>
            <motion.div
              className="rounded-3xl overflow-hidden shadow-md aspect-[3/4] border-4 border-amber-600"
              variants={fadeInUp}
              transition={{ duration: 0.4 }}
            >
              <img
                src={images[5]}
                alt="Fashion design 6"
                className="w-full h-full object-cover"
              />
            </motion.div>
            <motion.div
              className="rounded-3xl overflow-hidden shadow-md aspect-square border-4 border-amber-600"
              variants={fadeInUp}
              transition={{ duration: 0.4 }}
            >
              <img
                src={images[8]}
                alt="Fashion design 9"
                className="w-full h-full object-cover"
              />
            </motion.div>
            <motion.div
              className="rounded-3xl overflow-hidden shadow-md aspect-[3/4] border-4 border-amber-600"
              variants={fadeInUp}
              transition={{ duration: 0.4 }}
            >
              <img
                src={images[10]}
                alt="Fashion design 11"
                className="w-full h-full object-cover"
              />
            </motion.div>
          </div>
        </motion.div>

        {/* Desktop Grid */}
        <motion.div
          className="hidden lg:grid grid-cols-7 gap-3 auto-rows-[120px] mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          {desktopImages.map((item) => (
            <motion.div
              key={item.id}
              className={`${item.span} ${item.position} rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] cursor-pointer border-2 border-amber-600`}
              variants={fadeInUp}
              transition={{ duration: 0.5 }}
            >
              <img
                src={item.image}
                alt={`Fashion design ${item.id}`}
                className="w-full h-full object-cover"
              />
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Button */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Button size="large" className="mx-auto">
            Explore more
          </Button>
        </motion.div>
      </div>
    </div>
  );
}

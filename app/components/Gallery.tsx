"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "./ui/Button";
import Image from "next/image";

interface DesktopImage {
  id: number;
  span: string;
  position: string;
  image: string;
  marginTop?: string;
}

export default function FashionGallery() {
  const desktopImages: DesktopImage[] = [
    {
      id: 1,
      span: "row-span-1",
      position: "col-start-1 row-start-1",
      image: "/images/exl.jpg",
    },
    {
      id: 2,
      span: "row-span-2",
      position: "col-start-1 row-start-2",
      image: "/images/exl2.jpg",
    },
    {
      id: 3,
      span: "row-span-1",
      position: "col-start-2 row-start-1",
      image: "/images/l1.jpg",
      marginTop: "mt-16",
    },
    {
      id: 4,
      span: "row-span-1",
      position: "col-start-2 row-start-2",
      image: "/images/l2.jpg",
    },
    {
      id: 5,
      span: "row-span-1",
      position: "col-start-2 row-start-3",
      image: "/images/l3.jpg",
    },
    {
      id: 6,
      span: "row-span-3",
      position: "col-start-3 row-start-1",
      image: "/images/midl.jpg",
      marginTop: "mt-8",
    },
    {
      id: 7,
      span: "row-span-3",
      position: "col-start-4 row-start-1",
      image: "/images/mid1.png",
    },
    {
      id: 8,
      span: "row-span-3",
      position: "col-start-5 row-start-1",
      image: "/images/midr.png",
      marginTop: "mt-12",
    },
    {
      id: 9,
      span: "row-span-1",
      position: "col-start-6 row-start-1",
      image: "/images/r1.jpg",
      marginTop: "mt-20",
    },
    {
      id: 10,
      span: "row-span-1",
      position: "col-start-6 row-start-2",
      image: "/images/r2.jpg",
    },
    {
      id: 11,
      span: "row-span-1",
      position: "col-start-6 row-start-3",
      image: "/images/r3.jpg",
    },
    {
      id: 12,
      span: "row-span-1",
      position: "col-start-7 row-start-1",
      image: "/images/exr.jpg",
      marginTop: "mt-8",
    },
    {
      id: 13,
      span: "row-span-2",
      position: "col-start-7 row-start-2",
      image: "/images/ex-r2.jpg",
    },
  ];

  const images = [
    "/images/r1.jpg",
    "/images/midl.jpg",
    "/images/l1.jpg",
    "/images/exl.jpg",
    "/images/mid1.png",
    "/images/exr.jpg",
    "/images/exl2.jpg",
    "/images/midr.png",
    "/images/r2.jpg",
    "/images/r2.jpg",
    "/images/l2.jpg",
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
              className="rounded-3xl overflow-hidden shadow-md aspect-3/4 border-2 border-[#FAB75B]"
              variants={fadeInUp}
              transition={{ duration: 0.4 }}
            >
              <Image
                src={images[0]}
                alt="Fashion design 1"
                width={300}
                height={400}
                className="w-full h-full object-cover"
              />
            </motion.div>
            <motion.div
              className="rounded-3xl overflow-hidden shadow-md aspect-square border-2 border-[#FAB75B]"
              variants={fadeInUp}
              transition={{ duration: 0.4 }}
            >
              <Image
                src={images[3]}
                alt="Fashion design 4"
                width={300}
                height={300}
                className="w-full h-full object-cover"
              />
            </motion.div>
            <motion.div
              className="rounded-3xl overflow-hidden shadow-md aspect-3/4 border-2 border-[#FAB75B]"
              variants={fadeInUp}
              transition={{ duration: 0.4 }}
            >
              <Image
                src={images[6]}
                alt="Fashion design 7"
                width={300}
                height={400}
                className="w-full h-full object-cover"
              />
            </motion.div>
            <motion.div
              className="rounded-3xl overflow-hidden shadow-md aspect-square border-2 border-[#FAB75B]"
              variants={fadeInUp}
              transition={{ duration: 0.4 }}
            >
              <Image
                src={images[9]}
                alt="Fashion design 10"
                width={300}
                height={300}
                className="w-full h-full object-cover"
              />
            </motion.div>
          </div>

          {/* Column 2 - Center, taller images */}
          <div className="flex flex-col gap-3">
            <motion.div
              className="rounded-3xl overflow-hidden shadow-md aspect-3/5 border-2 border-[#FAB75B]"
              variants={fadeInUp}
              transition={{ duration: 0.4 }}
            >
              <Image
                src={images[1]}
                alt="Fashion design 2"
                width={300}
                height={500}
                className="w-full h-full object-cover"
              />
            </motion.div>
            <motion.div
              className="rounded-3xl overflow-hidden shadow-md aspect-2/3 border-2 border-[#FAB75B]"
              variants={fadeInUp}
              transition={{ duration: 0.4 }}
            >
              <Image
                src={images[4]}
                alt="Fashion design 5"
                width={300}
                height={450}
                className="w-full h-full object-cover"
              />
            </motion.div>
            <motion.div
              className="rounded-3xl overflow-hidden shadow-md aspect-3/5 border-2 border-[#FAB75B]"
              variants={fadeInUp}
              transition={{ duration: 0.4 }}
            >
              <Image
                src={images[7]}
                alt="Fashion design 8"
                width={300}
                height={500}
                className="w-full h-full object-cover"
              />
            </motion.div>
          </div>

          {/* Column 3 */}
          <div className="flex flex-col gap-3">
            <motion.div
              className="rounded-3xl overflow-hidden shadow-md aspect-square border-2 border-[#FAB75B]"
              variants={fadeInUp}
              transition={{ duration: 0.4 }}
            >
              <Image
                src={images[2]}
                alt="Fashion design 3"
                width={300}
                height={300}
                className="w-full h-full object-cover"
              />
            </motion.div>
            <motion.div
              className="rounded-3xl overflow-hidden shadow-md aspect-3/4 border-2 border-[#FAB75B]"
              variants={fadeInUp}
              transition={{ duration: 0.4 }}
            >
              <Image
                src={images[5]}
                alt="Fashion design 6"
                width={300}
                height={400}
                className="w-full h-full object-cover"
              />
            </motion.div>
            <motion.div
              className="rounded-3xl overflow-hidden shadow-md aspect-square border-2 border-[#FAB75B]"
              variants={fadeInUp}
              transition={{ duration: 0.4 }}
            >
              <Image
                src={images[8]}
                alt="Fashion design 9"
                width={300}
                height={300}
                className="w-full h-full object-cover"
              />
            </motion.div>
            <motion.div
              className="rounded-3xl overflow-hidden shadow-md aspect-3/4 border-2 border-[#FAB75B]"
              variants={fadeInUp}
              transition={{ duration: 0.4 }}
            >
              <Image
                src={images[10]}
                alt="Fashion design 11"
                width={300}
                height={400}
                className="w-full h-full object-cover"
              />
            </motion.div>
          </div>
        </motion.div>

        {/* Desktop Grid */}
        <motion.div
          className="hidden lg:grid grid-cols-7 gap-2 auto-rows-[200px] mb-16 max-w-5xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          {desktopImages.map((item) => (
            <motion.div
              key={item.id}
              className={`${item.span} ${item.position} ${
                item.marginTop || ""
              } rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] cursor-pointer border-2 border-[#FAB75B]`}
              variants={fadeInUp}
              transition={{ duration: 0.5 }}
            >
              <Image
                src={item.image}
                alt={`Fashion design ${item.id}`}
                width={400}
                height={600}
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

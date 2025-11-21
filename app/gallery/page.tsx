"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import HomeLayout from "../(home)/layout";
import { CustomSelect } from "../components/CustomSelect";
import { Pagination } from "../components/ui/Pagination";
import { BackButton } from "../components/ui/BackNavigation";
import Image from "next/image";
import { DesignModal } from "../components/modals/DesignModal";

interface Design {
  id: number;
  title: string;
  image: string;
  designer: string;
  location: string;
  garmentType: string;
  fabric: string;
  colorTheme: string;
  description: string;
  likes: number;
  comments: number;
}

const FashionShowcase = () => {
  const [selectedItem, setSelectedItem] = useState<Design | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [garmentType, setGarmentType] = useState("");
  const [fabricType, setFabricType] = useState("");
  const [sortBy, setSortBy] = useState("");

  const designs: Design[] = [
    {
      id: 1,
      title: "Maxi Ankara Dress",
      image: "/images/gal3.jpg",
      designer: "Amaka Eze",
      location: "Lagos, Nigeria",
      garmentType: "Dress",
      fabric: "Silk Blend",
      colorTheme: "Cream + Gold",
      description:
        "Elegant evening wear with traditional African-inspired layering",
      likes: 234,
      comments: 45,
    },
    {
      id: 2,
      title: "Maxi Dress",
      image: "/images/gal1.jpg",
      designer: "Chioma Okafor",
      location: "Abuja, Nigeria",
      garmentType: "Dress",
      fabric: "Silk",
      colorTheme: "Brown + Gold",
      description: "Luxurious sequined gown with dramatic bell sleeves",
      likes: 456,
      comments: 78,
    },
    {
      id: 3,
      title: "Backless layered dress",
      image: "/images/gal2.jpg",
      designer: "Ngozi Adewale",
      location: "Lagos, Nigeria",
      garmentType: "Dress",
      fabric: "Cotton Blend",
      colorTheme: "Red + Floral",
      description: "Contemporary backless design with asymmetric layering",
      likes: 189,
      comments: 32,
    },
    {
      id: 4,
      title: "Two-piece pants Ankara",
      image: "/images/gal3.jpg",
      designer: "Folake Johnson",
      location: "Ibadan, Nigeria",
      garmentType: "Two-piece",
      fabric: "Ankara Print",
      colorTheme: "Multi-color",
      description: "Vibrant ankara print blazer and pants set",
      likes: 312,
      comments: 56,
    },
    {
      id: 5,
      title: "African Agbada attire",
      image: "/images/gal1.jpg",
      designer: "Ibrahim Musa",
      location: "Kano, Nigeria",
      garmentType: "Traditional",
      fabric: "Striped Cotton",
      colorTheme: "Blue + White",
      description: "Traditional striped agbada with intricate embroidery",
      likes: 267,
      comments: 41,
    },
    {
      id: 6,
      title: "Edo Men Traditional attire",
      image: "/images/gal2.jpg",
      designer: "Osaze Igiebor",
      location: "Benin City, Nigeria",
      garmentType: "Traditional",
      fabric: "Cotton",
      colorTheme: "White + Red",
      description: "Classic Edo traditional wear with coral beads",
      likes: 198,
      comments: 29,
    },
    {
      id: 7,
      title: "Stylish ankara dress",
      image: "/images/gal1.jpg",
      designer: "Ada Nwankwo",
      location: "Enugu, Nigeria",
      garmentType: "Dress",
      fabric: "Ankara Print",
      colorTheme: "Multi-color",
      description: "Vibrant ankara mini dress with bell sleeves",
      likes: 421,
      comments: 67,
    },
    {
      id: 8,
      title: "Two-piece pants Corporate",
      image: "/images/gal3.jpg",
      designer: "Tunde Bakare",
      location: "Lagos, Nigeria",
      garmentType: "Suit",
      fabric: "Wool Blend",
      colorTheme: "Beige + Grey",
      description: "Modern corporate attire with relaxed fit",
      likes: 156,
      comments: 23,
    },
    {
      id: 9,
      title: "Complete men suit",
      image: "/images/gal1.jpg",
      designer: "Chike Okonkwo",
      location: "Port Harcourt, Nigeria",
      garmentType: "Suit",
      fabric: "Wool",
      colorTheme: "Black",
      description: "Classic tailored three-piece suit",
      likes: 289,
      comments: 38,
    },
  ];

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };

  const fadeInDown = {
    hidden: { opacity: 0, y: -30 },
    visible: { opacity: 1, y: 0 },
  };

  const openModal = (design: Design) => {
    setSelectedItem(design);
  };

  const closeModal = () => {
    setSelectedItem(null);
  };

  return (
    <HomeLayout>
      <div className="min-h-screen bg-linear-to-b from-orange-50 to-white">
        <div className="container mx-auto px-4 py-8">
          {/* Back Button */}
          <BackButton />

          {/* Header */}
          <motion.h1
            className="homeH1 text-center mb-4 text-[#543A2E]"
            initial="hidden"
            animate="visible"
            variants={fadeInDown}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            See What Others Are <span className="text-[#FAB75B]">Creating</span>
          </motion.h1>

          <motion.p
            className="text-gray-600 text-center max-w-2xl mx-auto mb-8"
            initial="hidden"
            animate="visible"
            variants={fadeInDown}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          >
            Explore stunning designs and real projects from our community of
            designers and tailors around the world.
          </motion.p>

          {/* Search Bar */}
          <motion.div
            className="max-w-4xl mx-auto mb-6"
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search designs, designers, styles..."
                className="w-full pl-12 pr-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FAB75B] focus:border-transparent"
              />
            </div>
          </motion.div>

          {/* Filters */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 max-w-4xl mx-auto mb-8 justify-end"
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
          >
            <div className="w-full sm:w-48">
              <CustomSelect
                value={garmentType}
                onChange={setGarmentType}
                placeholder="All Garments"
                options={["Dresses", "Suits", "Traditional", "Two-piece"]}
              />
            </div>
            <div className="w-full sm:w-48">
              <CustomSelect
                value={fabricType}
                onChange={setFabricType}
                placeholder="All Fabrics"
                options={["Silk", "Cotton", "Ankara", "Wool Blend"]}
              />
            </div>
            <div className="w-full sm:w-48">
              <CustomSelect
                value={sortBy}
                onChange={setSortBy}
                placeholder="Latest"
                options={["Most Popular", "Trending", "Most Liked"]}
              />
            </div>
          </motion.div>

          {/* Grid */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 max-w-7xl mx-auto"
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
          >
            {designs.map((design) => (
              <div
                key={design.id}
                onClick={() => openModal(design)}
                className="group cursor-pointer bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
              >
                <div className="aspect-3/4 overflow-hidden bg-gray-100">
                  <Image
                    src={design.image}
                    alt={design.title}
                    width={400}
                    height={533}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 text-lg mb-1">
                    {design.title}
                  </h3>
                  <p className="text-sm text-gray-600">by {design.designer}</p>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={3}
            onPageChange={setCurrentPage}
          />
        </div>

        {/* Modal */}
        <DesignModal 
          isOpen={!!selectedItem}
          onClose={closeModal}
          design={selectedItem}
        />
      </div>
    </HomeLayout>
  );
};

export default FashionShowcase;

"use client";
import { motion } from "framer-motion";
import HomeLayout from "../(home)/layout";
import Image from "next/image";

interface TeamMember {
  name: string;
  role: string;
  image: string;
}

export default function AboutPage() {
  const teamMembers: TeamMember[] = [
    {
      name: "HOSELITA IKOLI",
      role: "President and CEO",
      image: "/images/about-4.jpg",
    },
    {
      name: "SAMUEL IKOLI",
      role: "CTO and Managing Director",
      image: "/images/about-3.jpg",
    },
    {
      name: "ANGEL IKOLI",
      role: "Managing Director",
      image: "/images/about-2.jpg",
    },
    {
      name: "MIETEI IKOLI",
      role: "Managing Director",
      image: "/images/about-1.jpg",
    },
  ];

  // Simplified animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <HomeLayout>
      <div className="min-h-screen bg-linear-to-b from-orange-50 to-white">
        {/* About Us Section */}
        <section className="container mx-auto px-4 py-12 md:py-16 lg:py-20">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12 max-w-6xl mx-auto">
            {/* Logo */}
            <div className="w-full lg:w-1/3 flex justify-center">
              <Image
                src="/images/about-us.png"
                alt="african lady"
                height={500}
                width={400}
                className="object-contain"
              />
            </div>

            {/* About Content */}
            <motion.div
              className="w-full lg:w-2/3 text-center lg:text-left"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              transition={{ duration: 0.5 }}
            >
              <h2 className="homeH1 mb-6 text-[#5C4033] lg:text-start">
                About <span className="text-[#FAB75B]">Us</span>
              </h2>
              <p className="text-gray-700 text-lg leading-relaxed">
                African Fashion Fusion is a revolutionary digital platform
                connecting skilled African tailors with fashion enthusiasts who
                create their designs worldwide. We blend traditional African
                craftsmanship with contemporary design through our innovative
                online marketplace and custom design tools.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Our Story Section */}
        <section className="container mx-auto px-4 py-12 md:py-16">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            transition={{ duration: 0.5 }}
          >
            <h2 className="homeH1 mb-8 text-[#5C4033]">
              Our <span className="text-[#FAB75B]">Story</span>
            </h2>
            <p className="text-gray-700 text-lg leading-relaxed">
              African Fashion Fusion emerged from a passion to merge the vibrant
              heritage of African fashion with global trends. Originating from
              The heart of nigeria, we partner with skilled artisans across
              Africa to create contemporary garments that honor traditional
              craftsmanship. Our brand aims to share the rich stories embedded
              in each piece, celebrating cultural diversity and empowering local
              communities. We believe fashion is a powerful bridge between
              cultures, and through our designs, we invite you to experience the
              authentic beauty and timeless elegance of African style.
            </p>
          </motion.div>
        </section>

        {/* Meet Our Team Section */}
        <section className="container mx-auto px-4 py-12 md:py-16 pb-20">
          <div className="max-w-6xl mx-auto">
            <motion.h2
              className="homeH1 text-center mb-12 text-[#5C4033]"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              transition={{ duration: 0.5 }}
            >
              Meet Our <span className="text-[#FAB75B]">Team</span>
            </motion.h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {teamMembers.map((member, index) => (
                <motion.div
                  key={index}
                  className="flex flex-col items-center"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeIn}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="w-full aspect-square rounded-lg overflow-hidden shadow-lg mb-4 bg-linear-to-br from-gray-700 to-gray-900">
                    <Image
                      src={member.image}
                      alt={member.name}
                      width={300}
                      height={300}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 text-center">
                    {member.name}
                  </h3>
                  <p className="text-sm text-gray-600 text-center">
                    {member.role}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </HomeLayout>
  );
}

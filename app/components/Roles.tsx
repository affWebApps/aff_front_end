'use client';
import Image from "next/image";
import { motion, Variants } from "framer-motion";
import { Button } from "./ui/Button";

export default function FashionRoles() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
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

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
      },
    },
  };

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <motion.div
        className="max-w-7xl mx-auto"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={containerVariants}
      >
        {/* Header Section */}
        <motion.div className="text-center mb-16" variants={headerVariants}>
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-px w-12 bg-[#B28241]"></div>
            <span className="homeH5">Roles</span>
            <div className="h-px w-12 bg-[#B28241]"></div>
          </div>

          <h1 className="homeH2 mb-4">
            For Designers. For Tailors.
            <br />
            For Everyone in Fashion.
          </h1>

          <p className="lg:text-lg text-gray-600 max-w-2xl mx-auto">
            Join a creative community where ideas meet craftsmanship
            <br />
            whether you design, sew, or simply love fashion.
          </p>
        </motion.div>

        {/* Cards Section */}
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Designer Card */}
          <motion.div
            className="bg-[#5C4033] rounded-lg overflow-hidden shadow-xl"
            variants={cardVariants}
          >
            <div className="aspect-[4/3] bg-[#5C4033] relative overflow-hidden p-3">
              <div className="relative w-full h-full">
                <Image
                  src="/images/client.jpg"
                  alt="Fashion designer working on digital tablet"
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
            </div>

            <div className="p-8 text-center text-white">
              <h2 className="lg:text-3xl text-xl font-bold mb-4">
                As a Client/Designer
              </h2>
              <p className="text-amber-100 mb-8 lg:text-lg text-[14px]">
                Create stunning digital garments and
                <br />
                collaborate with tailors to make them real.
              </p>
              <Button className="mx-auto">Get Started</Button>
            </div>
          </motion.div>

          {/* Tailor Card */}
          <motion.div
            className="bg-[#FAF6F0] rounded-3xl overflow-hidden shadow-xl border rounded-lg border-gray-200"
            variants={cardVariants}
          >
            <div className="aspect-[4/3] bg-[#FAF6F0] relative overflow-hidden p-2">
              <div className="relative w-full h-full">
                <Image
                  src="/images/tailor2.jpg"
                  alt="Tailor working on fabric"
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
            </div>

            <div className="p-8 text-center">
              <h2 className="lg:text-3xl text-xl font-bold mb-4">
                {" "}
                As a Tailor
              </h2>
              <p className="text-text-gray-600 mb-8 lg:text-lg text-[14px]">
                Find projects, showcase your portfolio,
                <br />
                and earn doing what you love.
              </p>
              <Button className="mx-auto">Get Started</Button>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

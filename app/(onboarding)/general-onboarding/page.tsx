"use client";
import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { BackButton } from "../../components/ui/BackNavigation";
import { Button } from "../../components/ui/Button";
import { useRouter } from "next/navigation";
import { cardVariants, containerVariants, itemVariants } from "../styles";
import { roles } from "../../types/onboadingTypes";

const RoleSelectionPage = () => {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const router = useRouter();
  const handleCardClick = (roleId: string) => {
    setSelectedRole(roleId);
  };

  const handleNext = () => {
    if (!selectedRole) return;

    if (selectedRole === "client") {
      router.push("/client-onboarding");
    } else if (selectedRole === "tailor") {
      router.push("/tailor-onboarding");
    } else if (selectedRole === "both") {
      router.push("/both-onboarding");
    }
  };

  return (
    <div className="min-h-screen bg-[#fff8ef]">
      {/* Logo - Desktop only */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="hidden md:block fixed top-0 left-0 right-0 z-50 bg-[#fff8ef] px-6 py-4"
      >
        <div className="inline-block px-4 py-2 rounded-lg">
          <Image
            src="/images/logo.svg"
            alt="logo"
            width={76}
            height={46}
            className="rounded-lg w-full h-full object-contain"
          />
        </div>
      </motion.div>

      {/* Fixed Back Button - Mobile only */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-[#fff8ef] px-4 py-4">
        <BackButton />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto px-4 pt-20 md:pt-24 pb-8"
      >
        {/* Static Back Button - Desktop only */}
        <motion.div variants={itemVariants} className="hidden md:block mb-12">
          <BackButton />
        </motion.div>

        <motion.div variants={itemVariants} className="text-center mb-12">
          <h1 className="header-large mb-4">Which best describes you?</h1>
          <p className="font-normal text-base leading-6 tracking-normal text-center">
            Choose a role to get the best experience on AFF Designer.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          className="hidden md:grid md:grid-cols-3 gap-6 mb-12"
        >
          {roles.map((role) => (
            <motion.button
              key={role.id}
              variants={cardVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={() => handleCardClick(role.id)}
              className={`bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 cursor-pointer ${
                selectedRole === role.id ? "ring-2 ring-[#FAB75B]" : ""
              }`}
            >
              <div className="aspect-4/3 overflow-hidden relative w-full">
                <Image
                  src={role.image}
                  alt={role.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6 text-center">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {role.title}
                </h3>
                <p className="text-gray-600 text-sm">{role.description}</p>
              </div>
            </motion.button>
          ))}
        </motion.div>

        <motion.div
          variants={containerVariants}
          className="md:hidden space-y-6 mb-12"
        >
          {roles.map((role) => (
            <motion.button
              key={role.id}
              variants={cardVariants}
              whileTap="tap"
              onClick={() => handleCardClick(role.id)}
              className={`w-full bg-white rounded-2xl overflow-hidden shadow-sm active:shadow-lg transition-shadow duration-300 ${
                selectedRole === role.id ? "ring-2 ring-[#FAB75B]" : ""
              }`}
            >
              <div className="aspect-video overflow-hidden relative">
                <Image
                  src={role.image}
                  alt={role.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6 text-center">
                <h3 className="font-(family-name:--font-montserrat) font-semibold text-xl leading-7 tracking-normal text-center mb-2">
                  {role.title}
                </h3>
                <p className="font-medium text-base leading-6 tracking-normal text-center">
                  {role.description}
                </p>
              </div>
            </motion.button>
          ))}
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="flex justify-end max-w-7xl mx-auto"
        >
          <motion.div
            className="w-full lg:w-1/3"
            whileHover={{ scale: selectedRole ? 1.02 : 1 }}
            whileTap={{ scale: selectedRole ? 0.98 : 1 }}
          >
            <Button
              variant="default"
              size="large"
              disabled={!selectedRole}
              onClick={handleNext}
              className="w-full"
            >
              Next
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default RoleSelectionPage;

"use client";
import React, { useState } from "react";
import Image from "next/image";
import { BackButton } from "../../components/ui/BackNavigation";
import { Button } from "../../components/ui/Button";

const RoleSelectionPage = () => {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const roles = [
    {
      id: "client",
      title: "I'm a Client/Designer",
      description: "Create patterns, export production files.",
      image: "/images/client-designer.jpg",
    },
    {
      id: "tailor",
      title: "I'm a Tailor",
      description: "Get jobs, show your portfolio, get paid.",
      image: "/images/tailor.jpg",
    },
    {
      id: "both",
      title: "I'm Both",
      description: "Do both and switch anytime.",
      image: "/images/both.jpg",
    },
  ];

  return (
    <div className="min-h-screen bg-[#fff8ef]">
      <div className="hidden md:block fixed top-0 left-0 right-0  z-10 px-6 py-4">
        <div className="inline-block px-4 py-2 rounded-lg">
          <Image
            src="/images/logo.svg"
            alt="logo"
            width={76}
            height={46}
            className="rounded-lg w-full h-full object-contain"
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4  py-8 md:pt-24">
        <BackButton className="mb-12" />

        <div className="text-center mb-12">
          <h1 className="header-large mb-4">Which best describes you?</h1>
          <p className=" font-normal text-base leading-6 tracking-normal text-center">
            Choose a role to get the best experience on AFF Designer.
          </p>
        </div>

        <div className="hidden md:grid md:grid-cols-3 gap-6 mb-12 ">
          {roles.map((role) => (
            <button
              key={role.id}
              onClick={() => setSelectedRole(role.id)}
              className={`bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer ${
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
            </button>
          ))}
        </div>

        <div className="md:hidden space-y-6 mb-12 ">
          {roles.map((role) => (
            <button
              key={role.id}
              onClick={() => setSelectedRole(role.id)}
              className={`w-full bg-white rounded-2xl overflow-hidden shadow-sm active:shadow-lg transition-all duration-300 ${
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
            </button>
          ))}
        </div>

        <div className="flex justify-end max-w-7xl mx-auto">
          <Button
            variant="default"
            size="large"
            disabled={!selectedRole}
            className="w-full lg:w-1/3 transition-all duration-300 hover:scale-105"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RoleSelectionPage;

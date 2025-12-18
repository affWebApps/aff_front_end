"use client";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "../../../../components/ui/Button";
import Image from "next/image";
import { motion, Variants } from "framer-motion";

export default function SignIn() {
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = () => {
    console.log("Sign in submitted:", formData);
  };

  // Animation variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  };

  const logoVariants: Variants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  };

  return (
    <div className="min-h-screen bg-white p-4">
      {/* Logo */}
      <motion.div
        variants={logoVariants}
        initial="hidden"
        animate="visible"
        className="absolute top-4 left-4 xl:top-8 xl:left-4 z-10 w-[60px] h-10 xl:w-[76px] xl:h-[46px]"
      >
        <Image
          src="/images/logo.svg"
          alt="logo"
          width={76}
          height={46}
          className="rounded-lg w-full h-full object-contain"
        />
      </motion.div>

      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-md"
        >
          {/* Form Container */}
          <div className="bg-white rounded-2xl p-8">
            <motion.h1
              variants={itemVariants}
              className="text-center mb-2 header-large"
            >
              Welcome back
            </motion.h1>
            <motion.p
              variants={itemVariants}
              className="text-center text-gray-600 mb-8"
            >
              Don&apos;t have an account?{" "}
              <a
                href="/auth/sign-up"
                className="text-gray-900 font-semibold hover:underline"
              >
                Sign Up
              </a>
            </motion.p>

            <div className="space-y-5">
              {/* Email */}
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <motion.input
                  whileFocus={{ scale: 1.01 }}
                  transition={{ duration: 0.2 }}
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter email"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                />
              </motion.div>

              {/* Password */}
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <motion.input
                    whileFocus={{ scale: 1.01 }}
                    transition={{ duration: 0.2 }}
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter password"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                  />
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </motion.button>
                </div>
              </motion.div>

              {/* Submit Button */}
              <motion.div variants={itemVariants}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    onClick={handleSubmit}
                    variant="default"
                    size="large"
                    className="w-full"
                  >
                    Sign In
                  </Button>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

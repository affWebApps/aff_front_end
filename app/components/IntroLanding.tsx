"use client";
import { Button } from "./ui/Button";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";

export default function IntroLanding() {
  const { scrollYProgress } = useScroll();
  const canvasY = useTransform(scrollYProgress, [0, 0.3], [100, 0]);
  const canvasOpacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);

  return (
    <div className="min-h-screen bg-linear-to-br from-amber-50 via-orange-50 to-rose-50 relative">
      <div className="container mx-auto px-4 py-8 sm:py-12 max-w-7xl">
        <div className="relative min-h-[600px] lg:min-h-[700px]">
          <div className="text-center pt-8 px-4 sm:px-8 md:px-16 lg:px-28">
            {/* Top Icons - Mobile and Tablet */}
            <motion.div
              className="flex lg:hidden items-center justify-center gap-8 mb-4"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <motion.div
                initial={{ rotate: -10, scale: 0.8 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Image
                  src="/images/tailor-tool.png"
                  alt="Tailor tool icon"
                  width={100}
                  height={100}
                  className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24"
                />
              </motion.div>

              <motion.div
                initial={{ rotate: 10, scale: 0.8 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Image
                  src="/images/pattern.png"
                  alt="Pattern icon"
                  width={100}
                  height={100}
                  className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24"
                />
              </motion.div>
            </motion.div>

            <motion.div
              className="flex flex-col lg:flex-row items-center justify-center gap-2 lg:gap-3 mb-4"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-2 lg:gap-3">
                <motion.div
                  className="hidden lg:block"
                  initial={{ rotate: -10, scale: 0.8 }}
                  animate={{ rotate: 0, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <Image
                    src="/images/tailor-tool.png"
                    alt="Tailor tool icon"
                    width={100}
                    height={100}
                  />
                </motion.div>

                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800">
                  Bring Your <span className="text-orange-400">Designs</span>
                </h1>

                <motion.div
                  className="hidden lg:block"
                  initial={{ rotate: 10, scale: 0.8 }}
                  animate={{ rotate: 0, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <Image
                    src="/images/pattern.png"
                    alt="Pattern icon"
                    width={100}
                    height={100}
                  />
                </motion.div>
              </div>
            </motion.div>

            <motion.h2
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              to Life, Seamlessly with{" "}
              <span className="text-orange-400">Tailors</span>.
            </motion.h2>

            <motion.p
              className="text-gray-600 text-base sm:text-lg md:text-xl max-w-2xl mx-auto mb-8 px-4 sm:px-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              AFF makes it easy for fashion designers and tailors to
              collaborate,
              <br className="hidden sm:block" />
              manage projects, and bring ideas to life, all in one place.
            </motion.p>

            {/* Left Garment - Hidden on mobile and tablet */}
            <motion.div
              className="hidden lg:block absolute left-0 top-1/3 w-52 transform -rotate-12"
              initial={{ opacity: 0, x: -50, rotate: -20 }}
              animate={{ opacity: 1, x: 0, rotate: -12 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              whileHover={{ scale: 1.05, rotate: -8 }}
            >
              <Image
                src="/images/left-img.png"
                alt="Left garment design"
                width={150}
                height={100}
              />
            </motion.div>

            {/* Right Garment - Hidden on mobile and tablet */}
            <motion.div
              className="hidden lg:block absolute right-0 top-1/3 w-52 transform rotate-12"
              initial={{ opacity: 0, x: 50, rotate: 20 }}
              animate={{ opacity: 1, x: 0, rotate: 12 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              whileHover={{ scale: 1.05, rotate: 8 }}
            >
              <Image
                src="/images/right-img.png"
                alt="Right garment design"
                width={120}
                height={100}
              />
            </motion.div>

            {/* Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto"
              >
                <Button
                  variant="default"
                  size="large"
                  className="w-full sm:w-auto"
                >
                  Get Started
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto"
              >
                <Button
                  variant="default"
                  size="large"
                  outlined
                  icon="play"
                  iconPosition="left"
                  className="w-full sm:w-auto"
                >
                  View Demo
                </Button>
              </motion.div>
            </motion.div>

            {/* Mobile and Tablet Garments - Visible only on mobile and tablet */}
            <motion.div
              className="flex lg:hidden items-center justify-center gap-8 sm:gap-12 md:gap-16 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
            >
              <motion.div whileHover={{ scale: 1.05 }}>
                <Image
                  src="/images/left-img.png"
                  alt="Left garment design"
                  width={120}
                  height={100}
                  className="w-24 h-auto sm:w-32 md:w-40"
                />
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }}>
                <Image
                  src="/images/right-img.png"
                  alt="Right garment design"
                  width={100}
                  height={100}
                  className="w-20 h-auto sm:w-28 md:w-32"
                />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      <motion.div
        className="absolute bottom-0 left-0 right-0 z-10 mx-auto px-4 sm:px-6 flex items-center justify-center translate-y-1/4 sm:translate-y-1/3"
        style={{ y: canvasY, opacity: canvasOpacity }}
      >
        <div className="bg-white rounded-3xl shadow-xl p-8 sm:p-12 md:p-16 lg:p-16 min-h-[500px] sm:min-h-[400px] md:min-h-[450px] flex items-center justify-center w-full max-w-4xl">
          <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
            CANVAS
          </h3>
        </div>
      </motion.div>
    </div>
  );
}

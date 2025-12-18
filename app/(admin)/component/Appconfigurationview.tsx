import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "../../../components/ui/Button";

const AppConfigurationView = () => {
  const [appName, setAppName] = useState("Africa Fashion Fusion");
  const [primaryColor, setPrimaryColor] = useState("#5C4033");
  const [secondaryColor1, setSecondaryColor1] = useState("#FAB75B");
  const [secondaryColor2, setSecondaryColor2] = useState("#C8A369");
  const [backgroundColor, setBackgroundColor] = useState("#FFFFFF");
  const [logoFile, setLogoFile] = useState<File | null>(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLogoFile(e.target.files[0]);
    }
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      <motion.h2
        variants={itemVariants}
        className="text-xl font-medium text-gray-900 mb-1 font-(family-name:--font-montserrat)"
      >
        App Configuration
      </motion.h2>
      <motion.p variants={itemVariants} className="text-gray-600 text-sm mb-6">
        Customize your platform&apos;s appearance and features
      </motion.p>

      <motion.div
        variants={itemVariants}
        className="bg-white rounded-lg border border-gray-200 p-6 mb-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          Branding & Colours
        </h3>

        {/* App Name */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            App Name
          </label>
          <input
            type="text"
            value={appName}
            onChange={(e) => setAppName(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            placeholder="Africa Fashion Fusion"
          />
        </div>

        {/* Colors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Primary Color */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Primary Colour
            </label>
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded border border-gray-200 cursor-pointer"
                style={{ backgroundColor: primaryColor }}
                onClick={() =>
                  document.getElementById("primary-color")?.click()
                }
              />
              <input
                type="color"
                id="primary-color"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="hidden"
              />
              <input
                type="text"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* Secondary 1 Color */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Secondary 1 Colour
            </label>
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded border border-gray-200 cursor-pointer"
                style={{ backgroundColor: secondaryColor1 }}
                onClick={() =>
                  document.getElementById("secondary1-color")?.click()
                }
              />
              <input
                type="color"
                id="secondary1-color"
                value={secondaryColor1}
                onChange={(e) => setSecondaryColor1(e.target.value)}
                className="hidden"
              />
              <input
                type="text"
                value={secondaryColor1}
                onChange={(e) => setSecondaryColor1(e.target.value)}
                className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* Secondary 2 Color */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Secondary 2 Colour
            </label>
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded border border-gray-200 cursor-pointer"
                style={{ backgroundColor: secondaryColor2 }}
                onClick={() =>
                  document.getElementById("secondary2-color")?.click()
                }
              />
              <input
                type="color"
                id="secondary2-color"
                value={secondaryColor2}
                onChange={(e) => setSecondaryColor2(e.target.value)}
                className="hidden"
              />
              <input
                type="text"
                value={secondaryColor2}
                onChange={(e) => setSecondaryColor2(e.target.value)}
                className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* Background */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Background
            </label>
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded border border-gray-200 cursor-pointer"
                style={{ backgroundColor: backgroundColor }}
                onClick={() =>
                  document.getElementById("background-color")?.click()
                }
              />
              <input
                type="color"
                id="background-color"
                value={backgroundColor}
                onChange={(e) => setBackgroundColor(e.target.value)}
                className="hidden"
              />
              <input
                type="text"
                value={backgroundColor}
                onChange={(e) => setBackgroundColor(e.target.value)}
                className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>
        </div>

        {/* App Logo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            App Logo
          </label>
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-amber-100 rounded flex items-center justify-center text-2xl font-bold text-amber-900">
              AFF
            </div>
            <div className="flex-1">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                <input
                  type="file"
                  id="logo-upload"
                  accept=".png,.svg,.jpg"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
                <label
                  htmlFor="logo-upload"
                  className="cursor-pointer text-gray-600"
                >
                  <span className="text-amber-600 hover:text-amber-700">
                    Choose File
                  </span>
                  <span className="ml-2">
                    {logoFile ? logoFile.name : "No file chosen"}
                  </span>
                </label>
                <p className="text-xs text-gray-500 mt-2">
                  Recommended: PNG or SVG, max 2MB
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div variants={itemVariants} className="flex justify-end gap-4">
        <Button outlined={true}>Save to Draft</Button>
        <Button variant="default">Publish Changes</Button>
      </motion.div>
    </motion.div>
  );
};

export default AppConfigurationView;

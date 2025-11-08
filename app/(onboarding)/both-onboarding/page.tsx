"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../../components/ui/Button";
import { NavigationHeader } from "../components/NavigationHeader";
import { ProgressBar } from "../components/ProgressBar";
import { FormInput } from "../components/FormInput";
import { FormSelect } from "../components/FormSelect";
import { FileUpload } from "../components/FileUpload";
import { MultiSelectButtons } from "../components/MultiSelectButtons";
import { ToggleSwitch } from "../components/ToggleSwitch";
import { CompletionStep } from "../components/CompletionStep";
import { PortfolioUpload } from "../components/PortfolioUpload";
import { countryOptions, fabricTypes, FormData, garmentTypes, pricingOptions, skillCategories } from "../../types/onboadingTypes";
import { MenuItem, Select } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";



const BothOnboardingPage = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const contentRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState<FormData>({
    displayName: "",
    firstName: "",
    lastName: "",
    country: "",
    city: "",
    bioTagline: "",
    avatar: null,
    garmentTypes: [],
    fabrics: [],
    skills: [],
    availability: false,
    pricingType: "per-garment",
    baseRate: "",
     currency: '',
    whatsIncluded: "",
    portfolioImages: [],
  });

  const totalSteps = 7;

 

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [currentStep]);

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else if (currentStep === 7) {
      router.push("/studio");
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      router.push("/general-onboarding");
    }
  };

  const handleSkip = () => {
    setCurrentStep(currentStep + 1);
  };

  const toggleSelection = (
    field: keyof Pick<FormData, "garmentTypes" | "fabrics" | "skills">,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter((item) => item !== value)
        : [...prev[field], value],
    }));
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return (
          formData.displayName &&
          formData.firstName &&
          formData.lastName &&
          formData.country &&
          formData.city
        );
      case 2:
        return formData.garmentTypes.length > 0;
      case 3:
        return formData.fabrics.length > 0;
      case 4:
        return formData.skills.length > 0;
      case 5:
        return formData.pricingType && formData.baseRate;
      case 6:
        return true; 
      default:
        return true;
    }
  };

  const pageVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  };

  const showSkip =
    currentStep === 2 ||
    currentStep === 3 ||
    currentStep === 4 ||
    currentStep === 6;

  return (
    <div className="min-h-screen bg-[#fff8ef]">
      <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
      <NavigationHeader
        currentStep={currentStep}
        onBack={handleBack}
        onSkip={handleSkip}
        showSkip={showSkip}
      />

      <div
        key={currentStep}
        ref={contentRef}
        className="pt-64 pb-20 px-4 md:px-8 max-w-6xl mx-auto"
      >
        <AnimatePresence mode="wait">
          {currentStep === 1 && (
            <motion.div
              key="step1"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="space-y-8"
            >
              <div className="text-center mb-12">
                <h1 className="header-large mb-3">Welcome</h1>
                <p className="text-gray-600">
                  Tell us a bit about yourself so designers can get to know you!
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <FormInput
                  label="Display name"
                  required
                  placeholder="Choose a display name"
                  value={formData.displayName}
                  onChange={(e) =>
                    setFormData({ ...formData, displayName: e.target.value })
                  }
                />

                <FormInput
                  label="First name"
                  required
                  placeholder="Enter first name"
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                />

                <FormInput
                  label="Last name"
                  required
                  placeholder="Enter last name"
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                />

                <FormSelect
                  label="Country"
                  required
                  value={formData.country}
                  onChange={(e) =>
                    setFormData({ ...formData, country: e.target.value })
                  }
                  options={countryOptions}
                  placeholder="Choose country"
                />

                <FormInput
                  label="City"
                  required
                  placeholder="Enter city"
                  value={formData.city}
                  onChange={(e) =>
                    setFormData({ ...formData, city: e.target.value })
                  }
                />

                <FormInput
                  label="Bio Tagline"
                  optional
                  placeholder='e.g "Designer & Tailor"'
                  value={formData.bioTagline}
                  onChange={(e) =>
                    setFormData({ ...formData, bioTagline: e.target.value })
                  }
                />

                <FileUpload label="Photo/Avatar upload" optional />
              </div>
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div
              key="step2"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <MultiSelectButtons
                title="What Do You Love Designing?"
                subtitle="Choose the garment types you enjoy designing"
                secondTitle="Garment type"
                options={garmentTypes}
                selectedOptions={formData.garmentTypes}
                onToggle={(type) => toggleSelection("garmentTypes", type)}
              />
            </motion.div>
          )}

          {currentStep === 3 && (
            <motion.div
              key="step3"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <MultiSelectButtons
                title="What are the fabrics you love?"
                subtitle="Multi-select the fabrics you love using"
                secondTitle="Fabrics"
                options={fabricTypes}
                selectedOptions={formData.fabrics}
                onToggle={(fabric) => toggleSelection("fabrics", fabric)}
              />
            </motion.div>
          )}

          {currentStep === 4 && (
            <motion.div
              key="step4"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <MultiSelectButtons
                title="Showcase Your Skills"
                subtitle="Multi-select categories that best describe your tailoring specialization."
                options={skillCategories}
                selectedOptions={formData.skills}
                onToggle={(skill) => toggleSelection("skills", skill)}
              />
            </motion.div>
          )}

          {currentStep === 5 && (
            <motion.div
              key="step5"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="space-y-8"
            >
              <div className="text-center mb-12">
                <h1 className="header-large mb-3">Set Work Preferences</h1>
                <p className="text-gray-600">
                  Set your availability status and how you prefer to charge for
                  your services.
                </p>
              </div>

              <div className="max-w-2xl mx-auto space-y-6">
                <ToggleSwitch
                  label="Availability Status"
                  description="Available for jobs"
                  required
                  checked={formData.availability}
                  onChange={() =>
                    setFormData((prev) => ({
                      ...prev,
                      availability: !prev.availability,
                    }))
                  }
                />

                <FormSelect
                  label="Pricing Type"
                  required
                  value={formData.pricingType}
                  onChange={(e) =>
                    setFormData({ ...formData, pricingType: e.target.value })
                  }
                  options={pricingOptions}
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Base Rate<span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-2">
                    <Select
                      value={formData.currency}
                      onChange={(e) =>
                        setFormData({ ...formData, currency: e.target.value })
                      }
                      IconComponent={KeyboardArrowDownIcon}
                      sx={{
                        width: "100px",
                        height: "48px",
                        borderRadius: "12px",
                        backgroundColor: "white",
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#d1d5db",
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#d1d5db",
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#FAB75B",
                          borderWidth: "2px",
                        },
                        "& .MuiSelect-select": {
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: 500,
                        },
                      }}
                    >
                      <MenuItem value="NGN">₦</MenuItem>
                      <MenuItem value="USD">$</MenuItem>
                      <MenuItem value="GBP">£</MenuItem>
                      <MenuItem value="EUR">€</MenuItem>
                    </Select>
                    <input
                      type="text"
                      placeholder="Enter amount"
                      value={formData.baseRate}
                      onChange={(e) =>
                        setFormData({ ...formData, baseRate: e.target.value })
                      }
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FAB75B] bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    What&apos;s included?{" "}
                    <span className="text-gray-400">(Optional)</span>
                  </label>
                  <textarea
                    placeholder="Describe what's included in your base rate"
                    value={formData.whatsIncluded}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        whatsIncluded: e.target.value,
                      })
                    }
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FAB75B] bg-white resize-none"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Example: &quot;Includes fittings and basic alterations&quot;
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {currentStep === 6 && (
            <motion.div
              key="step6"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <PortfolioUpload
                title="Showcase Your Best Work"
                subtitle="Upload samples of your past projects to attract designers."
                maxImages={3}
              />
            </motion.div>
          )}

          {currentStep === 7 && (
            <motion.div
              key="step7"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <CompletionStep
                title="You're Ready to Go!"
                message="Switch between being a Designer and Tailor anytime."
              />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex justify-end mt-12">
          <Button
            variant="default"
            size="large"
            onClick={handleNext}
            disabled={!isStepValid() && currentStep !== 7}
            className="w-full sm:w-full md:w-auto"
          >
            {currentStep === 7 ? "Go to Studio" : "Save & Continue"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BothOnboardingPage;

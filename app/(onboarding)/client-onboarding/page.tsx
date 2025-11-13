"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../../components/ui/Button";
import { NavigationHeader } from "../components/NavigationHeader";
import { ProgressBar } from "../components/ProgressBar";
import { FormInput } from "../components/FormInput";
import { FormSelect } from "../components/FormSelect";
import { FileUpload } from "../components/FileUpload";
import { MultiSelectButtons } from "../components/MultiSelectButtons";
import { CompletionStep } from "../components/CompletionStep";
import { countryOptions, fabricTypes, FormDataClient, garmentTypes } from "../../types/onboadingTypes";



const ClientOnboardingPage = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const contentRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState<FormDataClient>({
    displayName: "",
    firstName: "",
    lastName: "",
    country: "",
    city: "",
    bioTagline: "",
    avatar: null,
    garmentTypes: [],
    fabrics: [],
  });

  const totalSteps = 4;



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
    } else if (currentStep === 4) {
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
    field: keyof Pick<FormDataClient, "garmentTypes" | "fabrics">,
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
      default:
        return true;
    }
  };

  const pageVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  };

  const showSkip = currentStep === 2 || currentStep === 3;

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
                <h1 className="header-large mb-3">
                  Let&apos;s Set Up Your Profile
                </h1>
                <p className="text-gray-600">
                  Just a few details to get to know you!
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
                  placeholder='e.g "Fashion enthusiast"'
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
              <CompletionStep
                title="You're All Set!"
                message="Your profile is complete. Explore the design studio to create, save, share your unique styles, and collaborate with tailors."
              />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex justify-end mt-12">
          <Button
            variant="default"
            size="large"
            onClick={handleNext}
            disabled={!isStepValid() && currentStep !== 4}
            className="w-full sm:w-full md:w-auto"
          >
            {currentStep === 4 ? "Go to Studio" : "Save & Continue"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ClientOnboardingPage;

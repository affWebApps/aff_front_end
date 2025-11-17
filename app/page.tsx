import FeaturesSection from "./components/Features";
import HowItWorks from "./components/HowItWorks";
import IntroLanding from "./components/IntroLanding";

export default function Home() {
  return (
    <div className=" w-full">
      <IntroLanding />
      <HowItWorks />
      <FeaturesSection />
    </div>
  );
}

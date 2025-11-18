import IntroLanding from "../components/IntroLanding";
import HowItWorks from "../components/HowItWorks";
import FeaturesSection from "../components/Features";
import FashionRoles from "../components/Roles";
import FashionGallery from "../components/Gallery";
import TestimonialSection from "../components/Testimonials";
import FAQAccordion from "../components/FAQAccordion";
import HomeLayout from "./layout";



export default function HomePage() {
  return (
    <HomeLayout>
      <div className="w-full">
        <IntroLanding />
        <HowItWorks />
        <FeaturesSection />
        <FashionRoles />
        <FashionGallery />
        <TestimonialSection />
        <FAQAccordion />
      </div>
    </HomeLayout>
  );
}

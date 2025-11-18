"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState(2);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const faqs = [
    {
      question: "How long does the custom tailoring process take?",
      answer:
        "The custom tailoring process typically takes 3-4 weeks from the moment we receive your measurements and design preferences. This includes pattern creation, fabric cutting, initial construction, and final finishing. Rush orders can be accommodated for an additional fee, with completion in 2 weeks.",
    },
    {
      question: "Do you ship internationally?",
      answer:
        "Yes, we ship worldwide to over 150 countries. International shipping typically takes 5-10 business days depending on your location. All customs duties and taxes are calculated at checkout, and we provide full tracking for every order.",
    },
    {
      question: "How do i get measures accurately?",
      answer:
        "Our platform provides detailed video guides and virtual measurement tools. You can also schedule a video consultation with your tailor for additional guidance.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept all major credit cards (Visa, Mastercard, American Express), PayPal, Apple Pay, Google Pay, and bank transfers. For orders over $1,000, we also offer installment payment plans through Affirm and Klarna with 0% APR options available.",
    },
    {
      question: "Can i modify my design after ordering?",
      answer:
        "Design modifications are possible within the first 48 hours after placing your order, before we begin cutting the fabric. After this window, changes may incur additional fees depending on the stage of production. We recommend reviewing all details carefully before confirming your order.",
    },
  ];

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <div className="min-h-screen bg-[#FAF6F0] flex items-center justify-center p-6">
      <div
        ref={sectionRef}
        className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20"
      >
        {/* Left Section */}
        <div
          className={`flex flex-col justify-center transition-all duration-1000 ${
            isVisible
              ? "opacity-100 translate-x-0"
              : "opacity-0 -translate-x-12"
          }`}
        >
          <h1 className="text-5xl lg:text-6xl text-[#3d2f2f] mb-4 ">
            Frequently asked
            <br />
            Questions
          </h1>
          <p className="text-[#6b5e5e] text-base">
            Don&apos;t see the answer you&apos;re looking for? Get in touch.
          </p>
        </div>

        {/* Right Section - Accordion */}
        <div className="flex flex-col gap-1">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`border-b border-[#d4c8bf] relative transition-all duration-700 ${
                isVisible
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 translate-x-12"
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {/* Active border indicator */}
              {openIndex === index && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#8b7355]"></div>
              )}

              <button
                onClick={() => toggleAccordion(index)}
                className="w-full flex items-center justify-between py-6 px-6 text-left transition-colors"
              >
                <span className="text-[#3d2f2f] font-medium text-base lg:text-lg pr-4">
                  {faq.question}
                </span>
                {openIndex === index ? (
                  <ChevronUp className="w-5 h-5 text-[#3d2f2f] flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-[#3d2f2f] flex-shrink-0" />
                )}
              </button>

              {openIndex === index && faq.answer && (
                <div className="px-6 pb-6 text-[#6b5e5e] text-sm lg:text-base leading-relaxed">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

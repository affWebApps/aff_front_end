import React from "react";
import Link from "next/link";
import { Button } from "./ui/Button";
import {
  Phone,
  Mail,
  MapPin,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
} from "lucide-react";
import Image from "next/image";

export const Footer: React.FC = () => {
  function getExactYear() {
    return new Date().getFullYear();
  }

  const year = getExactYear();

  return (
    <footer className="relative bg-[#FAF6F0]">
      <div className="relative z-10 mx-auto px-4 sm:px-6 flex items-center justify-center">
        <div className="bg-linear-to-r from-[#f5b563] to-[#f8c477] rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8 shadow-lg border translate-y-1/2 w-full max-w-[1200px]">
          <div className="shrink-0 w-full md:w-auto flex justify-center md:justify-start">
            <Image
              src="/images/african-woman.png"
              alt="African woman illustration"
              width={400}
              height={400}
              className="w-48 sm:w-64 md:w-80 lg:w-full h-auto object-contain"
            />
          </div>

          <div className="flex-1 min-w-[280px] text-center md:text-left">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#5a3d2f] mb-3">
              Ready to Bring Your Ideas to Life?
            </h2>
            <p className="text-[#6b4e3d] text-base sm:text-lg mb-6">
              Join a growing community of designers and tailors.
            </p>
            <Button
              size="large"
              className="bg-[#5a3d2f]! hover:bg-[#4a3020]! rounded-xl! px-8 sm:px-10! w-full sm:w-auto"
            >
              Get Started
            </Button>
          </div>
        </div>
      </div>

      {/* Footer Content */}
      <div className="bg-[#5a3d2f] pt-32 sm:pt-40">
        <div className="max-w-[1300px] mx-auto px-4 sm:px-6 pb-12 mt-24 sm:mt-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-10 items-start mb-12">
            {/* Logo */}
            <div className="w-[60px] h-10 xl:w-[76px] xl:h-[46px]">
              <Image
                src="/images/logo.svg"
                alt="logo"
                width={76}
                height={46}
                className="rounded-lg w-full h-full object-contain"
              />
            </div>

            {/* Pages */}
            <div className="text-left">
              <h3 className="text-white font-semibold text-lg mb-4">Pages</h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/about"
                    className="text-gray-300 hover:text-white transition-colors mt-4"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/gallery"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Gallery
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blog"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            {/* Services */}
            <div className="text-left">
              <h3 className="text-white font-semibold text-lg mb-4">
                Services
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/clients"
                    className="text-gray-300 hover:text-white transition-colors mt-4"
                  >
                    Clients/Designers
                  </Link>
                </li>
                <li>
                  <Link
                    href="/tailors"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Tailors
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div className="text-left">
              <h3 className="text-white font-semibold text-lg">Contact</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 mt-4">
                  <Phone
                    className="text-white w-5 h-5 mt-1 shrink-0"
                    fill="white"
                  />
                  <a
                    href="tel:+2348033000195"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    +234 803 300 0195
                  </a>
                </li>
                <li className="flex items-start gap-3">
                  <Mail className="text-white w-5 h-5 mt-1 shrink-0" />
                  <a
                    href="mailto:moreinfo@afrofashionfuse.com"
                    className="text-gray-300 hover:text-white transition-colors break-all"
                  >
                    moreinfo@afrofashionfuse.com
                  </a>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin className="text-white w-5 h-5 mt-1 shrink-0" />
                  <address className="text-gray-300 not-italic">
                    Onatrix Eco Green Park. Park No 2114 (2053) 02,
                    <br />
                    Plot 2053 Olusegun Obasanjo Way,
                    <br />
                    Wuse Zone 7 Abuja, Nigeria.
                  </address>
                </li>
              </ul>
            </div>

            {/* Social Media */}
            <div className="flex items-start gap-5 flex-col">
              <span className="text-white font-semibold mb-2">
                Social media
              </span>
              <div className="flex gap-6 sm:gap-8">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-gray-300 transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="w-5 h-5" fill="white" />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-gray-300 transition-colors"
                  aria-label="Twitter"
                >
                  <Twitter className="w-5 h-5" fill="white" />
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-gray-300 transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-5 h-5" fill="white" />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-white transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-600 pt-8">
            <div className="flex flex-col md:flex-row justify-center items-center gap-4">
              <p className="text-gray-400 text-sm text-center">
                © {year} africanfashionfusion.com
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

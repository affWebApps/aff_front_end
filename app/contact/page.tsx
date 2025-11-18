"use client";
import { useState, ChangeEvent } from "react";
import HomeLayout from "../(home)/layout";
import { Button } from "../components/ui/Button";

interface FormData {
  name: string;
  email: string;
  message: string;
}

const ContactForm = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    console.log("Form submitted:", formData);
    // Add your form submission logic here
    alert("Thank you for contacting us! We will get back to you soon.");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <HomeLayout>
      <div className="min-h-screen bg-linear-to-br from-orange-50 via-orange-50 to-orange-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="homeH1 mb-2 text-[#5C4033]">
              Contact <span className="text-[#FAB75B]">Us</span>
            </h1>
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            {/* Left Side - Info */}
            <div className=" rounded-lg p-8 text-[#7D665C] ">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-700 mb-6">
                NEED TO TALK TO US?
              </h2>
              <p className="leading-relaxed text-base md:text-lg ">
                We value all customer engagement, whether you have questions,
                partnership inquiries, or feedback. Please connect with us
                through the form below or via our listed contact methods.
              </p>
            </div>

            {/* Right Side - Form */}
            <div className=" rounded-lg p-8 ">
              <div className="space-y-6">
                {/* Name Field */}
                <div>
                  <label
                    htmlFor="name"
                    className="block text-gray-700 font-medium mb-2"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter name"
                    className="w-full px-4 py-3 border border-gray-200 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent transition-all"
                  />
                </div>

                {/* Email Field */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-gray-700 font-medium mb-2"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter email"
                    className="w-full px-4 py-3 border border-gray-200 bg-white  rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent transition-all"
                  />
                </div>

                {/* Message Field */}
                <div>
                  <label
                    htmlFor="message"
                    className="block text-gray-700 font-medium mb-2"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Enter message"
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-200  bg-white  rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent transition-all resize-none"
                  />
                </div>

                {/* Submit Button */}
                <Button
                  onClick={handleSubmit}
                  className="w-full text-white font-semibold py-4 rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
                >
                  Submit
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </HomeLayout>
  );
};

export default ContactForm;

"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, MapPin, Mail, CheckCircle, X } from "lucide-react";
import Image from "next/image";
import { BackButton } from "../../../../components/ui/BackNavigation";
import { Button } from "../../../../components/ui/Button";

interface Service {
  id: number;
  image: string;
  title: string;
  description: string;
  fullDescription: string;
  category: string;
  deadline: string;
  startingBid: number;
  currentBid: number;
  totalBids: number;
  requiredSkills: string[];
  client: {
    name: string;
    username: string;
    avatar: string;
    bio: string;
    email: string;
    location: string;
  };
}

interface ServiceDetailPageProps {
  service?: Service;
  onBack?: () => void;
}

export default function ServiceDetailPage({
  service,
  onBack,
}: ServiceDetailPageProps) {
  const [activeTab, setActiveTab] = useState("reviews");
  const [showAlert, setShowAlert] = useState(false);

  // Default service data (you'd normally get this from props or API)
  const defaultService: Service = {
    id: 1,
    image: "/api/placeholder/400/500",
    title: "Custom wedding gown sewing",
    description:
      "Looking for a tailor to bring to life my wedding gown which has already be patterned out",
    fullDescription:
      "I'm looking for a skilled tailor to bring my design concept to life for an upcoming wedding. I have a clear vision, drafted patterns, and a collection of inspiration images for the wedding gown. The ideal candidate should be experienced in working with delicate fabrics like silk chiffon and be proficient in creating intricate beadwork. I need this gown completed within the next 6 weeks. I'm open to collaboration to refine the final design and ensure a perfect, flattering fit.",
    category: "Sewing and Tailoring",
    deadline: "2 weeks",
    startingBid: 100000,
    currentBid: 150000,
    totalBids: 5,
    requiredSkills: [
      "Fashion Design",
      "Pattern Drafting",
      "Alterations & Repairs",
      "Fabric Cutting & Laying",
    ],
    client: {
      name: "Amina Yusuf",
      username: "@aminat60",
      avatar: "/api/placeholder/80/80",
      bio: "Passionate about fusing traditional African textiles with modern silhouettes. Specializing in custom designs that celebrate culture while embracing contemporary style.",
      email: "aminayusuf@gmail.com",
      location: "Lagos, NG",
    },
  };

  const serviceData = service || defaultService;

  const reviews = [
    {
      id: 1,
      name: "Chioma O.",
      initials: "CO",
      rating: 4,
      comment:
        "Absolutely stunning work! The attention to detail is impeccable.",
      project: "Custom Evening Gown",
    },
    {
      id: 2,
      name: "Ibrahim K.",
      initials: "IK",
      rating: 5,
      comment: "Professional and creative. Delivered exactly what I wanted.",
      project: "Ankara Shirt Set",
    },
  ];

  const similarServices = [
    {
      id: 2,
      image: "/api/placeholder/300/400",
      title: "Custom wedding gown sewing",
      description:
        "Looking for a tailor to bring to life my wedding gown which has already be patterned out",
      username: "@sellers_username",
      bids: "5 - 10",
    },
    {
      id: 3,
      image: "/api/placeholder/300/400",
      title: "Custom wedding gown sewing",
      description:
        "Looking for a tailor to bring to life my wedding gown which has already be patterned out",
      username: "@sellers_username",
      bids: "5 - 10",
    },
  ];

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString();
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < rating
                ? "fill-yellow-400 text-yellow-400"
                : "fill-gray-200 text-gray-200"
            }`}
          />
        ))}
      </div>
    );
  };

  const handlePlaceBid = () => {
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-orange-50 to-white py-8">
      <div className="container mx-auto px-4">
        {onBack && (
          //   <button
          //     onClick={onBack}
          //     className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
          //   >
          //     <svg
          //       className="w-5 h-5"
          //       fill="none"
          //       stroke="currentColor"
          //       viewBox="0 0 24 24"
          //     >
          //       <path
          //         strokeLinecap="round"
          //         strokeLinejoin="round"
          //         strokeWidth={2}
          //         d="M15 19l-7-7 7-7"
          //       />
          //     </svg>
          //     Back
          //   </button>

          <BackButton />
        )}

        <div className="mb-6 text-sm text-gray-600">
          <span className="hover:text-gray-900 cursor-pointer">
            Marketplace
          </span>
          <span className="mx-2">/</span>
          <span className="hover:text-gray-900 cursor-pointer">Services</span>
          <span className="mx-2">/</span>
          <span className="text-[#FAB75B]">{serviceData.title}</span>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              className="bg-white rounded-2xl overflow-hidden shadow-lg"
            >
              <div className="aspect-4/3 bg-gray-100 relative">
                <Image
                  src={serviceData.image}
                  alt={serviceData.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="grid grid-cols-3 gap-2 p-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:opacity-75 transition-opacity relative"
                  >
                    <Image
                      src={serviceData.image}
                      alt={`Thumbnail ${i}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Service Details */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl p-8 shadow-lg"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Service Details
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {serviceData.fullDescription}
              </p>
            </motion.div>

            {/* Tabs Section */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl p-8 shadow-lg"
            >
              <div className="flex items-center gap-4 mb-6 border-b border-gray-200">
                <button
                  onClick={() => setActiveTab("reviews")}
                  className={`text-lg font-bold pb-4 border-b-2 transition-colors ${
                    activeTab === "reviews"
                      ? "text-gray-900 border-[#FAB75B]"
                      : "text-gray-500 border-transparent"
                  }`}
                >
                  Tailor&apos;s Reviews
                </button>
                <button
                  onClick={() => setActiveTab("client")}
                  className={`text-lg font-bold pb-4 border-b-2 transition-colors ${
                    activeTab === "client"
                      ? "text-gray-900 border-[#FAB75B]"
                      : "text-gray-500 border-transparent"
                  }`}
                >
                  Client&apos;s Information
                </button>
              </div>

              {activeTab === "reviews" ? (
                <>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="text-4xl font-bold text-gray-900">4.9</div>
                    <div>
                      {renderStars(5)}
                      <p className="text-sm text-gray-600 mt-1">
                        Based on 12 reviews
                      </p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {reviews.map((review) => (
                      <div
                        key={review.id}
                        className="border-b border-gray-100 pb-6 last:border-0"
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-full bg-[#543A2E] text-white flex items-center justify-center font-semibold">
                            {review.initials}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold text-gray-900">
                                {review.name}
                              </h4>
                              {renderStars(review.rating)}
                            </div>
                            <p className="text-gray-700 mb-2">
                              {review.comment}
                            </p>
                            <p className="text-sm text-gray-500">
                              Project: {review.project}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div>
                  <div className="flex items-start gap-6 mb-8">
                    <div className="w-20 h-20 rounded-full bg-gray-300 shrink-0 overflow-hidden relative">
                      <Image
                        src={serviceData.client.avatar}
                        alt={serviceData.client.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 mb-1">
                        {serviceData.client.name}
                      </h3>
                      <p className="text-gray-600 mb-4">
                        {serviceData.client.username}
                      </p>
                    </div>
                  </div>

                  <div className="mb-8">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">
                      BIO:
                    </h4>
                    <p className="text-gray-700 leading-relaxed">
                      {serviceData.client.bio}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-4">
                      CONTACT INFORMATION
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-gray-700">
                        <Mail className="w-5 h-5 text-gray-400" />
                        <span>{serviceData.client.email}</span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-700">
                        <MapPin className="w-5 h-5 text-gray-400" />
                        <span>{serviceData.client.location}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Similar Services */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                You might also like
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {similarServices.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
                  >
                    <div className="aspect-4/3 bg-gray-100 relative">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-gray-900 mb-2">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-3">
                        {item.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-gray-300"></div>
                          <span className="text-sm text-gray-600">
                            {item.username}
                          </span>
                        </div>
                        <span className="text-sm text-gray-600">
                          Bids: {item.bids}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              className="bg-white rounded-2xl p-6 shadow-lg sticky top-8"
            >
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                {serviceData.title}
              </h1>

              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-gray-300"></div>
                <span className="text-gray-700">
                  By {serviceData.client.username}
                </span>
              </div>

              <p className="text-gray-700 mb-6">{serviceData.description}</p>

              <div className="space-y-4 mb-6">
                <div>
                  <span className="text-gray-600">Category: </span>
                  <span className="font-semibold text-gray-900">
                    {serviceData.category}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Deadline set: </span>
                  <span className="font-semibold text-gray-900">
                    {serviceData.deadline}
                  </span>
                </div>
              </div>

              <div className="mb-6">
                <p className="text-sm text-gray-600 mb-2">Required Skills</p>
                <div className="flex flex-wrap gap-2">
                  {serviceData.requiredSkills.map(
                    (skill: string, index: number) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    )
                  )}
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Starting Bid</span>
                  <span className="font-semibold text-gray-900">
                    ₦{formatPrice(serviceData.startingBid)}
                  </span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Current Bid</span>
                  <span className="text-xl font-bold text-gray-900">
                    ₦{formatPrice(serviceData.currentBid)}
                  </span>
                </div>
                <div className="text-right text-sm text-gray-600">
                  {serviceData.totalBids} Bids
                </div>
              </div>

              <Button
                onClick={handlePlaceBid}
                className="w-full "
                variant="default"
                size="large"
              >
                Place Bid
              </Button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Custom MUI-style Snackbar Alert */}
      <AnimatePresence>
        {showAlert && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50"
          >
            <div className="bg-green-600 text-white px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3 min-w-[300px]">
              <CheckCircle className="w-6 h-6 shrink-0" />
              <span className="flex-1 font-medium">
                Bid placed successfully!
              </span>
              <button
                onClick={() => setShowAlert(false)}
                className="hover:bg-green-700 rounded-full p-1 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

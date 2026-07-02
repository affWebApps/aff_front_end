"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Star, MapPin, Mail, CheckCircle, X, Scissors } from "lucide-react";
import { BackButton } from "../../../../components/ui/BackNavigation";
import { Button } from "../../../../components/ui/Button";
import { ComingSoonGate } from "@/components/ui/ComingSoon";
import { useProject, useSubmitBid, useAllProjects } from "@/hooks/useProjects";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

function renderStars(rating: number) {
  return (
    <div className="flex gap-1">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"
            }`}
        />
      ))}
    </div>
  );
}

export default function ServiceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState("reviews");
  const [bidAmount, setBidAmount] = useState("");
  const [pitch, setPitch] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  const { data: project, isLoading, error } = useProject(id ?? null);
  const { mutate: submitBid, isPending: isSubmitting } = useSubmitBid(id ?? "");
  const { data: similarData } = useAllProjects({ status: "OPEN", limit: 3 });

  const similarProjects = (similarData?.data ?? []).filter((p) => p.id !== id).slice(0, 2);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white py-8">
        <div className="container mx-auto px-4 space-y-6 animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-64" />
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-2xl overflow-hidden shadow-lg">
                <div className="aspect-4/3 bg-gray-200" />
                <div className="grid grid-cols-3 gap-2 p-4">
                  {[1, 2, 3].map((i) => <div key={i} className="aspect-square bg-gray-200 rounded-lg" />)}
                </div>
              </div>
              <div className="bg-white rounded-2xl p-8 shadow-lg space-y-3">
                <div className="h-6 bg-gray-200 rounded w-1/3" />
                <div className="h-4 bg-gray-200 rounded w-full" />
                <div className="h-4 bg-gray-200 rounded w-5/6" />
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg space-y-4">
              <div className="h-6 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-10 bg-gray-200 rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white py-8">
        <div className="container mx-auto px-4">
          <BackButton />
          <div className="mt-6 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            {error instanceof Error ? error.message : "Project not found."}
          </div>
        </div>
      </div>
    );
  }

  const imageFiles = project.files?.filter((f) => f.file_type?.startsWith("image/")) ?? [];
  const mainImage = imageFiles[0]?.file_url ?? null;
  const thumbImages = imageFiles.slice(0, 3);

  const budget = parseFloat(project.budget) || 0;
  const handlePlaceBid = () => {
    if (!bidAmount) return;
    submitBid(
      { amount: Number(bidAmount), message: pitch || undefined },
      {
        onSuccess: () => {
          setShowAlert(true);
          setBidAmount("");
          setPitch("");
          setTimeout(() => setShowAlert(false), 4000);
        },
      }
    );
  };

  return (
    <ComingSoonGate enabled={false}>
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white py-8">
        <div className="container mx-auto px-4">
          <BackButton />

          <div className="mb-6 text-sm text-gray-600">
            <span onClick={() => router.push("/marketplace")} className="hover:text-gray-900 cursor-pointer">Marketplace</span>
            <span className="mx-2">/</span>
            <span onClick={() => router.push("/marketplace?tab=services")} className="hover:text-gray-900 cursor-pointer">Services</span>
            <span className="mx-2">/</span>
            <span className="text-[#FAB75B]">{project.title}</span>
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
                <div className="aspect-4/3 bg-gray-100 relative flex items-center justify-center">
                  {mainImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={mainImage} alt={project.title} className="w-full h-full object-cover" />
                  ) : (
                    <Scissors size={48} className="text-gray-300" />
                  )}
                </div>
                {thumbImages.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 p-4">
                    {thumbImages.map((f, i) => (
                      <div key={f.id} className="aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:opacity-75 transition-opacity">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={f.file_url} alt={`Thumbnail ${i + 1}`} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                )}
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
                  <span className="sm:hidden">{project.title}</span>
                  <span className="hidden sm:inline">Service Details</span>
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  {project.description ?? "No description provided."}
                </p>
              </motion.div>

              {/* Tabs */}
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
                    className={`text-lg font-bold pb-4 border-b-2 transition-colors ${activeTab === "reviews" ? "text-gray-900 border-[#FAB75B]" : "text-gray-500 border-transparent"
                      }`}
                  >
                    Tailor&apos;s Reviews
                  </button>
                  <button
                    onClick={() => setActiveTab("client")}
                    className={`text-lg font-bold pb-4 border-b-2 transition-colors ${activeTab === "client" ? "text-gray-900 border-[#FAB75B]" : "text-gray-500 border-transparent"
                      }`}
                  >
                    Client&apos;s Information
                  </button>
                </div>

                {activeTab === "reviews" ? (
                  <div className="flex items-center gap-4 text-gray-500 text-sm py-4">
                    {renderStars(0)}
                    <span>No reviews yet.</span>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-start gap-6 mb-8">
                      <div className="w-20 h-20 rounded-full bg-[#5C4033] text-white flex items-center justify-center text-2xl font-bold shrink-0">
                        {project.designer_id.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-gray-900 mb-1">Designer</h3>
                        <p className="text-gray-500 text-sm">ID: {project.designer_id}</p>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-4">CONTACT INFORMATION</h4>
                      <div className="space-y-3 text-gray-500 text-sm">
                        <div className="flex items-center gap-3">
                          <Mail className="w-5 h-5 text-gray-400" />
                          <span>Contact not available</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <MapPin className="w-5 h-5 text-gray-400" />
                          <span>Location not available</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>

              {/* You might also like */}
              {similarProjects.length > 0 && (
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={fadeInUp}
                  transition={{ delay: 0.3 }}
                >
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">You might also like</h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    {similarProjects.map((item) => {
                      const thumb = item.files?.find((f) => f.file_type?.startsWith("image/"))?.file_url;
                      return (
                        <div
                          key={item.id}
                          onClick={() => router.push(`/marketplace/services/${item.id}`)}
                          className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
                        >
                          <div className="aspect-4/3 bg-gray-100 flex items-center justify-center relative">
                            {thumb ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={thumb} alt={item.title} className="w-full h-full object-cover" />
                            ) : (
                              <Scissors size={32} className="text-gray-300" />
                            )}
                          </div>
                          <div className="p-4">
                            <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                            <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.description ?? ""}</p>
                            <div className="flex items-center justify-between text-sm text-gray-600">
                              <span>Budget: ₦{Number(item.budget).toLocaleString()}</span>
                              <span>Bids: {item.bids?.length ?? 0}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
                className="bg-white rounded-2xl p-6 shadow-lg sticky top-8"
              >
                <h1 className="text-2xl font-bold text-gray-900 mb-4">{project.title}</h1>

                <p className="text-gray-700 mb-6 text-sm leading-relaxed">
                  {project.description ?? ""}
                </p>

                <div className="space-y-3 mb-6 text-sm">
                  {project.estimated_time && (
                    <div>
                      <span className="text-gray-600">Deadline set: </span>
                      <span className="font-semibold text-gray-900">{project.estimated_time}</span>
                    </div>
                  )}
                  {project.deadline && (
                    <div>
                      <span className="text-gray-600">Due: </span>
                      <span className="font-semibold text-gray-900">
                        {new Date(project.deadline).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>

                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <div className="flex justify-between items-center mb-2 text-sm">
                    <span className="text-gray-600">Budget</span>
                    <span className="font-semibold text-gray-900">₦{budget.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600 text-sm">Current Bids</span>
                    <span className="text-xl font-bold text-gray-900">{project.bids?.length ?? 0}</span>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bid amount</label>
                    <input
                      type="number"
                      min={0}
                      placeholder="Enter bid amount"
                      value={bidAmount}
                      onChange={(e) => setBidAmount(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Pitch</label>
                    <textarea
                      rows={4}
                      placeholder="Write a short pitch to position yourself better"
                      value={pitch}
                      onChange={(e) => setPitch(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent resize-none"
                    />
                  </div>
                </div>

                <Button
                  onClick={handlePlaceBid}
                  className="w-full"
                  variant="default"
                  size="large"
                  disabled={isSubmitting || !bidAmount}
                >
                  {isSubmitting ? "Placing…" : "Place Bid"}
                </Button>
              </motion.div>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {showAlert && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50"
            >
              <div className="bg-green-600 text-white px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3 min-w-[300px]">
                <CheckCircle className="w-6 h-6 shrink-0" />
                <span className="flex-1 font-medium">Bid placed successfully!</span>
                <button onClick={() => setShowAlert(false)} className="hover:bg-green-700 rounded-full p-1 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ComingSoonGate>
  );
}

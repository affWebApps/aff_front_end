import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar } from "lucide-react";
import { Button } from "../../../components/ui/Button";

const NewsletterView = () => {
  const [subjectLine, setSubjectLine] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [targetAudience, setTargetAudience] = useState("all-users");
  const [scheduleOption, setScheduleOption] = useState("schedule");
  const [scheduledDate, setScheduledDate] = useState("");

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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const audiences = [
    { id: "all-users", label: "All Users", count: 1234 },
    { id: "all-subscribers", label: "All Subscribers", count: 821 },
    { id: "designers-only", label: "Designers only", count: 720 },
    { id: "tailors-only", label: "Tailors only", count: 514 },
  ];

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      <motion.h2
        variants={itemVariants}
        className="text-xl font-medium text-gray-900 mb-1 font-(family-name:--font-montserrat)"
      >
        Newsletter Campaign
      </motion.h2>
      <motion.p variants={itemVariants} className="text-gray-600 text-sm mb-6">
        Create and send email newsletters to your audience
      </motion.p>

      {/* Email Content Section */}
      <motion.div
        variants={itemVariants}
        className="bg-white rounded-lg border border-gray-200 p-6 mb-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          Email Content
        </h3>

        {/* Subject Line */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Subject Line
          </label>
          <input
            type="text"
            value={subjectLine}
            onChange={(e) => setSubjectLine(e.target.value)}
            placeholder="Enter your email subject"
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        {/* Email Body */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email body
          </label>
          <textarea
            value={emailBody}
            onChange={(e) => setEmailBody(e.target.value)}
            placeholder="Write your newsletter content here..."
            rows={6}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
          />
        </div>

        {/* Insert Image */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Insert Image
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
            <input
              type="file"
              id="image-upload"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <label
              htmlFor="image-upload"
              className="cursor-pointer text-gray-600"
            >
              <span className="text-amber-600 hover:text-amber-700">
                Choose File
              </span>
              <span className="ml-2">
                {imageFile ? imageFile.name : "No file chosen"}
              </span>
            </label>
            <p className="text-xs text-gray-500 mt-2">
              Recommended: Square image, at least 200x200px
            </p>
          </div>
        </div>
      </motion.div>

      {/* Target Audience Section */}
      <motion.div
        variants={itemVariants}
        className="bg-white rounded-lg border border-gray-200 p-6 mb-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          Target Audience
        </h3>

        <div className="space-y-3">
          {audiences.map((audience) => (
            <label
              key={audience.id}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  name="audience"
                  value={audience.id}
                  checked={targetAudience === audience.id}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  className="w-4 h-4 text-amber-600 focus:ring-amber-500"
                />
                <span className="text-gray-900">{audience.label}</span>
              </div>
              <span className="text-gray-500 text-sm">{audience.count}</span>
            </label>
          ))}
        </div>
      </motion.div>

      {/* Schedule Section */}
      <motion.div
        variants={itemVariants}
        className="bg-white rounded-lg border border-gray-200 p-6 mb-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-6 font-(family-name:--font-montserrat)">
          Schedule
        </h3>

        <div className="space-y-3 mb-4">
          <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
            <input
              type="radio"
              name="schedule"
              value="send-now"
              checked={scheduleOption === "send-now"}
              onChange={(e) => setScheduleOption(e.target.value)}
              className="w-4 h-4 text-amber-600 focus:ring-amber-500"
            />
            <span className="text-gray-900">Send Now</span>
          </label>

          <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
            <input
              type="radio"
              name="schedule"
              value="schedule"
              checked={scheduleOption === "schedule"}
              onChange={(e) => setScheduleOption(e.target.value)}
              className="w-4 h-4 text-amber-600 focus:ring-amber-500"
            />
            <span className="text-gray-900">Schedule for later</span>
          </label>
        </div>

        {scheduleOption === "schedule" && (
          <div className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg">
            <Calendar className="w-5 h-5 text-gray-500" />
            <input
              type="text"
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
              placeholder="dd/mm/yy --- : ---"
              className="flex-1 outline-none text-gray-700"
            />
          </div>
        )}
      </motion.div>

      {/* Action Buttons */}
      <motion.div variants={itemVariants} className="flex justify-end gap-4">
        <Button outlined={true}> Save to Draft</Button>
        <Button variant="default">Send</Button>
      </motion.div>
    </motion.div>
  );
};

export default NewsletterView;

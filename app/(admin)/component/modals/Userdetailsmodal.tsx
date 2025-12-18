// UserDetailsModal.tsx
import { Calendar, Clock, Star } from "lucide-react";
import { User } from "../../types/adminTypes";

interface UserDetailsModalProps {
  user: User;
}

const UserDetailsModal = ({ user }: UserDetailsModalProps) => {
  return (
    <div className="space-y-8  overflow-y-auto px-6 py-4">
      <div className="flex items-start gap-6">
        <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center text-6xl shrink-0">
          {user.image}
        </div>
        <div className="flex-1">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-500">Full Name</label>
              <p className="font-semibold text-gray-900">{user.name}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Email</label>
              <p className="font-semibold text-gray-900">{user.email}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Contact Number</label>
              <p className="font-semibold text-gray-900">
                {user.contact || "+234 90 123 45 678"}
              </p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Location</label>
              <p className="font-semibold text-gray-900">
                {user.location || "Lagos, NG"}
              </p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Role</label>
              <p className="font-semibold text-gray-900">{user.role}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Date joined</label>
              <p className="font-semibold text-gray-900">{user.dateJoined}</p>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                user.status === "Active"
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {user.status}
            </span>
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-gray-900 mb-3">Bio</h3>
        <p className="text-gray-700 leading-relaxed">
          {user.bio ||
            "With over 15 years of experience in custom tailoring and alterations, I specialize in creating perfectly fitted garments for every occasion. From wedding dresses to business suits, I bring precision and care to every project. My attention to detail ensures that each piece is tailored to your exact specifications and comfort."}
        </p>
      </div>

      {user.availability && (
        <div>
          <h3 className="font-semibold text-gray-900 mb-4">Availability</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-gray-500" />
              <span className="text-sm text-gray-600">Mon - Fri</span>
              <Clock className="w-5 h-5 text-gray-500 ml-4" />
              <span className="text-sm text-gray-900 font-medium">
                {user.availability.weekdays}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-gray-500" />
              <span className="text-sm text-gray-600">Sat</span>
              <Clock className="w-5 h-5 text-gray-500 ml-4" />
              <span className="text-sm text-gray-900 font-medium">
                {user.availability.weekend}
              </span>
            </div>
          </div>
        </div>
      )}

      {user.activitySummary && (
        <div>
          <h3 className="font-semibold text-gray-900 mb-4">Activity Summary</h3>
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <p className="text-3xl font-bold text-gray-900">
                {user.activitySummary.projectsPosted}
              </p>
              <p className="text-sm text-gray-600 mt-1">Projects Posted</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <p className="text-3xl font-bold text-gray-900">
                {user.activitySummary.projectsCompleted}
              </p>
              <p className="text-sm text-gray-600 mt-1">Projects Completed</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <p className="text-3xl font-bold text-gray-900">
                {user.activitySummary.productsListed}
              </p>
              <p className="text-sm text-gray-600 mt-1">Products Listed</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <p className="text-3xl font-bold text-gray-900">
                {user.activitySummary.productsSold}
              </p>
              <p className="text-sm text-gray-600 mt-1">Products Sold</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDetailsModal;

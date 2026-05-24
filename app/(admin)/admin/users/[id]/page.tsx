"use client";
import { use, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  ArrowLeft, Star, MapPin, Phone, Mail, Calendar, Shield,
  Briefcase, BookOpen, Gavel, Power, X, ChevronLeft, ChevronRight,
  Clock, DollarSign,
} from "lucide-react";
import { useUser, useUpdateUserStatus, useProject } from "@/hooks/useUsers";
import { Portfolio } from "@/services/authServices";

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={14}
          className={i <= rating ? "text-amber-400 fill-amber-400" : "text-gray-200 fill-gray-200"}
        />
      ))}
    </div>
  );
}

function ReviewerInfo({ reviewerId }: { reviewerId: string }) {
  const { data: reviewer } = useUser(reviewerId);
  const name =
    [reviewer?.first_name, reviewer?.last_name].filter(Boolean).join(" ") ||
    reviewer?.display_name ||
    "Unknown";

  return (
    <div className="flex items-center gap-2">
      <div className="w-7 h-7 rounded-full bg-gray-200 overflow-hidden shrink-0 flex items-center justify-center text-xs text-gray-400">
        {reviewer?.avatar_url ? (
          <Image src={reviewer.avatar_url} alt={name} width={28} height={28} className="object-cover w-full h-full" />
        ) : (
          name.charAt(0).toUpperCase()
        )}
      </div>
      <span className="text-xs font-medium text-gray-700">{reviewer ? name : "Loading…"}</span>
    </div>
  );
}

function StatusBadge({ status }: { status?: string }) {
  if (!status) return null;
  const s = status.toLowerCase();
  const styles =
    s === "completed" ? "bg-green-100 text-green-700" :
    s === "cancelled" || s === "rejected" ? "bg-red-100 text-red-600" :
    s === "active" || s === "accepted" ? "bg-blue-50 text-blue-600" :
    "bg-gray-100 text-gray-600";
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${styles}`}>
      {status}
    </span>
  );
}

function ProjectModal({
  projectId,
  onClose,
}: {
  projectId: string;
  onClose: () => void;
}) {
  const { data: project, isLoading, isError } = useProject(projectId);
  const [activeIdx, setActiveIdx] = useState(0);

  const files = project?.files ?? [];
  const fmt = (date: string) =>
    new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">
            {isLoading ? "Loading…" : (project?.title ?? "Project Details")}
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
            <X size={18} className="text-gray-500" />
          </button>
        </div>

        {isLoading && (
          <div className="p-10 text-center text-sm text-gray-400">Loading project details…</div>
        )}
        {isError && (
          <div className="p-10 text-center text-sm text-red-500">Failed to load project details.</div>
        )}

        {project && !isLoading && (
          <>
            {/* File gallery */}
            {files.length > 0 && (
              <div className="p-5">
                <div className="relative h-64 bg-gray-100 rounded-xl overflow-hidden mb-3">
                  <Image
                    src={files[activeIdx].file_url}
                    alt={project.title}
                    fill
                    className="object-cover"
                  />
                  {files.length > 1 && (
                    <>
                      <button
                        onClick={() => setActiveIdx((i) => (i - 1 + files.length) % files.length)}
                        className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-1.5 transition-colors"
                      >
                        <ChevronLeft size={18} />
                      </button>
                      <button
                        onClick={() => setActiveIdx((i) => (i + 1) % files.length)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-1.5 transition-colors"
                      >
                        <ChevronRight size={18} />
                      </button>
                      <span className="absolute bottom-3 right-3 bg-black/40 text-white text-xs px-2 py-1 rounded-full">
                        {activeIdx + 1} / {files.length}
                      </span>
                    </>
                  )}
                </div>
                {files.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {files.map((f, i) => (
                      <button
                        key={f.id}
                        onClick={() => setActiveIdx(i)}
                        className={`relative w-16 h-16 shrink-0 rounded-lg overflow-hidden border-2 transition-colors ${
                          i === activeIdx ? "border-[#5C4033]" : "border-transparent"
                        }`}
                      >
                        <Image src={f.file_url} alt="" fill className="object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="px-5 pb-5 space-y-5">
              {/* Meta badges */}
              <div className="flex flex-wrap items-center gap-2">
                {project.status && <StatusBadge status={project.status} />}
                {project.budget != null && (
                  <span className="flex items-center gap-1 text-xs text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
                    <DollarSign size={11} /> {project.budget}
                  </span>
                )}
                {project.estimated_time && (
                  <span className="flex items-center gap-1 text-xs text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
                    <Clock size={11} /> {project.estimated_time}
                  </span>
                )}
                {project.deadline && (
                  <span className="flex items-center gap-1 text-xs text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
                    <Calendar size={11} /> Due {fmt(project.deadline)}
                  </span>
                )}
                <span className="text-xs text-gray-400">
                  Created {fmt(project.created_at)}
                </span>
              </div>

              {/* Description */}
              {project.description && (
                <div>
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">Description</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{project.description}</p>
                </div>
              )}

              {/* Requirements */}
              {project.requirements?.length > 0 && (() => {
                const filled = project.requirements.filter(
                  (r) => r.content && Object.values(r.content).some((v) => v?.trim())
                );
                if (!filled.length) return null;
                return (
                  <div>
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">Requirements</p>
                    <div className="space-y-3">
                      {filled.map((req) => (
                        <div key={req.id} className="border border-gray-100 rounded-lg p-4 space-y-2">
                          {Object.entries(req.content!).map(([key, val]) =>
                            val?.trim() ? (
                              <div key={key}>
                                <p className="text-xs text-gray-400 capitalize">{key.replace(/_/g, " ")}</p>
                                <p className="text-sm text-gray-700">{val}</p>
                              </div>
                            ) : null
                          )}
                          <div className="flex gap-3 pt-1 text-xs">
                            <span className={req.designer_approved ? "text-green-600" : "text-gray-400"}>
                              {req.designer_approved ? "✓" : "✗"} Designer approved
                            </span>
                            <span className={req.tailor_approved ? "text-green-600" : "text-gray-400"}>
                              {req.tailor_approved ? "✓" : "✗"} Tailor approved
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}

              {/* Reviews */}
              {project.reviews?.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">Reviews</p>
                  <div className="space-y-3">
                    {project.reviews.map((review) => (
                      <div key={review.id} className="border border-gray-100 rounded-lg p-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <ReviewerInfo reviewerId={review.reviewer_id} />
                          <span className="text-xs text-gray-400 capitalize">{review.target_type}</span>
                        </div>
                        <StarRating rating={review.rating} />
                        {review.comment && (
                          <p className="text-sm text-gray-700">{review.comment}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function PortfolioModal({
  portfolio,
  onClose,
}: {
  portfolio: Portfolio;
  onClose: () => void;
}) {
  const [activeIdx, setActiveIdx] = useState(0);
  const images = portfolio.Image ?? [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">{portfolio.title}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
            <X size={18} className="text-gray-500" />
          </button>
        </div>

        {/* Image gallery */}
        {images.length > 0 && (
          <div className="p-5">
            <div className="relative h-72 bg-gray-100 rounded-xl overflow-hidden mb-3">
              <Image
                src={images[activeIdx].image_url}
                alt={portfolio.title}
                fill
                className="object-cover"
              />
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setActiveIdx((i) => (i - 1 + images.length) % images.length)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-1.5 transition-colors"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    onClick={() => setActiveIdx((i) => (i + 1) % images.length)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-1.5 transition-colors"
                  >
                    <ChevronRight size={18} />
                  </button>
                  <span className="absolute bottom-3 right-3 bg-black/40 text-white text-xs px-2 py-1 rounded-full">
                    {activeIdx + 1} / {images.length}
                  </span>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {images.map((img, i) => (
                  <button
                    key={img.id}
                    onClick={() => setActiveIdx(i)}
                    className={`relative w-16 h-16 shrink-0 rounded-lg overflow-hidden border-2 transition-colors ${
                      i === activeIdx ? "border-[#5C4033]" : "border-transparent"
                    }`}
                  >
                    <Image src={img.image_url} alt="" fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Details */}
        <div className="px-5 pb-5 space-y-3">
          {portfolio.description && (
            <p className="text-sm text-gray-600 leading-relaxed">{portfolio.description}</p>
          )}
          <p className="text-xs text-gray-400">
            Created {new Date(portfolio.created_at).toLocaleDateString("en-US", {
              month: "long", day: "numeric", year: "numeric",
            })}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function UserProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { data: user, isLoading, isError } = useUser(id);
  const updateStatus = useUpdateUserStatus(id);
  const [selectedPortfolio, setSelectedPortfolio] = useState<Portfolio | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400 text-sm">
        Loading profile…
      </div>
    );
  }

  if (isError || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500 text-sm">
        Failed to load user profile.
      </div>
    );
  }

  const name =
    [user.first_name, user.last_name].filter(Boolean).join(" ") ||
    user.display_name || "—";
  const location = [user.city, user.country].filter(Boolean).join(", ");
  const dateJoined = new Date(user.created_at).toLocaleDateString("en-US", {
    month: "long", day: "numeric", year: "numeric",
  });
  const lastSeen = user.last_logout_at
    ? new Date(user.last_logout_at).toLocaleDateString("en-US", {
        month: "short", day: "numeric", year: "numeric",
      })
    : "Still active";

  const avgRating =
    user.reviews_received.length > 0
      ? user.reviews_received.reduce((sum, r) => sum + r.rating, 0) / user.reviews_received.length
      : null;

  const fmt = (date: string) =>
    new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  return (
    <>
      {selectedPortfolio && (
        <PortfolioModal portfolio={selectedPortfolio} onClose={() => setSelectedPortfolio(null)} />
      )}
      {selectedProjectId && (
        <ProjectModal projectId={selectedProjectId} onClose={() => setSelectedProjectId(null)} />
      )}

      <div className="max-w-5xl mx-auto px-6 py-10 space-y-6">
        {/* Back */}
        <button
          onClick={() => router.push("/admin/dashboard?view=users")}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors text-sm"
        >
          <ArrowLeft size={18} />
          Back to Users
        </button>

        {/* Hero card */}
        <div className="relative bg-white rounded-xl border border-gray-100 shadow-sm p-8">
          <button
            onClick={() => updateStatus.mutate(!user.is_active)}
            disabled={updateStatus.isPending}
            className={`absolute top-6 right-6 flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
              user.is_active
                ? "bg-red-500 text-white hover:bg-red-600"
                : "bg-green-600 text-white hover:bg-green-700"
            }`}
          >
            <Power size={13} />
            {updateStatus.isPending ? "Saving…" : user.is_active ? "Deactivate" : "Activate"}
          </button>

          <div className="flex flex-col sm:flex-row items-start gap-8">
            <div className="w-28 h-28 rounded-full bg-gray-100 shrink-0 overflow-hidden flex items-center justify-center text-5xl">
              {user.avatar_url ? (
                <Image src={user.avatar_url} alt={name} width={112} height={112} className="w-full h-full object-cover" />
              ) : (
                <span>👤</span>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h1 className="text-2xl font-bold text-gray-900">{name}</h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#5C4033]/10 text-[#5C4033] uppercase">
                  {user.role}
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${user.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                  {user.is_active ? "Active" : "Inactive"}
                </span>
                <span className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${user.is_verified ? "bg-blue-50 text-blue-600" : "bg-orange-50 text-orange-500"}`}>
                  <Shield size={11} />
                  {user.is_verified ? "Verified" : "Unverified"}
                </span>
              </div>

              {user.auth_provider && (
                <p className="text-xs text-gray-400 mt-2 mb-4">
                  Signed in via {user.auth_provider.charAt(0) + user.auth_provider.slice(1).toLowerCase()}
                </p>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail size={15} className="text-gray-400 shrink-0" />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Phone size={15} className="text-gray-400 shrink-0" />
                  <span>{user.phone_number || "—"}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin size={15} className="text-gray-400 shrink-0" />
                  <span>{location || "—"}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar size={15} className="text-gray-400 shrink-0" />
                  <span>Joined {dateJoined}</span>
                </div>
              </div>

              {avgRating !== null && (
                <div className="flex items-center gap-2 mt-4">
                  <StarRating rating={Math.round(avgRating)} />
                  <span className="text-sm text-gray-500">
                    {avgRating.toFixed(1)} · {user.reviews_received.length} review{user.reviews_received.length !== 1 ? "s" : ""}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { icon: Briefcase, label: "Projects", count: user.projects?.length ?? 0 },
            { icon: BookOpen, label: "Portfolios", count: user.portfolios?.length ?? 0 },
            { icon: Gavel, label: "Bids", count: user.bids?.length ?? 0 },
            { icon: Star, label: "Reviews", count: user.reviews_received?.length ?? 0 },
          ].map(({ icon: Icon, label, count }) => (
            <div key={label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 text-center">
              <Icon size={20} className="text-[#5C4033] mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">{count}</p>
              <p className="text-xs text-gray-500 mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Bio */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-semibold text-gray-900 mb-3">Bio</h2>
          <p className="text-sm text-gray-600 leading-relaxed">{user.bio || "No bio provided."}</p>
        </div>

        {/* Projects */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-semibold text-gray-900 mb-4">
            Projects <span className="text-gray-400 font-normal">({user.projects?.length ?? 0})</span>
          </h2>
          {!user.projects?.length ? (
            <p className="text-sm text-gray-400">No projects yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {user.projects.map((project: any) => (
                <button
                  key={project.id}
                  onClick={() => setSelectedProjectId(project.id)}
                  className="border border-gray-100 rounded-lg p-4 space-y-2 text-left hover:shadow-md hover:border-gray-200 transition-all"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-gray-900 text-sm leading-snug">{project.title ?? "Untitled project"}</h3>
                    <StatusBadge status={project.status} />
                  </div>
                  {project.description && (
                    <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{project.description}</p>
                  )}
                  <div className="flex flex-wrap gap-3 text-xs text-gray-400 pt-1">
                    {project.budget && (
                      <span className="flex items-center gap-1">
                        <DollarSign size={11} /> {project.budget}
                      </span>
                    )}
                    {project.deadline && (
                      <span className="flex items-center gap-1">
                        <Clock size={11} /> Due {fmt(project.deadline)}
                      </span>
                    )}
                    {project.created_at && (
                      <span className="flex items-center gap-1">
                        <Calendar size={11} /> {fmt(project.created_at)}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#5C4033] font-medium pt-1">View details →</p>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Portfolios */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-semibold text-gray-900 mb-4">
            Portfolios <span className="text-gray-400 font-normal">({user.portfolios?.length ?? 0})</span>
          </h2>
          {!user.portfolios?.length ? (
            <p className="text-sm text-gray-400">No portfolios yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {user.portfolios.map((portfolio) => {
                const primaryImage =
                  portfolio.Image?.find((img) => img.is_primary) ?? portfolio.Image?.[0];
                return (
                  <button
                    key={portfolio.id}
                    onClick={() => setSelectedPortfolio(portfolio)}
                    className="border border-gray-100 rounded-lg overflow-hidden text-left hover:shadow-md hover:border-gray-200 transition-all"
                  >
                    {primaryImage && (
                      <div className="relative h-44 bg-gray-100">
                        <Image src={primaryImage.image_url} alt={portfolio.title} fill className="object-cover" />
                      </div>
                    )}
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 text-sm mb-1">{portfolio.title}</h3>
                      <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{portfolio.description}</p>
                      <p className="text-xs text-gray-400 mt-2">
                        {fmt(portfolio.created_at)}
                        {portfolio.Image?.length > 1 && ` · ${portfolio.Image.length} images`}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Bids */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-semibold text-gray-900 mb-4">
            Bids <span className="text-gray-400 font-normal">({user.bids?.length ?? 0})</span>
          </h2>
          {!user.bids?.length ? (
            <p className="text-sm text-gray-400">No bids yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {user.bids.map((bid: any) => (
                <button
                  key={bid.id}
                  onClick={() => bid.project_id && setSelectedProjectId(bid.project_id)}
                  disabled={!bid.project_id}
                  className="border border-gray-100 rounded-lg p-4 space-y-2 text-left hover:shadow-md hover:border-gray-200 transition-all disabled:cursor-default disabled:hover:shadow-none disabled:hover:border-gray-100"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-gray-900 text-sm">
                      {bid.project?.title ?? bid.project_id ?? "Bid"}
                    </h3>
                    <StatusBadge status={bid.status} />
                  </div>
                  {bid.proposal && (
                    <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{bid.proposal}</p>
                  )}
                  <div className="flex flex-wrap gap-3 text-xs text-gray-400 pt-1">
                    {bid.amount && (
                      <span className="flex items-center gap-1">
                        <DollarSign size={11} /> {bid.amount}
                      </span>
                    )}
                    {bid.delivery_days && (
                      <span className="flex items-center gap-1">
                        <Clock size={11} /> {bid.delivery_days} days
                      </span>
                    )}
                    {bid.created_at && (
                      <span className="flex items-center gap-1">
                        <Calendar size={11} /> {fmt(bid.created_at)}
                      </span>
                    )}
                  </div>
                  {bid.project_id && (
                    <p className="text-xs text-[#5C4033] font-medium pt-1">View project →</p>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Reviews */}
        {user.reviews_received?.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-semibold text-gray-900 mb-4">
              Reviews <span className="text-gray-400 font-normal">({user.reviews_received.length})</span>
            </h2>
            <div className="space-y-4">
              {user.reviews_received.map((review) => (
                <div key={review.id} className="border border-gray-100 rounded-lg p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <ReviewerInfo reviewerId={review.reviewer_id} />
                    <span className="text-xs text-gray-400 capitalize">{review.target_type}</span>
                  </div>
                  <StarRating rating={review.rating} />
                  {review.comment && (
                    <p className="text-sm text-gray-700">{review.comment}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Account Details */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Account Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-8 text-sm">
            <div>
              <p className="text-xs text-gray-400 mb-0.5">User ID</p>
              <p className="text-gray-700 font-mono text-xs">{user.id}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-0.5">Last seen</p>
              <p className="text-gray-700">{lastSeen}</p>
            </div>
            {user.vendor_id && (
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Vendor ID</p>
                <p className="text-gray-700 font-mono text-xs">{user.vendor_id}</p>
              </div>
            )}
            {user.customer_id && (
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Customer ID</p>
                <p className="text-gray-700 font-mono text-xs">{user.customer_id}</p>
              </div>
            )}
            <div>
              <p className="text-xs text-gray-400 mb-0.5">Last updated</p>
              <p className="text-gray-700">{fmt(user.updated_at)}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

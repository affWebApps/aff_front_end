"use client";
import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import TabNavigation from "../../component/Tabnavigation";
import ContentManagementView from "../../component/Contentmanagementview";
import AnalyticsView from "../../component/Analyticsview";
import AppConfigurationView from "../../component/Appconfigurationview";
import NewsletterView from "../../component/Newsletterview";
import UsersView from "../../component/Usersview";
import ProjectsView from "../../component/Projectsview";

const VALID_VIEWS = ["dashboard", "users", "projects"] as const;
type ViewParam = (typeof VALID_VIEWS)[number];

const VALID_TABS = ["content", "analytics", "config", "newsletter"] as const;
type TabParam = (typeof VALID_TABS)[number];

function AdminDashboardInner() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const rawView = searchParams.get("view") ?? "dashboard";
  const currentView: ViewParam = (VALID_VIEWS as readonly string[]).includes(rawView)
    ? (rawView as ViewParam)
    : "dashboard";

  const rawTab = searchParams.get("tab") ?? "content";
  const activeTab: TabParam = (VALID_TABS as readonly string[]).includes(rawTab)
    ? (rawTab as TabParam)
    : "content";

  const navigateTo = (view: "users" | "projects", role?: string) => {
    const params = new URLSearchParams();
    params.set("view", view);
    if (role) params.set("role", role);
    router.push(`?${params.toString()}`);
  };

  const handleBackToDashboard = () => {
    const params = new URLSearchParams();
    // omit view=dashboard (it is the default)
    router.push(`?${params.toString()}`);
  };

  const handleTabChange = (tab: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (tab === "content") {
      params.delete("tab");
    } else {
      params.set("tab", tab);
    }
    router.replace(`?${params.toString()}`);
  };

  const pageVariants = {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
  };

  return (
    <div className="min-h-screen bg-white">
      <main className="px-6 py-8 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 font-(family-name:--font-montserrat)">
            AFF Admin
          </h1>
          <p className="text-gray-600">Manage platform content and analytics</p>
        </div>

        <AnimatePresence mode="wait">
          {currentView === "dashboard" && (
            <motion.div
              key="dashboard"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              <TabNavigation activeTab={activeTab} onTabChange={handleTabChange} />

              {activeTab === "content" && <ContentManagementView />}
              {activeTab === "analytics" && (
                <AnalyticsView onNavigate={navigateTo} />
              )}
              {activeTab === "config" && <AppConfigurationView />}
              {activeTab === "newsletter" && <NewsletterView />}
            </motion.div>
          )}

          {currentView === "users" && (
            <UsersView onBack={handleBackToDashboard} />
          )}

          {currentView === "projects" && (
            <ProjectsView onBack={handleBackToDashboard} />
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center text-gray-400">Loading…</div>}>
      <AdminDashboardInner />
    </Suspense>
  );
}

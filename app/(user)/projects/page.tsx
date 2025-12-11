"use client";
import React, { useState } from "react";
import { Grid, List, MoreVertical, Plus } from "lucide-react";
import { Button } from "../../../components/ui/Button";

const ProjectManager = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [viewMode, setViewMode] = useState("grid");

  const projects = [
    {
      id: 1,
      name: "Two-piece design",
      lastModified: "42 minutes ago",
      edited: "Edited 5 mins ago",
      dateCreated: "3 Nov 2025",
    },
    {
      id: 2,
      name: "Untitled design",
      lastModified: "30 minutes ago",
      edited: "Edited 2 weeks ago",
      dateCreated: "23 Oct 2025",
    },
    {
      id: 3,
      name: "Corporate shirt",
      lastModified: "1 hour ago",
      edited: "Edited 3 months ago",
      dateCreated: "15 Oct 2025",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex justify-between items-center gap-4 mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800 font-(family-name:--font-montserrat)">
          My Projects
        </h1>
        <Button size="small">
          <Plus size={16} className="sm:w-5 sm:h-5" />
          <span className="hidden sm:inline">Start Project</span>
        </Button>
      </div>

      {/* Tabs and View Toggle */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex gap-4 sm:gap-8 border-b border-gray-300 overflow-x-auto w-full sm:w-auto">
          <button
            onClick={() => setActiveTab("all")}
            className={`pb-3 px-1 whitespace-nowrap ${
              activeTab === "all"
                ? "border-b-2 border-gray-800 text-gray-800 font-medium font-(family-name:--font-montserrat)"
                : "text-gray-500"
            }`}
          >
            All projects
          </button>
          <button
            onClick={() => setActiveTab("drafts")}
            className={`pb-3 px-1 whitespace-nowrap ${
              activeTab === "drafts"
                ? "border-b-2 border-gray-800 text-gray-800 font-medium font-(family-name:--font-montserrat)"
                : "text-gray-500"
            }`}
          >
            Drafts
          </button>
          <button
            onClick={() => setActiveTab("trash")}
            className={`pb-3 px-1 whitespace-nowrap ${
              activeTab === "trash"
                ? "border-b-2 border-gray-800 text-gray-800 font-medium font-(family-name:--font-montserrat)"
                : "text-gray-500"
            }`}
          >
            Trash
          </button>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded ${
              viewMode === "grid"
                ? "bg-[#5C4033] text-white"
                : "bg-gray-200 text-gray-600"
            }`}
          >
            <Grid size={20} />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded ${
              viewMode === "list"
                ? "bg-[#5C4033] text-white"
                : "bg-gray-200 text-gray-600"
            }`}
          >
            <List size={20} />
          </button>
        </div>
      </div>

      {/* Grid View */}
      {viewMode === "grid" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="h-48 bg-gray-200 rounded-t-lg flex items-center justify-center">
                <p className="text-gray-500 text-sm">
                  Thumbnail image of canvas
                </p>
              </div>
              <div className="p-4 flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      className="text-gray-600"
                    >
                      <path
                        d="M2 2h5v5H2V2zm7 0h5v5H9V2zM2 9h5v5H2V9z"
                        fill="currentColor"
                      />
                    </svg>
                    <h3 className="font-medium text-gray-800">
                      {project.name}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-500">{project.edited}</p>
                </div>
                <button className="text-gray-600 hover:text-gray-800">
                  <MoreVertical size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* List View */}
      {viewMode === "list" && (
        <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
          <div className="hidden sm:grid grid-cols-12 gap-4 p-4 border-b border-gray-200 text-sm font-medium text-gray-600">
            <div className="col-span-5">Name</div>
            <div className="col-span-3">Last modified</div>
            <div className="col-span-3">Date created</div>
            <div className="col-span-1"></div>
          </div>
          {projects.map((project) => (
            <div
              key={project.id}
              className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 p-4 border-b border-gray-100 hover:bg-gray-50"
            >
              <div className="sm:col-span-5 flex items-center gap-3">
                <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center flex-shrink-0">
                  <p className="text-xs text-gray-500 text-center px-1">
                    Thumbnail image of canvas
                  </p>
                </div>
                <div className="flex-1">
                  <span className="font-medium text-gray-800 block">
                    {project.name}
                  </span>
                  <span className="text-sm text-gray-500 sm:hidden">
                    {project.edited}
                  </span>
                </div>
                <button className="sm:hidden text-gray-600 hover:text-gray-800">
                  <MoreVertical size={20} />
                </button>
              </div>
              <div className="sm:col-span-3 text-gray-600 text-sm hidden sm:block">
                {project.lastModified}
              </div>
              <div className="sm:col-span-3 text-gray-600 text-sm hidden sm:block">
                {project.dateCreated}
              </div>
              <div className="sm:col-span-1 hidden sm:flex justify-end">
                <button className="text-gray-600 hover:text-gray-800">
                  <MoreVertical size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectManager;

"use client";
import { Pencil } from "lucide-react";

interface SkillsSectionProps {
  skills: string[];
  onEdit: () => void;
}

export default function SkillsSection({ skills, onEdit }: SkillsSectionProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Skills</h2>
        <button
          onClick={onEdit}
          className="w-10 h-10 bg-[#FAB75B] rounded-full flex items-center justify-center hover:bg-amber-500 transition-colors"
          aria-label="Edit skills"
        >
          <Pencil className="w-5 h-5 text-white" />
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {skills.map((skill, index) => (
          <span
            key={index}
            className="px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-gray-200 transition-colors"
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}

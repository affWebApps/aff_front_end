"use client";
import React from "react";
import { X } from "lucide-react";
import { BaseModal } from "./BaseModal";
import { Button } from "../ui/Button";

interface EditSkillsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EditSkillsModal({
  isOpen,
  onClose,
}: EditSkillsModalProps) {
  const [skills, setSkills] = React.useState([
    "Fitting Adjustments",
    "Pattern Drafting",
    "Alterations & Repairs",
    "Fabric Cutting & Laying",
    "Machine Sewing",
    "Garment Construction",
    "Hand Stitching",
    "Pressing & Ironing",
    "Measurement Taking",
  ]);

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove));
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit your Skills"
      subtitle="Add or remove your relevant skills"
      maxWidth="lg"
    >
      <div className="p-6">
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Skills
          </label>
          <div className="border border-gray-300 rounded-lg p-4 min-h-[200px]">
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm"
                >
                  {skill}
                  <button
                    onClick={() => removeSkill(skill)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </span>
              ))}
            </div>
            <input
              type="text"
              placeholder="Search skills"
              className="w-full mt-3 px-0 py-2 border-0 focus:outline-none focus:ring-0 text-sm text-gray-500"
            />
          </div>
          <p className="text-xs text-gray-400 mt-2">Maximum of 10 skills</p>
        </div>

        <Button
          variant="default"
          size="large"
          onClick={onClose}
          className="w-full"
        >
          Save
        </Button>
      </div>
    </BaseModal>
  );
}

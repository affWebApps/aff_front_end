"use client";
import { MessageSquare, ThumbsUp } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import { BaseModal } from "./BaseModal";

interface Comment {
  avatar: string;
  author: string;
  date: string;
  text: string;
  likes: number;
  replies: number;
}

interface CommentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  comments: Comment[];
  articleTitle?: string;
}

export const CommentsModal = ({
  isOpen,
  onClose,
  comments,
}: CommentsModalProps) => {
  const [newComment, setNewComment] = useState("");

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={`Comments (${comments.length})`}
      maxWidth="2xl"
      className="max-h-[80vh] flex flex-col"
    >
      <div className="flex-1 overflow-y-auto p-6">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-orange-400 rounded-full flex items-center justify-center text-white text-sm font-semibold">
              A
            </div>
            <span className="text-sm font-medium">Current User</span>
          </div>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="What are your thoughts?"
            className="w-full border rounded-lg p-4 mb-3 min-h-[120px] focus:outline-none focus:ring-2 focus:ring-orange-300"
          />
          <div className="flex justify-end">
            <button className="bg-orange-400 hover:bg-orange-500 text-white px-6 py-2 rounded-lg transition-colors">
              Send
            </button>
          </div>
        </div>

        {/* Comments List */}
        <div className="space-y-6">
          {comments.map((comment, index) => (
            <div key={index} className="border-b pb-6 last:border-b-0">
              <div className="flex items-start gap-3">
                <Image
                  src={comment.avatar}
                  alt={comment.author}
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-full"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-sm">
                      {comment.author}
                    </span>
                    <span className="text-gray-400 text-xs">
                      {comment.date}
                    </span>
                  </div>
                  <p className="text-gray-700 text-sm mb-3">{comment.text}</p>
                  <div className="flex items-center gap-4">
                    <button className="flex items-center gap-1 text-gray-500 hover:text-orange-400 transition-colors">
                      <ThumbsUp size={16} />
                      <span className="text-sm">{comment.likes}</span>
                    </button>
                    <button className="flex items-center gap-1 text-gray-500 hover:text-orange-400 transition-colors">
                      <MessageSquare size={16} />
                      <span className="text-sm">{comment.replies}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </BaseModal>
  );
};

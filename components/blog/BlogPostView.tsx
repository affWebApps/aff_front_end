import { Clock, MessageSquare, ThumbsUp } from "lucide-react";
import { BackButton } from "../ui/BackNavigation";
import Image from "next/image";
import { BackTabButton } from "../ui/BackTabNavigation";
import { Blog, BlogImage } from "@/services/blogService";

interface Comment {
  avatar: string;
  author: string;
  date: string;
  text: string;
  likes: number;
  replies: number;
}

interface BlogPost {
  title: string;
  description: string;
  author: string;
  readTime: string;
  category: string;
  image: string;
  comments: Comment[];
}

interface BlogPostViewProps {
  blog: Blog;
  onBack?: () => void;
  onOpenComments: () => void;
}

const getPrimaryImage = (images: BlogImage[] | undefined): string => {
  if (!images || images.length === 0) return "/images/blog1.png";
  const primary = images.find((img) => img.is_primary);
  return primary?.image_url || images[0].image_url || "/images/blog1.png";
};

export const BlogPostView = ({ blog, onBack, onOpenComments }: BlogPostViewProps) => {
  const readTime = `${Math.max(
    1,
    Math.ceil((blog.content?.split(/\s+/).length || 0) / 200)
  )} min read`;

  const image = getPrimaryImage(blog.images);

  const comments: Comment[] = [];

  return (
    <div className="min-h-screen ">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-4">
          <BackTabButton onBack={onBack} />
        </div>

        <div className="bg-white rounded-lg overflow-hidden">
          <div className="p-8">
            <div className="mb-6">
              <span className="inline-block bg-orange-100 text-orange-600 px-3 py-1 rounded text-xs font-medium mb-4">
                1440 × 100
              </span>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {blog.title}
              </h1>
              <p className="text-gray-600 mb-6">
                {blog.content?.substring(0, 250)}...
              </p>

              <div className="flex items-center gap-6 text-sm text-gray-600 mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-orange-400 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                    A
                  </div>
                  <span>By AFF Designer</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock size={16} />
                  <span>{readTime}</span>
                </div>
                <span>Dec 20, 2024</span>
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                <span className="flex items-center gap-1">
                  <MessageSquare size={16} />
                  234 likes
                </span>
                <span className="flex items-center gap-1">
                  <MessageSquare size={16} />
                  12 comments
                </span>
              </div>

              <span className="inline-block bg-orange-50 text-orange-600 px-3 py-1 rounded-full text-xs">
                Tech in Fashion
              </span>
            </div>

            <Image
              src={image}
              alt={blog.title}
              width={1200}
              height={600}
              className="w-full rounded-lg mb-8"
            />

            <div className="prose max-w-none whitespace-pre-line">
              {blog.content}
            </div>
          </div>

          <div className="border-t p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold">Comments (0)</h3>
            </div>

            {comments.slice(0, 2).map((comment, index) => (
              <div key={index} className="mb-6 pb-6 border-b last:border-b-0">
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

            <button
              onClick={onOpenComments}
              className="text-orange-400 hover:text-orange-500 font-medium text-sm transition-colors"
            >
              See all 12 Comments
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

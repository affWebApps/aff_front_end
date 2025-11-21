import { Clock, MessageSquare, ThumbsUp } from "lucide-react";
import { BackButton } from "../ui/BackNavigation";
import Image from "next/image";

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
  post: BlogPost;
  onBack?: () => void;
  onOpenComments: () => void;
}

export const BlogPostView = ({ post, onOpenComments }: BlogPostViewProps) => {
  return (
    <div className="min-h-screen ">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-4">
          <BackButton />
        </div>

        <div className="bg-white rounded-lg overflow-hidden">
          <div className="p-8">
            <div className="mb-6">
              <span className="inline-block bg-orange-100 text-orange-600 px-3 py-1 rounded text-xs font-medium mb-4">
                1440 × 100
              </span>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {post.title}
              </h1>
              <p className="text-gray-600 mb-6">{post.description}</p>

              <div className="flex items-center gap-6 text-sm text-gray-600 mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-orange-400 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                    A
                  </div>
                  <span>By {post.author}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock size={16} />
                  <span>{post.readTime}</span>
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
                {post.category}
              </span>
            </div>

            <Image
              src={post.image}
              alt={post.title}
              width={1200}
              height={600}
              className="w-full rounded-lg mb-8"
            />

            <div className="prose max-w-none">
              <h2 className="text-2xl font-bold mb-4">
                The Future of Fashion Is Digital
              </h2>
              <p className="text-gray-700 mb-6">
                Fashion has always been about creativity and craftsmanship — the
                art of turning ideas into beautiful, wearable expressions. But
                today, the process from sketch to stitch is no longer confined
                to the physical world. The fashion industry is undergoing a
                transformation, blending technology with creativity to make the
                journey from concept to creation faster, smarter, and more
                sustainable.
              </p>

              <h3 className="text-xl font-bold mb-3">
                1. Digital Sketching: The New Canvas
              </h3>
              <p className="text-gray-700 mb-6">
                Traditional paper sketches are being replaced by digital tools
                like CLO 3D and Adobe Illustrator. Designers can now visualize
                their ideas in 3D, experiment with fabrics, and adjust details
                instantly — saving time and materials.
              </p>

              <h3 className="text-xl font-bold mb-3">
                2. Virtual Prototypes, Real Impact
              </h3>
              <p className="text-gray-700 mb-6">
                Instead of sewing multiple samples, designers create virtual
                prototypes to test fit, style, and texture. This reduces waste,
                speeds up production, and supports sustainability — a growing
                priority in modern fashion.
              </p>

              <h3 className="text-xl font-bold mb-3">
                3. Connecting Designers and Tailors
              </h3>
              <p className="text-gray-700 mb-6">
                Digital design bridges the gap between creativity and
                craftsmanship. A designer&apos;s 3D file can easily be shared
                with tailors, ensuring precision, faster collaboration, and
                smoother transitions from concept to garment.
              </p>

              <h3 className="text-xl font-bold mb-3">
                4. Personalized and Inclusive Fashion
              </h3>
              <p className="text-gray-700 mb-6">
                With 3D body scanning and virtual fittings, digital design
                supports custom-made clothing for all body types. It promotes
                inclusivity and helps brands deliver perfect fits without
                overproduction.
              </p>

              <h3 className="text-xl font-bold mb-3">
                5. Fashion Beyond Fabric
              </h3>
              <p className="text-gray-700 mb-6">
                Digital fashion is also making its mark in the metaverse — where
                virtual outfits exist only online. This new form of
                self-expression shows that fashion&apos;s future isn&apos;t just
                wearable, but also digital.
              </p>

              <h3 className="text-xl font-bold mb-3">Final Thought</h3>
              <p className="text-gray-700 mb-6">
                From sketch to stitch, digital design is reshaping how fashion
                is imagined, created, and shared. It&apos;s not replacing
                creativity — it&apos;s redefining it.
              </p>
            </div>
          </div>

          <div className="border-t p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold">Comments (12)</h3>
            </div>

            {post.comments.slice(0, 2).map((comment, index) => (
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

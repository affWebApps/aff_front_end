// types/blog.ts
export interface Comment {
  author: string;
  date: string;
  text: string;
  likes: number;
  replies: number;
  avatar: string;
}

export interface BlogPost {
  id?: number;
  title: string;
  description: string;
  author: string;
  readTime: string;
  category: string;
  image: string;
  comments: Comment[];
}

export interface BlogPostViewProps {
  post: BlogPost;
  onBack: () => void;
  onOpenComments: () => void;
}

export interface CommentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  comments: Comment[];
  articleTitle: string;
}

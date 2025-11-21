export type ButtonVariant =
  | "default"
  | "text"
  | "multichoice"
  | "multichoiceActive";
export type ButtonSize = "small" | "medium" | "large";
export type IconType = "plus" | "arrow" | "play" | null;
export type IconPosition = "left" | "right" | "none";

export interface SocialButtonProps {
  icon: React.ReactNode;
  text: string;
  color?: string;
}

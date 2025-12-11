import { SocialButtonProps } from "../../types/buttonTypes";
import { Button } from "./Button";

export const SocialButton: React.FC<SocialButtonProps> = ({
  icon,
  text,
  onClick,
}) => (
  <Button
    variant="default"
    size="large"
    outlined={true}
    className="w-full"
    onClick={onClick}
  >
    {icon}
    <span className="font-medium">{text}</span>
  </Button>
);

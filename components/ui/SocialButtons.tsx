import { SocialButtonProps } from "../../types/buttonTypes";
import { Button } from "./Button";

export const SocialButton: React.FC<SocialButtonProps> = ({
  icon,
  text,
  onClick,
  disabled = false,
}) => (
  <Button
    variant="default"
    size="large"
    outlined={true}
    className="w-full"
    onClick={onClick}
    disabled={disabled}
  >
    {icon}
    <span className="font-medium">{text}</span>
  </Button>
);

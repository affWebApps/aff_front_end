import { SocialButtonProps } from "../../types/buttonTypes";
import { Button } from "./Button";


export const SocialButton: React.FC<SocialButtonProps> = ({
  icon,
  text,
}) => (
  <Button variant="default" size="large" outlined={true} className="w-full">
    {icon}
    <span className="font-medium">{text}</span>
  </Button>
);
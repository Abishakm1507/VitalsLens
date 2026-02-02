import { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "outline";
  size?: "default" | "sm" | "lg";
  fullWidth?: boolean;
}

const Button = ({
  children,
  variant = "primary",
  size = "default",
  fullWidth = false,
  className,
  ...props
}: ButtonProps) => {
  const baseStyles = "inline-flex items-center justify-center font-bold transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.96] hover:scale-[1.02]";

  const variants = {
    primary: "bg-primary text-primary-foreground shadow-button hover:shadow-elevated hover:bg-primary/95",
    secondary: "bg-secondary text-secondary-foreground shadow-card hover:shadow-elevated hover:bg-secondary/90",
    ghost: "text-foreground hover:bg-muted/80",
    outline: "border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground shadow-sm hover:shadow-button",
  };

  const sizes = {
    sm: "h-11 px-5 text-sm rounded-xl",
    default: "h-[56px] px-6 text-base rounded-[16px]",
    lg: "h-16 px-8 text-lg rounded-2xl",
  };

  return (
    <button
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        fullWidth && "w-full",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;

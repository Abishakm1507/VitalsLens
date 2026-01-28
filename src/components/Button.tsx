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
  const baseStyles = "inline-flex items-center justify-center font-semibold transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]";
  
  const variants = {
    primary: "bg-primary text-primary-foreground shadow-button hover:bg-primary/90",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    ghost: "text-foreground hover:bg-muted",
    outline: "border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground",
  };
  
  const sizes = {
    sm: "h-10 px-4 text-sm rounded-xl",
    default: "h-[52px] px-6 text-base rounded-[14px]",
    lg: "h-14 px-8 text-lg rounded-2xl",
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

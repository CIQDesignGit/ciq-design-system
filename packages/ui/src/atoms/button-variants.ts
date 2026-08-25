import { cva } from "class-variance-authority";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap shadow-xs rounded-lg text-sm font-medium transition-colors focus:outline-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-primary/90 focus:outline-slate-200",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 focus:outline-red-200",
        outline:
          "border border-input bg-card hover:bg-input/50 focus:outline-ring",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 focus:outline-slate-200",
        ghost:
          "text-foreground hover:bg-accent focus:outline-slate-200 shadow-none",
        link: "text-primary underline-offset-4 hover:underline focus:outline-slate-200 shadow-none",
        card: "bg-white hover:bg-gray-50 border border-gray-200 focus:outline-slate-200",
      },
      size: {
        default: "h-10 px-4 py-2",
        xs: "h-5 rounded-lg",
        sm: "h-9 rounded-lg px-3",
        lg: "h-11 rounded-lg px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

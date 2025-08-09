import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 focus:bg-primary/80 active:bg-primary/80 active:scale-95 disabled:bg-primary/50",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 focus:bg-destructive/80 active:bg-destructive/80 active:scale-95 disabled:bg-destructive/50",
        outline:
          "btn-outline-contrast active:scale-95 disabled:border-input/50 disabled:bg-background/50",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 focus:bg-secondary/70 active:bg-secondary/70 active:scale-95 disabled:bg-secondary/50",
        ghost: "btn-ghost-contrast active:scale-95",
        link: "text-primary underline-offset-4 hover:underline focus:underline active:text-primary/80 disabled:text-primary/50 disabled:no-underline",
        management:
          "btn-management-contrast",
        accent: 
          "btn-accent active:scale-95 disabled:bg-accent/50 disabled:text-primary-foreground/50",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3 text-xs",
        lg: "h-11 rounded-md px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
  pressed?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading = false, pressed = false, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    
    // Menangani state loading dan pressed
    const isDisabled = disabled || loading
    const buttonClasses = cn(
      buttonVariants({ variant, size, className }),
      {
        "cursor-not-allowed": isDisabled,
        "cursor-wait": loading,
        // PERBAIKAN: Pressed state dengan kontras yang benar - text ungu pada background putih
        "[&[data-pressed='true']]:!scale-95": pressed,
        // Management variant - background putih, text ungu saat pressed
        "[&[data-pressed='true']]:!bg-white": pressed && (variant === "management"),
        "[&[data-pressed='true']]:!text-primary": pressed && (variant === "management"),
        "[&[data-pressed='true']]:!border-primary": pressed && (variant === "management"),
        // Default variant tetap menggunakan primary background
        "[&[data-pressed='true']]:!bg-primary": pressed && (variant === "default"),
        "[&[data-pressed='true']]:!text-primary-foreground": pressed && (variant === "default"),
        // Destructive variant
        "[&[data-pressed='true']]:!bg-destructive": pressed && variant === "destructive", 
        "[&[data-pressed='true']]:!text-destructive-foreground": pressed && variant === "destructive",
        // Secondary variant
        "[&[data-pressed='true']]:!bg-secondary": pressed && variant === "secondary",
        "[&[data-pressed='true']]:!text-secondary-foreground": pressed && variant === "secondary",
      }
    )

    // Jika menggunakan asChild, kita tidak bisa menambahkan loading spinner
    // karena Slot hanya menerima satu child element
    if (asChild) {
      return (
        <Comp
          className={buttonClasses}
          ref={ref}
          disabled={isDisabled}
          data-pressed={pressed}
          {...props}
        >
          {children}
        </Comp>
      )
    }

    // Untuk button biasa, kita bisa menambahkan loading spinner
    return (
      <Comp
        className={buttonClasses}
        ref={ref}
        disabled={isDisabled}
        data-pressed={pressed}
        {...props}
      >
        {loading && (
          <Loader2 className="w-4 h-4 btn-loading-spinner animate-spin" />
        )}
        {children}
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
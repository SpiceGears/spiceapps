import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
  {
    variants: {
      variant: {
        default:
          "bg-blue-600 text-white shadow-xs hover:bg-blue-700 dark:bg-blue-500 dark:text-white dark:shadow-xs dark:hover:bg-blue-600",
        destructive:
          "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:bg-destructive/60 dark:text-white dark:hover:bg-destructive/80 dark:focus-visible:ring-destructive/40",
        outline:
          "border border-gray-200 bg-white shadow-sm hover:bg-gray-50 hover:text-gray-700 dark:border-gray-600 dark:bg-gray-900 dark:shadow-xs dark:hover:bg-gray-800 dark:hover:text-gray-200",
        secondary:
          "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80 dark:bg-secondary-dark dark:text-secondary-foreground dark:shadow-xs dark:hover:bg-secondary-dark/90",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent-dark dark:hover:text-accent-foreground",
        link:
          "text-primary underline-offset-4 hover:underline dark:text-primary",
        disabled:
          "bg-gray-500 text-gray-300 shadow-none cursor-not-allowed dark:bg-gray-600 dark:text-gray-400",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-600 px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 gap-1 [&>svg]:size-3 [&>svg]:pointer-events-none focus-visible:border-blue-500 focus-visible:ring-2 focus-visible:ring-blue-200 dark:focus-visible:ring-blue-400 focus-visible:ring-offset-2 transition-colors shadow-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-700",
        secondary:
          "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-600",
        destructive:
          "bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-200 border-red-200 dark:border-red-700",
        outline:
          "bg-transparent text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600",
        mechanic:
          "bg-mechanic dark:bg-mechanic text-white dark:text-white border-mechanic dark:border-mechanic",
        programmer:
          "bg-programmer dark:bg-programmer text-white dark:text-white border-programmer dark:border-programmer",
        socialmedia:
          "bg-socialmedia dark:bg-socialmedia text-white dark:text-white border-socialmedia dark:border-socialmedia",
        executive:
          "bg-executive dark:bg-executive text-white dark:text-white border-executive dark:border-executive",
        marketing:
          "bg-marketing dark:bg-marketing text-white dark:text-white border-marketing dark:border-marketing",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }

"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"

import { cn } from "@/lib/utils"

function Tabs({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  )
}

function TabsList({ className, children, ...props }: React.ComponentProps<typeof TabsPrimitive.List>) {
  const listRef = React.useRef<HTMLDivElement>(null);
  const [underline, setUnderline] = React.useState<{ left: number; width: number }>({ left: 0, width: 0 });

  React.useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const update = () => {
      const active = list.querySelector('[data-state="active"]') as HTMLElement;
      if (active) {
        setUnderline({ left: active.offsetLeft, width: active.offsetWidth });
      }
    };
    update();
    // Listen for resize and mutation to keep underline in sync
    window.addEventListener('resize', update);
    const observer = new MutationObserver(update);
    if (list) observer.observe(list, { attributes: true, subtree: true });
    return () => {
      window.removeEventListener('resize', update);
      observer.disconnect();
    };
  }, [children]);

  return (
    <div className={cn("relative bg-transparent px-0", className)}>
      <div ref={listRef} className="relative inline-flex w-auto border-b border-gray-700 dark:border-gray-700">
        <TabsPrimitive.List data-slot="tabs-list" className="flex w-auto" {...props}>
          {children}
        </TabsPrimitive.List>
        <span
          className="absolute bottom-0 h-[2px] bg-gray-900 dark:bg-white transition-all duration-300"
          style={{ left: underline.left, width: underline.width }}
        />
      </div>
    </div>
  );
}

function TabsTrigger({ className, children, ...props }: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "relative appearance-none bg-transparent border-none outline-none px-4 py-2 text-sm font-medium text-gray-400 dark:text-gray-400 transition-colors duration-200 cursor-pointer",
        "data-[state=active]:text-gray-900 dark:data-[state=active]:text-white data-[state=active]:font-semibold inline-flex items-center justify-center gap-1.5 h-9",
        className
      )}
      {...props}
    >
      {children}
    </TabsPrimitive.Trigger>
  );
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn("flex-1 outline-none", className)}
      {...props}
    />
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent }

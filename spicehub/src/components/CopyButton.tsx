"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Copy, Check } from "lucide-react"
import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner"
import { Description } from "@radix-ui/react-dialog"

export function CopyLinkButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      toast("Link copied!", {
        description: "You can now share this URL.",
    })
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error("Copy failed", error)
      toast("Failed to copy link", {
        description: "destructive", 
      })
    }
  }

  return (
    <div onClick={handleCopy} className="flex items-center cursor-pointer">
      {copied ? (
        <>
          <Check className="mr-2 h-4 w-5" />
          <span>Skopiowano!</span>
        </>
      ) : (
        <>
          <Copy className="mr-2 h-4 w-5" />
          <span>{text}</span>
        </>
      )}
    </div>
  )
}
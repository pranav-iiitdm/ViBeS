"use client"

import { useState } from "react"
import { Check, Quote } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface CitationButtonProps {
  text: string
  source?: string
}

export function CitationButton({ text, source = "ViBeS Research Lab" }: CitationButtonProps) {
  const [copied, setCopied] = useState(false)

  const formatCitation = () => {
    const today = new Date()
    const formattedDate = today.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })

    return `"${text}" ${source}. Retrieved on ${formattedDate}.`
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(formatCitation())
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-gray-500 hover:text-teal-600 hover:bg-teal-50 dark:hover:bg-teal-900/20 rounded-full"
            onClick={handleCopy}
          >
            {copied ? <Check className="h-3 w-3" /> : <Quote className="h-3 w-3" />}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Copy citation</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

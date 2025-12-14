import * as React from "react"
import { cn } from "@/lib/utils"

interface TooltipProps {
  tooltip: React.ReactNode
  children: React.ReactNode
  position?: "top" | "bottom" | "bottom-left" | "bottom-right"
}

export const Tooltip = ({ tooltip, children, position = "top" }: TooltipProps) => {
  return (
    <div className="group relative z-50 overflow-visible">
      <div className="w-auto ml-0.5">{children}</div>
      <div
        className={cn(
          "absolute w-max scale-0 transform rounded-lg bg-gray-800 p-2 text-sm text-white opacity-0 shadow-lg transition-all group-hover:scale-100 group-hover:opacity-100 z-50",
          position === "bottom-left" && "left-0 top-full mt-2",
          position === "bottom-right" && "right-0 top-full mt-2",
          position === "bottom" && "left-1/2 top-full mt-2 -translate-x-1/2",
          position === "top" && "left-1/2 bottom-full mb-2 -translate-x-1/2"
        )}
      >
        {tooltip}
      </div>
    </div>
  )
}

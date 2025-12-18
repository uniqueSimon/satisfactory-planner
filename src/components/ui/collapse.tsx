import { useState, ReactNode } from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface CollapseProps {
  title: ReactNode
  children: ReactNode
  defaultOpen?: boolean
  className?: string
  disableToggle?: boolean
}

export const Collapse = ({
  title,
  children,
  defaultOpen = false,
  className,
  disableToggle = false,
}: CollapseProps) => {
  const [open, setOpen] = useState(defaultOpen)

  const handleToggle = () => {
    if (!disableToggle) setOpen(!open)
  }

  return (
    <div className={cn("border rounded-lg bg-white shadow-sm", className)}>
      <div
        role="button"
        tabIndex={0}
        onClick={handleToggle}
        onKeyDown={(e) => e.key === "Enter" && handleToggle()}
        className="w-full flex justify-between items-center px-4 py-2 font-medium hover:bg-gray-100 transition cursor-pointer"
      >
        <div className="flex items-center justify-between w-full">
          {title}
          <ChevronDown
            className={cn(
              "h-4 w-4 transition-transform duration-200 ml-2",
              open && "rotate-180"
            )}
          />
        </div>
      </div>

      <div
        className={cn(
          "transition-all duration-300 ease-in-out",
          open ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0 overflow-hidden"
        )}
      >
        <div className="p-4 border-t">{children}</div>
      </div>
    </div>
  )
}

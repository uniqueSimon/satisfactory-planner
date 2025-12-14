import * as React from "react"
import { cn } from "@/lib/utils"

const Label = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement>
>(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={cn(
      "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
      className
    )}
    {...props}
  />
))
Label.displayName = "Label"

interface FormItemProps {
  label?: React.ReactNode
  children: React.ReactNode
  className?: string
}

const FormItem = ({ label, children, className }: FormItemProps) => {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      {label && <Label>{label}</Label>}
      {children}
    </div>
  )
}

export { Label, FormItem }

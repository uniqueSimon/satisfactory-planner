import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";

export interface MultiSelectOption {
  value: string;
  label?: string;
}

interface MultiSelectDropdownProps {
  options: MultiSelectOption[];
  value: string[];
  onChange: (next: string[]) => void;
  label?: (selected: string[]) => string; // button label
  clearText?: string;
  closeText?: string;
}

export const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({
  options,
  value,
  onChange,
  label = (sel) => `Selected (${sel.length})`,
}) => {
  const [open, setOpen] = useState(false);

  const toggle = (val: string) => {
    if (value.includes(val)) onChange(value.filter((v) => v !== val));
    else onChange([...value, val]);
  };
  const clearAll = () => onChange([]);

  return (
    <div className="w-full">
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-full justify-between">
            <span>{label(value)}</span>
            {open ? <X size={16} /> : <Check size={16} className="opacity-0" />}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          className="max-h-80 overflow-y-auto w-64 p-0"
        >
          {options.map((opt) => {
            const selected = value.includes(opt.value);
            return (
              <DropdownMenuItem
                key={opt.value}
                onSelect={(e) => {
                  e.preventDefault();
                  toggle(opt.value);
                }}
                className="flex items-center gap-2 cursor-pointer"
              >
                <div
                  className={
                    "h-4 w-4 rounded-sm border flex items-center justify-center " +
                    (selected
                      ? "bg-primary text-primary-foreground"
                      : "bg-white")
                  }
                >
                  {selected && <Check size={14} />}
                </div>
                <span className="text-xs truncate">
                  {opt.label ?? opt.value}
                </span>
              </DropdownMenuItem>
            );
          })}
          <div className="px-2 py-2 flex gap-2 border-t mt-1">
            <Button
              variant="ghost"
              size="sm"
              className="flex-1"
              disabled={value.length === 0}
              onClick={(e) => {
                e.preventDefault();
                clearAll();
              }}
            >
              Clear
            </Button>
            <Button
              variant="default"
              size="sm"
              className="flex-1"
              onClick={(e) => {
                e.preventDefault();
                setOpen(false);
              }}
            >
              Close
            </Button>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
      {value.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {value.map((v) => (
            <span
              key={v}
              className="text-[10px] bg-gray-200 dark:bg-gray-700 rounded px-1 py-0.5"
            >
              {options.find((o) => o.value === v)?.label ?? v}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

import { useState } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils"; // for conditional classNames

export function ProductCombobox(props: {
  product: string;
  setProduct: (p: string) => void;
  allProducts: string[];
  productDisplayNameMapping: Map<string, string>;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-48 justify-between"
        >
          {props.product
            ? props.productDisplayNameMapping.get(props.product)
            : "Select product"}
          <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-48 p-0">
        <Command>
          <CommandInput placeholder="Search product..." />
          <CommandList>
            <CommandEmpty>No product found.</CommandEmpty>
            <CommandGroup>
              {props.allProducts.map((p) => (
                <CommandItem
                  key={p}
                  onSelect={() => {
                    props.setProduct(p);
                    setOpen(false);
                  }}
                >
                  <div className="flex items-center gap-2">
                    <img
                      draggable={false}
                      src={`items/desc-${p
                        .toLowerCase()
                        .replace("_", "-")}-c_64.png`}
                      style={{ height: 20 }}
                    />
                    {props.productDisplayNameMapping.get(p)!}
                    <Check
                      className={cn(
                        "ml-auto h-4 w-4",
                        props.product === p ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

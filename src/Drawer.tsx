import { useState } from "react";
import { SavedFactory } from "./interfaces";
import { ProductionTree } from "./components/productionTree/ProductionTree";
import { Button } from "@/components/ui/button";
import { Check, ChevronDown, Copy, Save, Trash, X } from "lucide-react";
import { Icon } from "./reusableComp/Icon";
import { allProducts, productDisplayNameMapping } from "./App";
import { useDirtyState } from "./DirtyStateContext";
import { TreeSettingsProvider } from "./context/TreeSettingsContext";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "./lib/utils";

export const Drawer = (props: {
  loadedFactory: SavedFactory;
  setLoadedFactory: (factory: SavedFactory | null) => void;
  onClickedDrawerButton: (type: "SAVE" | "DELETE" | "COPY" | "CLOSE") => void;
}) => {
  const { isDirty } = useDirtyState();
  const [open, setOpen] = useState(false);
  const nodes = props.loadedFactory.productNodes;
  const root = nodes.find((node) => node.type === "ROOT");

  const notReadyForSaving =
    !root || !root.name || !root.rate || !root.buildRecipe;

  const setProduct = (productName: string) => {
    if (root) {
      // Update existing root - clear recipe and children since they're now invalid
      props.setLoadedFactory({
        id: props.loadedFactory.id,
        productNodes: [{
          ...root,
          name: productName,
          buildRecipe: undefined,
          children: [],
        }],
      });
    } else {
      // Create new root
      props.setLoadedFactory({
        id: props.loadedFactory.id,
        productNodes: [{
          id: crypto.randomUUID(),
          name: productName,
          rate: 0,
          type: "ROOT",
          children: [],
        }],
      });
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center px-2 py-1 border-2 bg-gray-200 text-xl font-semibold">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <button className="flex gap-2 items-center hover:bg-gray-300 rounded px-2 py-1 cursor-pointer">
              {root?.name ? (
                <>
                  <Icon item={root.name} />
                  {productDisplayNameMapping.get(root.name)}
                </>
              ) : (
                <span>Select product...</span>
              )}
              <ChevronDown className="h-5 w-5 opacity-50" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-0" align="start">
            <Command>
              <CommandInput placeholder="Search product..." />
              <CommandList>
                <CommandEmpty>No product found.</CommandEmpty>
                <CommandGroup>
                  {allProducts.map((p) => (
                    <CommandItem
                      key={p}
                      onSelect={() => {
                        setProduct(p);
                        setOpen(false);
                      }}
                      value={productDisplayNameMapping.get(p)}
                    >
                      <div className="flex items-center gap-2 w-full">
                        <img
                          draggable={false}
                          src={`items/desc-${p.toLowerCase().replace("_", "-")}-c_64.png`}
                          style={{ height: 20 }}
                        />
                        {productDisplayNameMapping.get(p)}
                        <Check
                          className={cn(
                            "ml-auto h-4 w-4",
                            root?.name === p ? "opacity-100" : "opacity-0"
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
        <div>
          <Button
            variant="outline"
            onClick={() => props.onClickedDrawerButton("SAVE")}
            disabled={notReadyForSaving || !isDirty}
          >
            <Save />
          </Button>
          <Button
            variant="outline"
            onClick={() => props.onClickedDrawerButton("DELETE")}
            disabled={notReadyForSaving}
          >
            <Trash />
          </Button>
          <Button
            variant="outline"
            onClick={() => props.onClickedDrawerButton("COPY")}
            disabled={notReadyForSaving}
          >
            <Copy />
          </Button>
          <Button
            variant="outline"
            onClick={() => props.onClickedDrawerButton("CLOSE")}
          >
            <X />
          </Button>
        </div>
      </div>
      <TreeSettingsProvider>
        <ProductionTree
          savedFactory={props.loadedFactory}
          setProductNodes={(updater) => {
            const newNodes = updater(props.loadedFactory.productNodes);
            props.setLoadedFactory({
              id: props.loadedFactory.id,
              productNodes: newNodes,
            });
          }}
        />
      </TreeSettingsProvider>
    </div>
  );
};

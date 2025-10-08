import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { allProducts, productDisplayNameMapping } from "../../App";
import { Recipe } from "../../interfaces";

interface Props {
  product: string;
  rate: number;
  rootRecipe?: Recipe;
  setProduct: (product: string) => void;
  setRate: (rate: number) => void;
}
export const ProductionSetupForm = (props: Props) => {
  const numberOfRootMachines = props.rootRecipe
    ? props.rate /
      ((props.rootRecipe.product.amount / props.rootRecipe.time) * 60)
    : 0;
  const setNumberOfMachines = (number: number) => {
    const rate = props.rootRecipe
      ? number *
        ((props.rootRecipe.product.amount / props.rootRecipe.time) * 60)
      : 0;
    props.setRate(rate);
  };
  return (
    <div className="flex flex-col md:flex-row gap-3 items-center bg-white border rounded-xl shadow-sm p-4">
      {/* Product Select */}
      <div className="flex flex-col w-full md:w-auto">
        <label className="text-xs font-medium text-gray-600 mb-1">
          Product
        </label>
        <Select value={props.product} onValueChange={props.setProduct}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select product" />
          </SelectTrigger>
          <SelectContent>
            {allProducts.map((p) => (
              <SelectItem key={p} value={p}>
                <div className="flex items-center gap-2">
                  <img
                    draggable={false}
                    src={`items/desc-${p
                      .toLowerCase()
                      .replace("_", "-")}-c_64.png`}
                    style={{ height: 20, marginRight: 5 }}
                  />
                  {productDisplayNameMapping.get(p)!}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Rate Input */}
      <div className="flex flex-col w-28">
        <label className="text-xs font-medium text-gray-600 mb-1">Rate</label>
        <div className="flex items-center border rounded-md px-2">
          <Input
            type="number"
            step="any"
            min={0}
            value={props.rate}
            onChange={(e) => props.setRate(Number(e.target.value))}
            className="w-full border-none focus-visible:ring-0 text-sm"
          />
          <span className="text-gray-500 text-xs ml-1">/min</span>
        </div>
      </div>

      {/* Machine Count Input */}
      <div className="flex flex-col w-28">
        <label className="text-xs font-medium text-gray-600 mb-1">
          Machines
        </label>
        <Input
          type="number"
          step="any"
          min={0}
          value={numberOfRootMachines}
          onChange={(e) => setNumberOfMachines(+e.target.value)}
          className="text-sm"
          disabled={!props.rootRecipe}
        />
      </div>
    </div>
  );
};

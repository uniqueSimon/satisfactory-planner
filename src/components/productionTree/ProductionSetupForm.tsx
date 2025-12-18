import { Input } from "@/components/ui/input";
import { allProducts, productDisplayNameMapping } from "../../App";
import { Recipe } from "../../interfaces";
import { ProductCombobox } from "./ProductCombobox";
import { useEffect, useState } from "react";

interface Props {
  product: string;
  rate: number;
  rootRecipe?: Recipe;
  setProduct: (product: string) => void;
  setRate: (rate: number) => void;
}

export const ProductionSetupForm = (props: Props) => {
  const ratePerMachine = props.rootRecipe
    ? (props.rootRecipe.product.amount / props.rootRecipe.time) * 60
    : null;
  const [machines, setMachines] = useState(
    ratePerMachine ? props.rate / ratePerMachine : 0
  );

  const onChangeMachineCount = (count: number) => {
    if (ratePerMachine) {
      props.setRate(count * ratePerMachine);
    }
  };

  useEffect(() => {
    if (ratePerMachine) {
      setMachines(props.rate / ratePerMachine);
    } else {
      setMachines(0);
    }
  }, [props.rate, ratePerMachine]);

  return (
    <div className="flex flex-col md:flex-row gap-3 items-center bg-white border rounded-xl shadow-sm p-4">
      {/* Product Select */}
      <div className="flex flex-col w-full md:w-auto mr-3">
        <label className="text-xs font-medium text-gray-600 mb-1">
          Product
        </label>
        <ProductCombobox
          product={props.product}
          setProduct={props.setProduct}
          allProducts={allProducts}
          productDisplayNameMapping={productDisplayNameMapping}
        />
      </div>

      {/* Rate Input */}
      <div className="flex flex-col min-w-30">
        <label className="text-xs font-medium text-gray-600 mb-1">Rate</label>
        <div className="flex items-center border rounded-md px-2">
          <Input
            type="number"
            step="any"
            min={0}
            value={props.rate}
            onChange={(e) => props.setRate(+e.target.value)}
            className="border-none focus-visible:ring-0 text-sm"
            disabled={!props.rootRecipe}
          />
          <span className="text-gray-500 text-xs">/min</span>
        </div>
      </div>

      {/* Machine Count Input */}
      <div className="flex flex-col min-w-20">
        <label className="text-xs font-medium text-gray-600 mb-1">
          Machines
        </label>
        <Input
          type="number"
          step="any"
          min={0}
          value={machines}
          onChange={(e) => onChangeMachineCount(+e.target.value)}
          className="text-sm"
          disabled={!props.rootRecipe}
        />
      </div>
    </div>
  );
};

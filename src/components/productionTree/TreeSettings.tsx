import { MultiSelectDropdown } from "@/reusableComp/MultiSelectDropdown";
import { FormItem } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { useTreeSettings } from "@/context/TreeSettingsContext";

interface WeightingPointsProps {
  resources: string[];
  excludedResources: string[];
  setExcludedResources: (value: string[]) => void;
}

export const TreeSettings = (props: WeightingPointsProps) => {
  const { editMode, setEditMode, showWeights, setShowWeights } = useTreeSettings();
  return (
    <>
      <div className="bg-white border rounded-xl shadow-sm px-4 py-2 flex gap-4">
        <p className="font-semibold">Tree settings:</p>
        <FormItem label="Edit mode" className="mb-0">
          <Switch checked={editMode} onChange={setEditMode} />
        </FormItem>
        <FormItem
          label={
            <span>
              Show{" "}
              <span
                className="underline decoration-dotted cursor-help"
                title="Weighting points show how scarce a resource is. A rate of 1/min iron ore has a weighting point of 1."
              >
                weighting points
              </span>
            </span>
          }
          className="mb-0"
        >
          <Switch checked={showWeights} onChange={setShowWeights} />
        </FormItem>
      </div>
      {showWeights && (
        <div className="bg-white border rounded-xl shadow-sm px-4 py-2">
          <>
            <p className="text-xs font-medium mb-1">
              Resources to exclude from weighting points
            </p>
            <MultiSelectDropdown
              options={props.resources.map((r) => ({ value: r }))}
              value={props.excludedResources}
              onChange={props.setExcludedResources}
            />
          </>
        </div>
      )}
    </>
  );
};

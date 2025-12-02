import { MultiSelectDropdown } from "@/reusableComp/MultiSelectDropdown";
import { Form, Switch } from "antd";

interface WeightingPointsProps {
  showWeights: boolean;
  setShowWeights: (showWeights: boolean) => void;
  resources: string[];
  value: string[];
  onChange: (value: string[]) => void;
}

export const WeightingPoints = (props: WeightingPointsProps) => {
  return (
    <div className="bg-white border rounded-xl shadow-sm px-4 py-2">
      <Form.Item label="Show weighting points" style={{ margin: 0 }}>
        <Switch checked={props.showWeights} onChange={props.setShowWeights} />
      </Form.Item>

      {props.showWeights && (
        <>
          <p className="text-xs font-medium mb-1">
            Resources to exclude from weighting points
          </p>
          <MultiSelectDropdown
            options={props.resources.map((r) => ({ value: r }))}
            value={props.value}
            onChange={props.onChange}
          />
        </>
      )}
    </div>
  );
};

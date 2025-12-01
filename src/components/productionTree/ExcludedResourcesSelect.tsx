import React from "react";
import { MultiSelectDropdown } from "@/reusableComp/MultiSelectDropdown";

interface ExcludedResourcesSelectProps {
  resources: string[];
  value: string[];
  onChange: (value: string[]) => void;
}

export const ExcludedResourcesSelect: React.FC<
  ExcludedResourcesSelectProps
> = ({ resources, value, onChange }) => {
  return (
    <MultiSelectDropdown
      options={resources.map((r) => ({ value: r }))}
      value={value}
      onChange={onChange}
    />
  );
};

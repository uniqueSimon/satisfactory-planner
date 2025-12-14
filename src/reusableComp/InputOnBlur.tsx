import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";

export const InputOnBlur = (props: {
  commitedValue: number;
  setCommitedValue: (value: number) => void;
}) => {
  const [inputValue, setInputValue] = useState<string>("");
  useEffect(() => setInputValue(String(props.commitedValue)), [props.commitedValue]);
  return (
    <Input
      type="number"
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
      onBlur={(e) =>
        props.setCommitedValue(isNaN(+e.target.value) ? 0 : +e.target.value)
      }
      className="w-24 mr-2"
    />
  );
};

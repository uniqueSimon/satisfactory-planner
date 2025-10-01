import { useEffect, useState } from "react";
import { FactorySetup } from "@/interfaces";
import { Check, Copy } from "lucide-react";
import { Button } from "@/reusableComp/Button";

export const FactoryConfigExport = (props: {
  factorySetup: FactorySetup[];
}) => {
  const [copied, setCopied] = useState(false);
  useEffect(() => setCopied(false), [props.factorySetup]);
  const factoryRows = props.factorySetup.map(
    ({ count, producedIn, recipeName }) =>
      `${count} ${producedIn} ${recipeName}`
  );

  const exportString = `/FactorySpawner ${[...factoryRows]
    .reverse()
    .join(", ")}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(exportString);
    setCopied(true);
  };

  return (
    <div className="flex p-2 gap-2">
      <h2>Export to Factory Spawner</h2>
      <Button onClick={handleCopy}>
        {copied ? (
          <>
            <Check className="w-4 h-4" />
            Copied!
          </>
        ) : (
          <>
            <Copy className="w-4 h-4" />
            Copy to Clipboard
          </>
        )}
      </Button>
      <pre className="bg-gray-900 text-gray-100 p-3 rounded-xl overflow-x-auto text-sm whitespace-pre-wrap">
        {exportString}
      </pre>
    </div>
  );
};

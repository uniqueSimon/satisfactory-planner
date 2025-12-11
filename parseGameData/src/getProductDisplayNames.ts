import gameData from "./gameData.json";

interface ItemClass {
  ClassName: string;
  mDisplayName: string;
  mForm?: "RF_SOLID" | "RF_LIQUID" | "RF_GAS";
}

interface NativeClass {
  NativeClass: string;
  Classes: ItemClass[];
}

const extractProductName = (className: string): string => {
  return className.split("_").slice(1, -1).join("_");
};

const buildDisplayNameMapping = () => {
  const mapping = new Map<string, string>();
  const formMapping = new Map<string, "RF_SOLID" | "RF_LIQUID" | "RF_GAS">();
  const nativeClasses = gameData as NativeClass[];

  for (const nativeClass of nativeClasses) {
    if (!nativeClass.Classes) {
      continue;
    }

    for (const item of nativeClass.Classes) {
      const productName = extractProductName(item.ClassName);
      const displayName = item.mDisplayName;

      if (productName && displayName) {
        mapping.set(productName, displayName);
        if (item.mForm) {
          formMapping.set(productName, item.mForm);
        }
      }
    }
  }

  return { mapping, formMapping };
};

const { mapping, formMapping } = buildDisplayNameMapping();

mapping.set("Energy", "Energy");

export const displayNames = Array.from(mapping.entries()).sort((a, b) =>
  a[0].localeCompare(b[0])
);

console.log(`Extracted ${displayNames.length} product display names`);

export const productFormMapping = formMapping;

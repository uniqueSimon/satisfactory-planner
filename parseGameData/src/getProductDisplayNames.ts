import gameData from "./gameData.json";

interface ItemClass {
  ClassName: string;
  mDisplayName: string;
}

interface NativeClass {
  NativeClass: string;
  Classes: ItemClass[];
}

const extractProductName = (className: string): string => {
  return className.split("_").slice(1, -1).join("_");
};

const buildDisplayNameMapping = (): Map<string, string> => {
  const mapping = new Map<string, string>();
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
      }
    }
  }

  return mapping;
};

const productDisplayNameMapping = buildDisplayNameMapping();

productDisplayNameMapping.set("Energy", "Energy");

export const displayNames = Array.from(
  productDisplayNameMapping.entries()
).sort((a, b) => a[0].localeCompare(b[0]));

console.log(`Extracted ${displayNames.length} product display names`);

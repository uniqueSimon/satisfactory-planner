import { FGRecipe, Schematic } from "./allRecipesFromConfig";
import gameData from "./gameData.json";

interface SchematicInfo {
  tier: number;
  isAlternate: boolean;
}

const extractRecipeName = (recipeRef: string): string | null => {
  const matching = /\.Recipe_(.*)_C/.exec(recipeRef);
  return matching?.[1] ?? null;
};

const shouldOverrideMapping = (
  existing: SchematicInfo | undefined,
  newInfo: SchematicInfo
): boolean => {
  if (!existing) {
    return true;
  }
  return existing.isAlternate && !newInfo.isAlternate;
};

const buildRecipeSchematicMapping = (): Map<string, SchematicInfo> => {
  const mapping = new Map<string, SchematicInfo>();
  
  const schematics = (gameData as unknown as [Schematic, FGRecipe]).find(
    (x) =>
      x.NativeClass ===
      "/Script/CoreUObject.Class'/Script/FactoryGame.FGSchematic'"
  ) as Schematic | undefined;
  
  if (!schematics) {
    console.warn("Could not find FGSchematic class in game data");
    return mapping;
  }
  
  for (const schematic of schematics.Classes) {
    const unlockedRecipes = schematic.mUnlocks.filter(
      (unlock) => unlock.Class === "BP_UnlockRecipe_C"
    );
    
    for (const unlock of unlockedRecipes) {
      const recipeRefs = unlock.mRecipes.split(",");
      
      for (const recipeRef of recipeRefs) {
        const recipeName = extractRecipeName(recipeRef);
        
        if (!recipeName) {
          continue;
        }
        
        const schematicInfo: SchematicInfo = {
          tier: +schematic.mTechTier,
          isAlternate: schematic.mType === "EST_Alternate",
        };
        
        const existing = mapping.get(recipeName);
        
        if (shouldOverrideMapping(existing, schematicInfo)) {
          mapping.set(recipeName, schematicInfo);
        }
      }
    }
  }
  
  return mapping;
};

export const recipeSchematicMapping = buildRecipeSchematicMapping();
console.log(`Built schematic mapping for ${recipeSchematicMapping.size} recipes`);

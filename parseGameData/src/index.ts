import fs from "fs";
import path from "path";
import { allProducts, allRecipes } from "./allRecipesFromConfig";
import { displayNames } from "./getProductDisplayNames";

const OUTPUT_DIR = path.join(__dirname, "../../src/gameData");

const OUTPUT_FILES = {
  recipes: path.join(OUTPUT_DIR, "allRecipes.json"),
  products: path.join(OUTPUT_DIR, "allProducts.json"),
  displayNames: path.join(OUTPUT_DIR, "displayNames.json"),
} as const;

const writeJsonFile = (filePath: string, data: unknown): void => {
  try {
    const jsonString = JSON.stringify(data, null, 2);
    fs.writeFileSync(filePath, jsonString, "utf-8");
    console.log(`✓ Written: ${path.basename(filePath)} (${jsonString.length} bytes)`);
  } catch (error) {
    console.error(`✗ Failed to write ${path.basename(filePath)}:`, error);
    throw error;
  }
};

const main = (): void => {
  console.log("\n=== Game Data Extraction ===");
  console.log(`Output directory: ${OUTPUT_DIR}\n`);
  
  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    console.log(`Created output directory: ${OUTPUT_DIR}\n`);
  }
  
  writeJsonFile(OUTPUT_FILES.recipes, allRecipes);
  writeJsonFile(OUTPUT_FILES.products, allProducts);
  writeJsonFile(OUTPUT_FILES.displayNames, displayNames);
  
  console.log("\n=== Extraction Complete ===");
  console.log(`Total recipes: ${allRecipes.length}`);
  console.log(`Total products: ${allProducts.length}`);
  console.log(`Total display names: ${displayNames.length}`);
};

try {
  main();
} catch (error) {
  console.error("\n=== Extraction Failed ===");
  console.error(error);
  process.exit(1);
}

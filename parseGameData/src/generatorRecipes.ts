import { Recipe } from "./allRecipesFromConfig";

export const nuclearRecipes: Recipe[] = [
  {
    recipeName: "GeneratorNuclear_Uranium",
    displayName: "Nuclear Power (Uranium, overclocked)",
    product: { name: "Energy", amount: 750 },
    ingredients: [
      { name: "NuclearWaste", amount: -50 },
      { name: "NuclearFuelRod", amount: 1 },
      { name: "Water", amount: 1200 },
    ],
    time: 300 / 2.5,
    isAlternate: false,
    producedIn: "GeneratorNuclear",
    tier: 8,
  },
  {
    recipeName: "GeneratorNuclear_Plutonium",
    displayName: "Nuclear Power (Plutonium, overclocked)",
    product: { name: "Energy", amount: 1500 },
    ingredients: [
      { name: "PlutoniumWaste", amount: -10 },
      { name: "PlutoniumFuelRod", amount: 1 },
      { name: "Water", amount: 1200 },
    ],
    time: 600 / 2.5,
    isAlternate: false,
    producedIn: "GeneratorNuclear",
    tier: 8,
  },
  {
    recipeName: "GeneratorNuclear_Ficsonium",
    displayName: "Nuclear Power (Ficsonium, overclocked)",
    product: { name: "Energy", amount: 150 },
    ingredients: [
      { name: "FicsoniumFuelRod", amount: 1 },
      { name: "Water", amount: 1200 },
    ],
    time: 60 / 2.5,
    isAlternate: false,
    producedIn: "GeneratorNuclear",
    tier: 9,
  },
];

export const coalRecipes: Recipe[] = [
  {
    recipeName: "GeneratorCoal_Coal",
    displayName: "Coal Power (Coal)",
    product: { name: "Energy", amount: 0.3 },
    ingredients: [
      { name: "Coal", amount: 1 },
      { name: "Water", amount: 3 },
    ],
    time: 4,
    isAlternate: false,
    producedIn: "GeneratorCoal",
    tier: 3,
  },
  {
    recipeName: "GeneratorCoal_CompactedCoal",
    displayName: "Coal Power (Compacted Coal)",
    product: { name: "Energy", amount: 0.63 },
    ingredients: [
      { name: "CompactedCoal", amount: 1 },
      { name: "Water", amount: 6.3 },
    ],
    time: 8.4,
    isAlternate: false,
    producedIn: "GeneratorCoal",
    tier: 3,
  },
  {
    recipeName: "GeneratorCoal_PetroleumCoke",
    displayName: "Coal Power (Petroleum Coke)",
    product: { name: "Energy", amount: 0.18 },
    ingredients: [
      { name: "PetroleumCoke", amount: 1 },
      { name: "Water", amount: 1.8 },
    ],
    time: 2.4,
    isAlternate: false,
    producedIn: "GeneratorCoal",
    tier: 5,
  },
];

export const fuelRecipes: Recipe[] = [
  {
    recipeName: "GeneratorFuel_Fuel",
    displayName: "Fuel Power (Fuel)",
    product: { name: "Energy", amount: 0.75 },
    ingredients: [{ name: "LiquidFuel", amount: 1 }],
    time: 3,
    isAlternate: false,
    producedIn: "GeneratorFuel",
    tier: 5,
  },
  {
    recipeName: "GeneratorFuel_Turbofuel",
    displayName: "Fuel Power (Turbofuel)",
    product: { name: "Energy", amount: 2 },
    ingredients: [{ name: "LiquidTurboFuel", amount: 1 }],
    time: 8,
    isAlternate: false,
    producedIn: "GeneratorFuel",
    tier: 6,
  },
  {
    recipeName: "GeneratorFuel_RocketFuel",
    displayName: "Fuel Power (Rocket Fuel)",
    product: { name: "Energy", amount: 3.6 },
    ingredients: [{ name: "RocketFuel", amount: 1 }],
    time: 14.4,
    isAlternate: false,
    producedIn: "GeneratorFuel",
    tier: 7,
  },
  {
    recipeName: "GeneratorFuel_IonizedFuel",
    displayName: "Fuel Power (Ionized Fuel)",
    product: { name: "Energy", amount: 5 },
    ingredients: [{ name: "IonizedFuel", amount: 1 }],
    time: 20,
    isAlternate: false,
    producedIn: "GeneratorFuel",
    tier: 9,
  },
];

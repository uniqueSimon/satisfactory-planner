# 📖 Satisfactory Planner - Developer Instructions

A React-based factory planning tool for the game [Satisfactory](https://www.satisfactorygame.com/). This application helps players calculate production rates, ingredient requirements, and optimize their factory layouts.

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **React 19** | UI framework |
| **TypeScript** | Type-safe JavaScript |
| **Vite** | Build tool & dev server |
| **Tailwind CSS 4** | Utility-first styling |
| **React Router** | Client-side routing |
| **Radix UI** | Accessible UI primitives |
| **Local Storage** | Client-side data persistence |
| **Lucide React** | Icon library |

---

## 📁 Project Structure

```
satisfactory-planner/
├── src/                          # Main application source
│   ├── App.tsx                   # Root component with routing
│   ├── main.tsx                  # Application entry point
│   ├── interfaces.ts             # TypeScript type definitions
│   ├── components/               # Feature components
│   │   ├── factoryPlanner/       # Factory planning & clustering
│   │   ├── productionTree/       # Production tree visualization & logic
│   │   ├── localStorage/         # Import/export functionality
│   │   └── ui/                   # Reusable UI components (shadcn/ui)
│   ├── context/                  # React contexts
│   ├── gameData/                 # Parsed game data (JSON)
│   ├── hooks/                    # Custom React hooks
│   ├── lib/                      # Utility functions
│   └── reusableComp/             # Shared components & hooks
├── parseGameData/                # Game data extraction tool
│   └── src/                      # Parses raw game config files
├── public/                       # Static assets
│   └── items/                    # Item icons
└── index.html                    # HTML entry point
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher recommended)
- **npm** or **yarn**

### Installation

```bash
# Clone the repository
git clone https://github.com/uniqueSimon/satisfactory-planner.git
cd satisfactory-planner

# Install dependencies
npm install
```

### Development

```bash
# Start the development server
npm run dev
```

The app will be available at `http://localhost:5173/satisfactory-planner/`

### Build for Production

```bash
# Build the application
npm run build

# Preview the production build
npm run preview
```

### Linting

```bash
npm run lint
```

---

## 🎮 Core Concepts

### Factory Planning Flow

1. **Select a Product** - Choose what item you want to produce
2. **Set the Rate** - Define how many items per minute you need
3. **Build the Tree** - The app calculates all required ingredients recursively
4. **Adjust Recipes** - Select alternate recipes where available
5. **Organize Factories** - Group production trees into factory clusters

### Key Data Structures

#### `ProductNode`
Represents a single item in the production tree:
```typescript
interface ProductNode {
  id: string;
  name: string;           // Item identifier
  rate: number;           // Items per minute
  type: NodeType;         // ROOT | SUB_ROOT | NORMAL
  buildRecipe?: string;   // Selected recipe name
  children: string[];     // Child node IDs
}
```

#### `Cluster`
Groups multiple factories together:
```typescript
interface Cluster {
  id: string;
  title: string;
  factories: SavedFactory[];
}
```

#### `Recipe`
Game recipe definition:
```typescript
interface Recipe {
  recipeName: string;
  displayName: string;
  product: { name: string; amount: number };
  ingredients: { name: string; amount: number }[];
  time: number;
  isAlternate: boolean;
  producedIn: string;
  tier: number;
}
```

---

## 💾 Local Storage

The app persists data in the browser's local storage:

| Key | Description |
|-----|-------------|
| `saved-factories` | All factory clusters and their production trees |
| `alternate-recipes` | User's selected alternate recipe preferences |

### Import/Export

Users can export their entire configuration as JSON and import it on another device via the `/local-storage` route.

---

## 📊 Production Tree Operations

Located in `src/components/productionTree/treeOperations/`:

| File | Purpose |
|------|---------|
| `buildTree.ts` | Constructs the initial production tree |
| `calculateRootRate.ts` | Computes rates from root to leaves |
| `updateTreeRates.ts` | Recalculates rates when changes occur |
| `selectRecipe.ts` | Handles recipe selection changes |
| `clearRecipe.ts` | Removes recipe from a node |
| `moveToSubtree.ts` | Extracts a branch into a sub-tree |
| `reattachSubTree.ts` | Merges sub-tree back into main tree |
| `removeDisconnectedBranches.ts` | Cleans up orphaned nodes |

---

## 🎨 UI Components

The project uses **shadcn/ui** components (located in `src/components/ui/`):

- `button.tsx` - Button variants
- `card.tsx` - Card containers
- `dialog.tsx` - Modal dialogs
- `command.tsx` - Command palette (for product search)
- `select.tsx` - Select dropdowns
- `tooltip.tsx` - Tooltips
- And more...

Custom reusable components are in `src/reusableComp/`.

---

## 🔧 Game Data Extraction

The `parseGameData/` directory contains a Node.js tool that extracts recipe and product data from the game's configuration files.

### Running the Parser

```bash
cd parseGameData
npm install
npm start
```

This generates JSON files in `src/gameData/`:
- `allRecipes.json` - All crafting recipes
- `allProducts.json` - All producible items
- `displayNames.json` - Human-readable item names

---

## 🔗 Routes

| Path | Component | Description |
|------|-----------|-------------|
| `/satisfactory-planner/` | `Home` | Main factory planner |
| `/satisfactory-planner/alt-recipes` | `AlternateRecipes` | Manage alternate recipe preferences |
| `/satisfactory-planner/local-storage` | `LocalStorage` | Import/export configuration |

---

## 🧩 Mod Support

This tool integrates with the [Factory Spawner](https://github.com/uniqueSimon/FactorySpawner) mod, allowing users to export their planned factories directly into the game.

---

## 📝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/my-feature`)
3. Commit your changes (`git commit -m 'Add my feature'`)
4. Push to the branch (`git push origin feature/my-feature`)
5. Open a Pull Request

---

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

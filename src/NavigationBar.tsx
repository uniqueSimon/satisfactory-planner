import { NavLink } from "react-router-dom";

export const NaviagationBar = () => (
  <nav className="bg-gray-100 shadow-md px-6 py-3">
    <ul className="flex space-x-6">
      <li>
        <NavigationLink label="Home" path="/satisfactory-planner/" />
      </li>
      <li>
        <NavigationLink
          label="Alternate Recipes"
          path="satisfactory-planner/alt-recipes"
        />
      </li>
      <li>
        <NavigationLink
          label="Local Storage"
          path="satisfactory-planner/local-storage"
        />
      </li>
    </ul>
  </nav>
);

const NavigationLink = (props: { label: string; path: string }) => (
  <NavLink
    to={props.path}
    end
    className={({ isActive }) =>
      `px-3 py-2 rounded-lg transition ${
        isActive
          ? "bg-primary text-white shadow"
          : "text-gray-700 hover:bg-primary/10 hover:text-primary"
      }`
    }
  >
    {props.label}
  </NavLink>
);

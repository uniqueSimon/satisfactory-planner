import { NavLink } from "react-router-dom";

export const NaviagationBar = () => (
  <nav className="bg-gray-100 shadow-md px-6 py-3">
    <ul className="flex space-x-6">
      <li>
        <NavLink
          to="/satisfactory-planner/"
          end
          className={({ isActive }) =>
            `px-3 py-2 rounded-lg transition ${
              isActive
                ? "bg-blue-600 text-white shadow"
                : "text-gray-700 hover:bg-blue-100 hover:text-blue-700"
            }`
          }
        >
          Home
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/satisfactory-planner/alt-recipes"
          className={({ isActive }) =>
            `px-3 py-2 rounded-lg transition ${
              isActive
                ? "bg-blue-600 text-white shadow"
                : "text-gray-700 hover:bg-blue-100 hover:text-blue-700"
            }`
          }
        >
          Alternate Recipes
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/satisfactory-planner/local-storage"
          className={({ isActive }) =>
            `px-3 py-2 rounded-lg transition ${
              isActive
                ? "bg-blue-600 text-white shadow"
                : "text-gray-700 hover:bg-blue-100 hover:text-blue-700"
            }`
          }
        >
          Local Storage
        </NavLink>
      </li>
    </ul>
  </nav>
);

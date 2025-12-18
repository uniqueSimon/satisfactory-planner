import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { UnsavedChangesDialog } from "./components/ConfirmationDialogs";
import { useDirtyState } from "./DirtyStateContext";

export const NaviagationBar = () => {
  const { isDirty, setIsDirty } = useDirtyState();
  const [pendingPath, setPendingPath] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigationClick = (path: string, e: React.MouseEvent) => {
    if (isDirty && location.pathname !== path) {
      e.preventDefault();
      setPendingPath(path);
    }
  };

  const handleConfirmNavigation = () => {
    if (pendingPath) {
      setIsDirty(false);
      navigate(pendingPath);
      setPendingPath(null);
    }
  };

  return (
    <>
      <nav className="bg-gray-100 shadow-md px-6 py-3">
        <ul className="flex space-x-6">
          <li>
            <NavigationLink
              label="Home"
              path="/satisfactory-planner/"
              onClick={handleNavigationClick}
            />
          </li>
          <li>
            <NavigationLink
              label="Alternate Recipes"
              path="satisfactory-planner/alt-recipes"
              onClick={handleNavigationClick}
            />
          </li>
          <li>
            <NavigationLink
              label="Local Storage"
              path="satisfactory-planner/local-storage"
              onClick={handleNavigationClick}
            />
          </li>
        </ul>
      </nav>
      <UnsavedChangesDialog
        open={!!pendingPath}
        onConfirm={handleConfirmNavigation}
        onCancel={() => setPendingPath(null)}
      />
    </>
  );
};

const NavigationLink = (props: {
  label: string;
  path: string;
  onClick: (path: string, e: React.MouseEvent) => void;
}) => (
  <NavLink
    to={props.path}
    end
    onClick={(e) => props.onClick(props.path, e)}
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

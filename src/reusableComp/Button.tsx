import { useState } from "react";
import { twMerge } from "tailwind-merge";

export const Button = (props: {
  children: React.ReactNode;
  onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  disabled?: boolean;
}) => {
  const [clicked, setClicked] = useState(false);

  const handleClick = () => {
    setClicked(true);
    setTimeout(() => setClicked(false), 150);
  };

  return (
    <button
      disabled={props.disabled}
      onMouseEnter={props.onMouseEnter}
      onMouseLeave={props.onMouseLeave}
      onClick={(e) => {
        handleClick();
        props.onClick(e);
      }}
      type="button"
      className={twMerge(
        "bg-white text-black border border-gray-300 px-3 py-1 rounded-lg shadow-md",
        "hover:text-blue-500 hover:border-blue-500 hover:shadow-lg",
        "transition-all duration-300",
        clicked && "scale-90",
        props.disabled &&
          "opacity-30 cursor-not-allowed hover:text-black hover:border-gray-300 hover:shadow-md"
      )}
    >
      {props.children}
    </button>
  );
};

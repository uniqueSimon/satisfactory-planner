import { useState } from "react";
import { twMerge } from "tailwind-merge";

export const Button = (props: {
  children: React.ReactNode;
  onClick: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}) => {
  const [clicked, setClicked] = useState(false);
  const handleClick = () => {
    setClicked(true);
    setTimeout(() => {
      setClicked(false);
    }, 150);
  };
  return (
    <button
      onMouseEnter={props.onMouseEnter}
      onMouseLeave={props.onMouseLeave}
      onClick={() => {
        handleClick();
        props.onClick();
      }}
      type="button"
      className={twMerge(
        "bg-white text-black border-gray-300 border-1 px-3 py-1 rounded-lg shadow-md",
        "hover:text-blue-500 hover:border-blue-500 hover:shadow-lg",
        "transition-all duration-300",
        clicked && "scale-90"
      )}
    >
      {props.children}
    </button>
  );
};

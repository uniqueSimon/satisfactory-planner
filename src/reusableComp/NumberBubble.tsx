export const NumberBubble = (props: {
  show: boolean;
  number: number;
  children: React.ReactNode;
}) => (
  <div className="relative">
    {props.children}
    {props.show && (
      <div className="absolute -right-1 top-1/2 -translate-y-1/2 translate-x-full ml-2 bg-primary/70 text-white text-[10px] px-1.5 py-0.5 rounded shadow-sm whitespace-nowrap after:content-[''] after:absolute after:right-full after:top-1/2 after:-translate-y-1/2 after:border-[3px] after:border-transparent after:border-r-blue-500/70">
        {props.number.toFixed(1)}
      </div>
    )}
  </div>
);

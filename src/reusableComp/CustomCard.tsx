export const CustomCard = (props: {
  title?: React.ReactNode;
  children: React.ReactNode;
}) => (
  <div className="rounded px-4 py-2 border-1 bg-gray-200">
    {props.title && (
      <h2 className="text-2xl font-bold mb-2 border-b-2">{props.title}</h2>
    )}
    <div className="text-gray-700 text-base">{props.children}</div>
  </div>
);

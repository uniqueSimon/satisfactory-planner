export const CustomCard = (props: {
  title?: string;
  children: React.ReactNode;
}) => (
  <div className="rounded p-4 border-1 bg-gray-100">
    {props.title && <h2 className="text-2xl font-bold mb-2">{props.title}</h2>}
    <div className="text-gray-700 text-base">{props.children}</div>
  </div>
);

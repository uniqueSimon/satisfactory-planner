export const CustomCard = (props: {
  title?: string;
  children: React.ReactNode;
}) => (
  <div className="bg-white shadow-md rounded p-4">
    {props.title && <h2 className="text-2xl font-bold mb-2">{props.title}</h2>}
    <div className="text-gray-700 text-base">{props.children}</div>
  </div>
);

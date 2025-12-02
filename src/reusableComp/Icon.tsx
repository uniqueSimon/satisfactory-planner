export const Icon = (props: { item: string }) => (
  <img
    className="h-10"
    draggable={false}
    src={`items/desc-${props.item.toLowerCase().replace("_", "-")}-c_64.png`}
  />
);

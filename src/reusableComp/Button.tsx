export const Button = (props: {
  children: React.ReactNode;
  onClick: () => void;
}) => (
  <button
    onClick={props.onClick}
    type="button"
    className='bg-blue-500 text-white px-3 pb-1 pt-1 rounded hover:bg-blue-700'
  >
    {props.children}
  </button>
);









//className="inline-block rounded bg-primary px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-primary-3 transition duration-150 ease-in-out hover:bg-primary-accent-300 hover:shadow-primary-2 focus:bg-primary-accent-300 focus:shadow-primary-2 focus:outline-none focus:ring-0 active:bg-primary-600 active:shadow-primary-2 motion-reduce:transition-none dark:shadow-black/30 dark:hover:shadow-dark-strong dark:focus:shadow-dark-strong dark:active:shadow-dark-strong"
//className="rounded bg-primary px-4 pb-2 pt-2.5 leading-normal text-white shadow-blue-700 transition duration-150 ease-in-out hover:bg-blue-700 hover:shadow-red-300 focus:bg-red-700 focus:shadow-red-500 focus:outline-none focus:ring-0 active:bg-green-500 active:shadow-green-700 motion-reduce:transition-none dark:shadow-black/30 dark:hover:shadow-dark-strong dark:focus:shadow-dark-strong dark:active:shadow-dark-strong"

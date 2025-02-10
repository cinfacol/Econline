const NoResults = ({ title }) => {
  return (
    <div className="flex items-center justify-center h-full w-full text-neutral-500">
      No {title} found.
    </div>
  );
};

export default NoResults;

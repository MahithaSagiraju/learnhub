const Loader = ({ size = "md", text = "Loading..." }) => {
  const sizeClasses = { sm: "h-6 w-6", md: "h-10 w-10", lg: "h-16 w-16" };

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className={`animate-spin rounded-full border-t-2 border-b-2 border-primary ${sizeClasses[size]}`}></div>
      {text && <p className="mt-4 text-gray-500 dark:text-gray-400 text-sm">{text}</p>}
    </div>
  );
};

export default Loader;

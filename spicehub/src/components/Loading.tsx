import { Loader } from "lucide-react";

const Loading = () => {
  return (
    <div className="flex items-center justify-center p-4 h-full">
      <Loader className="h-8 w-8 animate-spin text-blue-500" />
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default Loading;
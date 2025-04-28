// components/widgets/Workshop.tsx
import { Clock, ChevronRight, Folder, ListTodo, AlertCircle} from 'lucide-react';

function WorkshopCard() {

  return (
    <div className="w-full max-w-4xl bg-gray-800 rounded-2xl shadow-lg p-0 overflow-hidden border border-gray-700 hover:border-blue-500 transition-all duration-300 hover:shadow-xl">
      {/* Header with title and status */}
      <div className="border-b border-gray-700 bg-gray-900 p-4 flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-100">Spicelab</h2>
      </div>
      
      {/* Body with stats */}
      <div className="p-4">
        <div className="flex items-center justify-between text-gray-100">
          <div className="flex items-center gap-2">
            <div className="bg-gray-700 p-2 rounded-full">
              <ListTodo className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs text-gray-400">Nierobione zadania</div>
              <div className="font-medium">1</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="bg-gray-700 p-2 rounded-full">
              <AlertCircle className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs text-gray-400">Ważne projekty</div>
              <div className="font-medium">1</div>
            </div>
          </div>
          
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-1 transition-colors">
            Przejdź to SpiceLaba
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default WorkshopCard;

// components/widgets/Workshop.tsx
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUsers,
  faClock,
  faCircleCheck,
  faCircleXmark,
  faChevronRight
} from '@fortawesome/free-solid-svg-icons';

interface WorkshopCardProps {
  title: string;
  status: 'Otwarty' | 'Zamknięty';
  participants: number;
  time: string;
}

function WorkshopCard(props: WorkshopCardProps) {
  const { title, status, participants, time } = props;
  const isOpen = status === 'Otwarty';

  return (
    <div className="w-full max-w-4xl bg-gray-800 rounded-2xl shadow-lg p-0 overflow-hidden border border-gray-700 hover:border-blue-500 transition-all duration-300 hover:shadow-xl">
      {/* Header with title and status */}
      <div className="border-b border-gray-700 bg-gray-900 p-4 flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-100">{title}</h2>
        <span
          className={`flex items-center gap-2 text-xs font-semibold px-3 py-1 rounded-full ${
            isOpen
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-700'
          }`}
        >
          <FontAwesomeIcon
            icon={isOpen ? faCircleCheck : faCircleXmark}
            className="w-3 h-3"
          />
          {status}
        </span>
      </div>
      
      {/* Body with stats */}
      <div className="p-4">
        <div className="flex items-center justify-between text-gray-100">
          <div className="flex items-center gap-2">
            <div className="bg-gray-700 p-2 rounded-full">
              <FontAwesomeIcon icon={faUsers} className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs text-gray-400">Uczestnicy</div>
              <div className="font-medium">{participants} osób</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="bg-gray-700 p-2 rounded-full">
              <FontAwesomeIcon icon={faClock} className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs text-gray-400">Czas</div>
              <div className="font-medium">{time}</div>
            </div>
          </div>
          
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-1 transition-colors">
            Szczegóły
            <FontAwesomeIcon icon={faChevronRight} className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default WorkshopCard;

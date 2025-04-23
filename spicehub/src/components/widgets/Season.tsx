import { Calendar, Bot, Globe, ExternalLink, Moon } from 'lucide-react';

interface SeasonCardProps {
  program?: 'FRC' | 'FGC';
  seasonName?: string;
  seasonYear?: number;
  kickoffDate?: string;
  seasonUrl?: string;
  gameLogoUrl?: string;
  isOffseason?: boolean;
}

const SeasonCard = ({
  program,
  seasonName,
  seasonYear,
  kickoffDate,
  seasonUrl,
  gameLogoUrl,
  isOffseason = false,
}: SeasonCardProps) => {
  const ProgramIcon = program === 'FRC' ? Bot : Globe;

  return (
    <div className="w-full max-w-4xl bg-gray-800 rounded-2xl shadow-lg p-6 flex justify-between items-center border border-gray-700 hover:border-blue-500 transition-all duration-300 hover:shadow-xl overflow-hidden">
      <div className="flex items-center gap-6">
        {gameLogoUrl && !isOffseason && (
          <img
            src={gameLogoUrl}
            alt={`${seasonName} logo`}
            className="w-16 h-16 rounded-xl object-contain"
          />
        )}
        <div>
          <h2 className="text-xl font-bold text-gray-100 flex items-center gap-2">
            <ProgramIcon className="text-blue-600 h-5 w-5" />
            {program} {isOffseason ? 'Offseason' : `Season ${seasonYear}`}
          </h2>

          {isOffseason ? (
            <p className="text-gray-200 text-sm flex items-center gap-2">
              <Moon className="h-4 w-4" />
              Brak aktywnego sezonu!
            </p>
          ) : (
            <p className="text-gray-600 text-sm">
              {seasonName}
              {kickoffDate && (
                <>
                  {' '}
                  · <Calendar className="inline h-4 w-4" />{' '}
                  {new Date(kickoffDate).toLocaleDateString()}
                </>
              )}
            </p>
          )}
        </div>
      </div>

      {!isOffseason && seasonUrl && (
        <a
          href={seasonUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-blue-600 hover:underline flex items-center gap-1"
        >
          Details <ExternalLink className="h-4 w-4" />
        </a>
      )}
    </div>
  );
};

export default SeasonCard;
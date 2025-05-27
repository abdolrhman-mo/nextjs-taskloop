import Link from 'next/link';
import { useTheme } from '@/contexts/ThemeContext';
import { SessionMenu } from './SessionMenu';
import { Session, User } from '@/types/session';

interface SessionCardProps {
  session: Session;
  user: User | null;
  isFeatured?: boolean;
  onLeave: (sessionId: string, e: React.MouseEvent) => Promise<void>;
  onDelete: (sessionId: string, e: React.MouseEvent) => Promise<void>;
  isLeaving: boolean;
  isDeleting: boolean;
  leaveError: string | null;
  deleteError: string | null;
}

// Helper to format date
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString(undefined, {
    year: 'numeric', month: 'long', day: 'numeric'
  });
};

export const SessionCard = ({ 
  session, 
  user, 
  isFeatured = false, 
  onLeave,
  onDelete,
  isLeaving,
  isDeleting,
  leaveError,
  deleteError
}: SessionCardProps) => {
  const { theme } = useTheme();
  // Determine if current user created this session
  const isCreator = user && session.creator === user.id;
  const isParticipant = user && session.participants.some(p => p.id === user.id);

  return (
    <div
      className={`
        block rounded-lg overflow-hidden transition-all duration-300 group relative border shadow-sm
        ${isFeatured 
          ? `p-6` 
          : `p-5`
        }
        ${(isLeaving || isDeleting) ? 'opacity-50 pointer-events-none' : ''}
      `}
      style={{
        backgroundColor: theme.background.secondary,
        borderColor: theme.border,
        borderLeftWidth: '1px',
      }}
    >
      {/* Role Badge */}
      {isParticipant && (
        <div 
          className="absolute top-3 left-3 px-2 py-1 rounded-md text-xs font-medium"
          style={{
            backgroundColor: `${theme.background.tertiary}20`,
            color: theme.typography.secondary
          }}
        >
          {isCreator ? 'Created by you' : `Created by ${session.creator_username}`}
        </div>
      )}

      <SessionMenu 
        session={session}
        user={user}
        onLeave={onLeave}
        onDelete={onDelete}
        isLeaving={isLeaving}
        isDeleting={isDeleting}
        leaveError={leaveError}
        deleteError={deleteError}
      />

      <div className={`mb-3 ${isFeatured ? 'text-center' : ''} ${isParticipant ? 'mt-8' : ''}`}>
        <h2 className={`font-bold group-hover:text-opacity-80 transition-colors ${isFeatured ? 'text-2xl mb-2' : 'text-xl mb-1'}`} 
          style={{
            color: theme.typography.primary
          }}
        >
          {session.name}
        </h2>
        <div className="space-y-1">
          <p className={`text-xs ${isFeatured ? 'mb-1' : ''}`} style={{color: theme.typography.secondary}}>
            {session.participants_count} {session.participants_count === 1 ? 'participant' : 'participants'}
          </p>
          <p className="text-xs" style={{color: theme.typography.secondary}}>
            Created {formatDate(session.created_at)}
          </p>
        </div>
      </div>
      
      <Link 
        href={`/session/${session.uuid}`}
        className={`block w-full text-center py-2.5 mt-4 rounded-md text-sm font-semibold transition-colors duration-200 active:scale-95 cursor-pointer`}
        style={{
          backgroundColor: theme.background.tertiary,
          color: theme.typography.primary,
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLElement).style.backgroundColor = theme.background.fourth;
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLElement).style.backgroundColor = theme.background.tertiary;
        }}
      >
        {isParticipant ? 'Join' : 'View Session'}
      </Link>
    </div>
  );
}; 
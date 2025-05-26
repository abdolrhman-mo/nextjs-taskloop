import { theme } from '@/config/theme';

export const EmptyState = () => {
  return (
    <div className="text-center py-20">
      <svg className="mx-auto h-16 w-16 mb-4" style={{color: theme.typography.secondary}} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
      <h2 className="text-2xl font-semibold mb-3" style={{color: theme.typography.primary}}>No Sessions Available</h2>
      <p style={{color: theme.typography.secondary}} className="mb-6">
        There are no active sessions right now. Be the first to start one!
      </p>
    </div>
  );
}; 
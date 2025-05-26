import { theme } from '@/config/theme';

export const LoadingState = () => {
  return (
    <div style={{color: theme.typography.secondary}} className="text-center py-20 text-xl">
      Loading...
    </div>
  );
}; 
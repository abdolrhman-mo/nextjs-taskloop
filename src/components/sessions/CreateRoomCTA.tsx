import { useTheme } from '@/contexts/ThemeContext';
import Link from 'next/link';
import { BookOpen, Eye, Target, Users, ArrowRight } from 'lucide-react';
import { BaseCTA } from '@/components/common/BaseCTA';

export function CreateRoomCTA() {
  const { theme } = useTheme();

  const features = [
    {
      icon: Eye,
      title: 'Live Task Updates',
      description: 'See what your friends have finished in real-time'
    },
    {
      icon: Target,
      title: 'Stay Accountable',
      description: 'Keep focused knowing your friends are watching'
    },
    {
      icon: Users,
      title: 'Group Motivation',
      description: 'Get inspired by your friends\' accomplishments'
    }
  ];

  const actionButton = (
    <Link 
      href="/session/create"
      className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg text-base font-medium transition-opacity duration-200 hover:opacity-90"
      style={{
        backgroundColor: theme.brand.background,
        color: theme.brand.text
      }}
    >
      <span>Start Study Room</span>
      <ArrowRight className="w-5 h-5" />
    </Link>
  );

  return (
    <BaseCTA
      icon={BookOpen}
      title="Start Your Study Journey"
      description="Create your first study room and begin studying with friends!"
      features={features}
      actionButton={actionButton}
    />
  );
} 
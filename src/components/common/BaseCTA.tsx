import { ReactNode } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { LucideIcon } from 'lucide-react';

interface FeatureCard {
  icon: LucideIcon;
  title: string;
  description: string;
}

interface BaseCTAProps {
  icon: LucideIcon;
  title: string;
  description: string;
  features?: FeatureCard[];
  actionButton: ReactNode;
  className?: string;
}

export function BaseCTA({ 
  icon: Icon,
  title,
  description,
  features,
  actionButton,
  className = ''
}: BaseCTAProps) {
  const { theme } = useTheme();

  return (
    <div 
      className={`p-8 rounded-lg text-center max-w-2xl mx-auto ${className}`}
      style={{ 
        backgroundColor: `${theme.brand.background}10`,
        border: `1px solid ${theme.border}`
      }}
    >
      <div className="flex justify-center mb-4">
        <div 
          className="p-3 rounded-full"
          style={{ backgroundColor: `${theme.brand.background}20` }}
        >
          <Icon className="w-8 h-8" style={{ color: theme.brand.background }} />
        </div>
      </div>

      <h3 
        className="text-2xl font-bold mb-3"
        style={{ color: theme.typography.primary }}
      >
        {title}
      </h3>

      <div className="space-y-4 mb-8">
        <p 
          className="text-base"
          style={{ color: theme.typography.secondary }}
        >
          {description}
        </p>

        {features && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="p-4 rounded-lg" 
                style={{ backgroundColor: `${theme.brand.background}15` }}
              >
                <feature.icon className="w-6 h-6 mx-auto mb-2" style={{ color: theme.brand.background }} />
                <p className="text-sm font-medium" style={{ color: theme.typography.primary }}>
                  {feature.title}
                </p>
                <p className="text-xs mt-1" style={{ color: theme.typography.secondary }}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {actionButton}
    </div>
  );
} 
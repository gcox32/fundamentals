import { ReactNode } from 'react';
import { useTheme } from '@/src/contexts/ThemeContext';

interface VisibilityWrapperProps {
  componentId: string;
  children: ReactNode;
}

export default function VisibilityWrapper({ componentId, children }: VisibilityWrapperProps) {
  const { dashboardComponents, leadingIndicators } = useTheme();
  const component = dashboardComponents.find(c => c.id === componentId);
  const leadingIndicator = leadingIndicators.find(c => c.id === componentId);
  
  if (!component?.isVisible && !leadingIndicator?.isVisible) {
    return null;
  }

  return <>{children}</>;
} 
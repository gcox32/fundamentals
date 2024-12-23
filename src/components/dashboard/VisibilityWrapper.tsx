import { ReactNode } from 'react';
import { useTheme } from '@/src/contexts/ThemeContext';

interface VisibilityWrapperProps {
  componentId: string;
  children: ReactNode;
}

export default function VisibilityWrapper({ componentId, children }: VisibilityWrapperProps) {
  const { dashboardComponents } = useTheme();
  const component = dashboardComponents.find(c => c.id === componentId);
  
  if (!component?.isVisible) {
    return null;
  }

  return <>{children}</>;
} 
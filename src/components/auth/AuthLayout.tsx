import React from 'react';
import { BilgeLogo } from '@/components/BilgeLogo';
import { useTheme } from '@/contexts/ThemeContext';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AuthLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="flex items-center justify-between p-4">
        <div className="flex items-center gap-2">
          <BilgeLogo size="sm" />
          <span className="font-semibold text-lg">Bilge</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="h-9 w-9"
        >
          {theme === 'dark' ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </Button>
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-sm">
          {/* Logo and title */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <BilgeLogo size="lg" />
            </div>
            {title && (
              <h1 className="text-2xl font-semibold text-foreground mb-2">{title}</h1>
            )}
            {subtitle && (
              <p className="text-sm text-muted-foreground">{subtitle}</p>
            )}
          </div>

          {/* Form content */}
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="p-4 text-center">
        <p className="text-xs text-muted-foreground">
          Bilge - Turkiye'nin Ilk Yerli Yapay Zekasi
        </p>
      </footer>
    </div>
  );
};

import React from 'react';
import { Link } from 'react-router-dom';
import { BilgeLogo } from '@/components/BilgeLogo';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import { Moon, Sun, Sparkles, MessageSquare, Shield, Zap } from 'lucide-react';
import { TurkishFlag } from '@/components/TurkishFlag';

const Landing: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="flex items-center justify-between p-4 md:px-8">
        <div className="flex items-center gap-2">
          <BilgeLogo size="sm" />
          <span className="font-semibold text-lg">Bilge</span>
        </div>
        <div className="flex items-center gap-2">
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
          <Link to="/login">
            <Button variant="ghost" size="sm">
              Giris Yap
            </Button>
          </Link>
          <Link to="/signup">
            <Button size="sm">
              Kayit Ol
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-8">
        <div className="text-center max-w-2xl mx-auto">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <BilgeLogo size="xl" animated />
          </div>

          {/* Title */}
          <div className="flex items-center justify-center gap-3 mb-4">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">
              Bilge
            </h1>
            <TurkishFlag size="md" />
          </div>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-muted-foreground mb-8">
            Turkiye'nin Ilk Yerli Yapay Zeka Asistani
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-12">
            <Link to="/signup" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto gap-2 px-8">
                <Sparkles className="h-4 w-4" />
                Ucretsiz Basla
              </Button>
            </Link>
            <Link to="/login" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full sm:w-auto px-8">
                Giris Yap
              </Button>
            </Link>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="p-6 rounded-2xl bg-muted/30 border border-border/50">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 mx-auto">
                <MessageSquare className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Dogal Konusma</h3>
              <p className="text-sm text-muted-foreground">
                Turkce olarak dogal bir sekilde sohbet edin
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-muted/30 border border-border/50">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 mx-auto">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Hizli Yanitlar</h3>
              <p className="text-sm text-muted-foreground">
                Aninda ve dogru cevaplar alin
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-muted/30 border border-border/50">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 mx-auto">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Guvenli</h3>
              <p className="text-sm text-muted-foreground">
                Verileriniz guvenle saklanir
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-4 text-center border-t border-border/50">
        <p className="text-xs text-muted-foreground">
          2024 Bilge AI. Tum haklar saklidir.
        </p>
      </footer>
    </div>
  );
};

export default Landing;

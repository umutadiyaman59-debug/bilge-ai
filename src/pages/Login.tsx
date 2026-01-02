import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, Eye, EyeOff, AlertCircle } from 'lucide-react';

// Google icon component
const GoogleIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
);

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { signIn, signInWithGoogle } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    setError(null);
    setIsGoogleLoading(true);
    try {
      const { error: authError } = await signInWithGoogle();
      if (authError) {
        setError(authError.message);
      }
    } catch (err) {
      setError('Google ile giris yapilamadi. Lutfen tekrar deneyin.');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const { error: authError } = await signIn(email, password);

      if (authError) {
        if (authError.message.includes('Invalid login credentials')) {
          setError('Email veya sifre hatali');
        } else if (authError.message.includes('Email not confirmed')) {
          setError('Lutfen email adresinizi dogrulayin');
        } else {
          setError(authError.message);
        }
      } else {
        navigate('/chat');
      }
    } catch (err) {
      setError('Bir hata olustu. Lutfen tekrar deneyin.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Tekrar Hos Geldiniz"
      subtitle="Bilge hesabiniza giris yapin"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Error message */}
        {error && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="ornek@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
            className="h-11"
          />
        </div>

        {/* Password */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Sifre</Label>
            <Link
              to="/forgot-password"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Sifremi Unuttum
            </Link>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Sifrenizi girin"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
              className="h-11 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        {/* Submit */}
        <Button
          type="submit"
          className="w-full h-11"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Giris Yapiliyor...
            </>
          ) : (
            'Giris Yap'
          )}
        </Button>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="px-2 bg-background text-muted-foreground">
              veya
            </span>
          </div>
        </div>

        {/* Google Sign In */}
        <Button
          type="button"
          variant="outline"
          className="w-full h-11"
          onClick={handleGoogleSignIn}
          disabled={isLoading || isGoogleLoading}
        >
          {isGoogleLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Google ile Giris Yapiliyor...
            </>
          ) : (
            <>
              <GoogleIcon />
              <span className="ml-2">Google ile Giris Yap</span>
            </>
          )}
        </Button>

        {/* Sign up link */}
        <p className="text-center text-sm text-muted-foreground mt-6">
          Hesabiniz yok mu?{' '}
          <Link
            to="/signup"
            className="text-foreground font-medium hover:underline"
          >
            Kayit Ol
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default Login;

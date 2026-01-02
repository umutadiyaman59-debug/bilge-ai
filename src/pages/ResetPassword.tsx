import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react';

const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const { updatePassword } = useAuth();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const validatePassword = (pwd: string) => {
    return pwd.length >= 8;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validations
    if (!validatePassword(password)) {
      setError('Sifre en az 8 karakter olmalidir');
      return;
    }

    if (password !== confirmPassword) {
      setError('Sifreler eslesmiyor');
      return;
    }

    setIsLoading(true);

    try {
      const { error: authError } = await updatePassword(password);

      if (authError) {
        setError(authError.message);
      } else {
        setSuccess(true);
      }
    } catch (err) {
      setError('Bir hata olustu. Lutfen tekrar deneyin.');
    } finally {
      setIsLoading(false);
    }
  };

  // Success state
  if (success) {
    return (
      <AuthLayout
        title="Sifre Guncellendi"
        subtitle="Sifreniz basariyla degistirildi"
      >
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto">
            <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <p className="text-sm text-muted-foreground">
            Artik yeni sifrenizle giris yapabilirsiniz.
          </p>
          <Button
            className="w-full"
            onClick={() => navigate('/login')}
          >
            Giris Yap
          </Button>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Yeni Sifre Belirle"
      subtitle="Hesabiniz icin yeni bir sifre olusturun"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Error message */}
        {error && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* New Password */}
        <div className="space-y-2">
          <Label htmlFor="password">Yeni Sifre</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="En az 8 karakter"
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
          {password && !validatePassword(password) && (
            <p className="text-xs text-destructive">
              Sifre en az 8 karakter olmalidir
            </p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Sifre Tekrar</Label>
          <Input
            id="confirmPassword"
            type={showPassword ? 'text' : 'password'}
            placeholder="Sifrenizi tekrar girin"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            disabled={isLoading}
            className="h-11"
          />
          {confirmPassword && password !== confirmPassword && (
            <p className="text-xs text-destructive">
              Sifreler eslesmiyor
            </p>
          )}
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
              Guncelleniyor...
            </>
          ) : (
            'Sifreyi Guncelle'
          )}
        </Button>
      </form>
    </AuthLayout>
  );
};

export default ResetPassword;

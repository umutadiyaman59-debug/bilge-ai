import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, AlertCircle, CheckCircle2, ArrowLeft } from 'lucide-react';

const ForgotPassword: React.FC = () => {
  const { resetPassword } = useAuth();

  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const { error: authError } = await resetPassword(email);

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
        title="Email Gonderildi"
        subtitle="Sifre sifirlama linki gonderildi"
      >
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto">
            <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <p className="text-sm text-muted-foreground">
            <strong>{email}</strong> adresine sifre sifirlama linki gonderdik.
            Lutfen email kutunuzu kontrol edin.
          </p>
          <p className="text-xs text-muted-foreground">
            Email gelmediyse spam klasorunu de kontrol edin.
          </p>
          <Link to="/login">
            <Button variant="outline" className="w-full mt-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Giris Sayfasina Don
            </Button>
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Sifremi Unuttum"
      subtitle="Email adresinizi girin, size sifre sifirlama linki gonderelim"
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

        {/* Submit */}
        <Button
          type="submit"
          className="w-full h-11"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Gonderiliyor...
            </>
          ) : (
            'Sifirlama Linki Gonder'
          )}
        </Button>

        {/* Back to login */}
        <Link to="/login">
          <Button variant="ghost" className="w-full mt-2">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Girise Don
          </Button>
        </Link>
      </form>
    </AuthLayout>
  );
};

export default ForgotPassword;

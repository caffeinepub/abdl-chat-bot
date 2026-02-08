import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { LogIn, LogOut } from 'lucide-react';

interface AuthButtonProps {
  onLogout?: () => void;
}

export function AuthButton({ onLogout }: AuthButtonProps) {
  const { login, clear, loginStatus, identity } = useInternetIdentity();

  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === 'logging-in';

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      onLogout?.();
    } else {
      try {
        await login();
      } catch (error: any) {
        console.error('Login error:', error);
        if (error.message === 'User is already authenticated') {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  return (
    <Button
      onClick={handleAuth}
      disabled={isLoggingIn}
      variant={isAuthenticated ? 'outline' : 'default'}
      size="sm"
      className="h-10 min-w-[44px]"
    >
      {isLoggingIn ? (
        <span className="text-sm">Signing in...</span>
      ) : isAuthenticated ? (
        <>
          <LogOut className="h-4 w-4 sm:mr-2" />
          <span className="hidden sm:inline">Sign Out</span>
        </>
      ) : (
        <>
          <LogIn className="h-4 w-4 sm:mr-2" />
          <span className="hidden sm:inline">Sign In</span>
        </>
      )}
    </Button>
  );
}

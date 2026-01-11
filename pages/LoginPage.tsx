
import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { ArrowRightOnRectangleIcon, GoogleIcon, GitHubIcon, ScaleSiteLogo } from '../components/Icons';
import { useLanguage } from '../contexts/LanguageContext';

interface LoginPageProps {
    setCurrentPage: (page: string) => void;
}

const LoadingSpinner: React.FC = () => (
    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

const SocialButton: React.FC<{ icon: React.ReactNode; provider: string; onClick: () => void; disabled?: boolean; label: string }> = ({ icon, provider, onClick, disabled, label }) => (
     <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className="w-full inline-flex justify-center items-center gap-3 py-3 px-4 border border-dark-text/10 dark:border-light-text/10 rounded-xl shadow-sm bg-white dark:bg-dark-surface text-sm font-semibold text-dark-text dark:text-light-text transition-all hover:bg-slate-50 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-offset-dark-surface disabled:opacity-60 disabled:cursor-not-allowed hover:scale-[1.01]"
    >
        {icon}
        <span>{label}</span>
    </button>
);

const LoginPage: React.FC<LoginPageProps> = ({ setCurrentPage }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<'google' | 'github' | null>(null);
  const { login, socialLogin, loginWithToken } = useContext(AuthContext);
  const { t } = useLanguage();

  // Check for Token in URL (Return from Social Login)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const urlError = params.get('error');

    if (token) {
        setLoading(true);
        loginWithToken(token).then(success => {
            if (success) {
                window.history.replaceState({}, document.title, window.location.pathname);
                setCurrentPage('dashboard');
            } else {
                setError(t('general.error'));
                setLoading(false);
            }
        });
    } else if (urlError) {
        setError(t('general.error'));
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError(t('general.error'));
      return;
    }
    setLoading(true);
    const result = await login(email, password);
    
    if (result.error) {
        setError(t('general.error'));
    } else if (result.success) {
      setCurrentPage('dashboard');
    }
    setLoading(false);
  };

  const handleSocialLogin = async (provider: 'google' | 'github') => {
      setSocialLoading(provider);
      setError('');
      
      const result = await socialLogin(provider);
      
      if (!result.success && result.error) {
          setError(result.error);
          setSocialLoading(null);
      }
      // Bei Erfolg: Der Browser wurde bereits umgeleitet, also nichts weiter tun.
  };

  const hasError = !!error;

  if (loading && !email && !password) { // Show loading screen if verifying token from URL
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-light-bg dark:bg-dark-bg">
             <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
             <p className="text-slate-500">{t('auth.logging_in')}</p>
        </div>
      );
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-light-bg dark:bg-dark-bg px-4 py-12">
       <div className="text-center mb-8 animate-fade-in">
         <button onClick={() => setCurrentPage('home')} className="text-dark-text dark:text-light-text hover:opacity-80 transition-opacity">
            <ScaleSiteLogo className="h-10" />
         </button>
       </div>
      <div 
        className="w-full max-w-md bg-white dark:bg-dark-surface rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 p-8 sm:p-10 space-y-8 animate-slide-up"
      >
        <div className="text-center">
          <h2 className="text-3xl font-bold text-dark-text dark:text-light-text font-serif">
            {t('auth.welcome_back')}
          </h2>
          <p className="mt-2 text-dark-text/60 dark:text-light-text/60">
            {t('auth.login_subtitle')}
          </p>
        </div>

         <div className="space-y-3">
            <SocialButton 
                icon={socialLoading === 'google' ? <LoadingSpinner /> : <GoogleIcon />} 
                provider="Google" 
                onClick={() => handleSocialLogin('google')}
                disabled={!!socialLoading}
                label={t('auth.continue_with').replace('{provider}', 'Google')}
            />
            <SocialButton 
                icon={socialLoading === 'github' ? <LoadingSpinner /> : <GitHubIcon />} 
                provider="GitHub" 
                onClick={() => handleSocialLogin('github')}
                disabled={!!socialLoading}
                label={t('auth.continue_with').replace('{provider}', 'GitHub')}
            />
        </div>

        <div className="relative">
            <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-slate-700" />
            </div>
            <div className="relative flex justify-center text-xs uppercase tracking-wide font-bold text-slate-400">
                <span className="px-4 bg-white dark:bg-dark-surface">
                {t('auth.or_email')}
                </span>
            </div>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit} noValidate aria-describedby={hasError ? 'login-error' : undefined}>
          <div className="space-y-4">
              <div>
                <label htmlFor="email-address" className="sr-only">{t('auth.email')}</label>
                <input
                    id="email-address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className={`input-premium ${hasError ? 'border-red-500 focus:ring-red-500' : ''}`}
                    placeholder={t('placeholders.email_example')}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    aria-invalid={hasError}
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">{t('auth.password')}</label>
                <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className={`input-premium ${hasError ? 'border-red-500 focus:ring-red-500' : ''}`}
                    placeholder={t('auth.password')}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    aria-invalid={hasError}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
                <label className="flex items-center cursor-pointer">
                    <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-primary border-slate-300 rounded focus:ring-primary" />
                    <span className="ml-2 block text-sm text-dark-text/70 dark:text-light-text/70">{t('auth.remember_me')}</span>
                </label>
                <div className="text-sm">
                    <button 
                      onClick={(e) => e.preventDefault()} 
                      disabled
                      className="font-semibold text-primary hover:text-primary-hover disabled:opacity-60 disabled:cursor-not-allowed transition-colors">{t('auth.forgot_password')}</button>
                </div>
            </div>
          
          {hasError && <div id="login-error" role="alert" className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-600 dark:text-red-400 text-center font-medium">{error}</div>}

          <div>
            <button
              type="submit"
              disabled={loading || !!socialLoading}
              className="w-full flex justify-center items-center py-3.5 px-4 border border-transparent font-bold rounded-xl text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-70 disabled:cursor-not-allowed dark:focus:ring-offset-dark-surface active:scale-[0.98] transition-all shadow-lg shadow-primary/20"
            >
              {loading ? <LoadingSpinner /> : <ArrowRightOnRectangleIcon className="h-5 w-5 mr-2" />}
              {loading ? t('auth.logging_in') : t('auth.login_btn')}
            </button>
          </div>
        </form>
        
      </div>
       <div className="mt-8 text-center text-sm animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <p className="text-dark-text/70 dark:text-light-text/70">
            {t('auth.no_account')}{' '}
            <button onClick={() => setCurrentPage('register')} className="font-bold text-primary hover:text-primary-hover transition-colors focus:outline-none">
              {t('auth.register_now')}
            </button>
          </p>
        </div>
    </div>
  );
};

export default LoginPage;
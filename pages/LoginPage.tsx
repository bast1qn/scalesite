
import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { ArrowRightOnRectangleIcon, GoogleIcon, GitHubIcon, ScaleSiteLogo } from '../components/Icons';
import { useLanguage } from '../contexts/LanguageContext';
import { supabase } from '../lib/supabase';

interface LoginPageProps {
    setCurrentPage: (page: string) => void;
}

const LoadingSpinner: React.FC = () => (
    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

const SocialButton: React.FC<{ icon: React.ReactNode; provider: string; onClick: () => void; disabled?: boolean; label: string }> = ({ icon, provider, onClick, disabled, label }) => (
     <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className="w-full inline-flex justify-center items-center gap-3 py-3.5 px-4 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm bg-white dark:bg-slate-800 text-sm font-semibold text-slate-700 dark:text-slate-300 transition-all hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-slate-900 disabled:opacity-60 disabled:cursor-not-allowed"
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
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const { login, socialLogin, loginWithToken } = useContext(AuthContext);
  const { t, language } = useLanguage();

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

  const handleResetPassword = async (e: React.FormEvent) => {
      e.preventDefault();
      setError('');
      if (!email) {
          setError(t('general.error'));
          return;
      }
      setLoading(true);
      try {
          const { error } = await supabase.auth.resetPasswordForEmail(email, {
              redirectTo: `${window.location.origin}/login`,
          });
          if (error) {
              setError(error.message);
          } else {
              setResetSuccess(true);
          }
      } catch (err: any) {
          setError(err.message || t('general.error'));
      } finally {
          setLoading(false);
      }
  };

  const hasError = !!error;

  if (loading && !email && !password) { // Show loading screen if verifying token from URL
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950">
             <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
             <p className="text-slate-500">{t('auth.logging_in')}</p>
        </div>
      );
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-slate-50 dark:bg-slate-950 px-4 py-12 relative overflow-hidden">
       {/* Animated background */}
       <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-[20%] left-[10%] w-[600px] h-[600px] bg-gradient-to-br from-blue-400/8 to-violet-400/6 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-[20%] right-[10%] w-[500px] h-[500px] bg-gradient-to-br from-emerald-400/6 to-teal-400/4 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '3s' }}></div>
       </div>

       <div className="relative z-10 w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <button onClick={() => setCurrentPage('home')} className="inline-flex">
                <ScaleSiteLogo className="h-10 text-slate-900 dark:text-white hover:opacity-80 transition-opacity" />
            </button>
          </div>

          {/* Login Card */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-black/50 border border-slate-200 dark:border-slate-700 p-8 sm:p-10">
            <div className="text-center mb-8">
                <h2 className="font-serif text-3xl font-bold text-slate-900 dark:text-white">
                    {t('auth.welcome_back')}
                </h2>
                <p className="mt-2 text-slate-600 dark:text-slate-400">
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

            <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200 dark:border-slate-700" />
                </div>
                <div className="relative flex justify-center text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    <span className="px-4 bg-white dark:bg-slate-800">
                    {t('auth.or_email')}
                    </span>
                </div>
            </div>

            <form className="space-y-5" onSubmit={showResetPassword ? handleResetPassword : handleSubmit} noValidate aria-describedby={hasError ? 'login-error' : undefined}>
              <div>
                    <input
                        id="email-address"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        className={`w-full bg-slate-50 dark:bg-slate-700/50 border ${hasError ? 'border-red-500 focus:ring-red-500' : 'border-slate-200 dark:border-slate-600 focus:border-blue-500 focus:ring-blue-500/10'} text-slate-900 dark:text-white rounded-xl px-4 py-3.5 focus:outline-none focus:ring-4 transition-all`}
                        placeholder={t('placeholders.email_example')}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        aria-invalid={hasError}
                    />
              </div>
              {!showResetPassword && (
                  <>
                      <div>
                          <input
                              id="password"
                              name="password"
                              type="password"
                              autoComplete="current-password"
                              required={!showResetPassword}
                              className={`w-full bg-slate-50 dark:bg-slate-700/50 border ${hasError ? 'border-red-500 focus:ring-red-500' : 'border-slate-200 dark:border-slate-600 focus:border-blue-500 focus:ring-blue-500/10'} text-slate-900 dark:text-white rounded-xl px-4 py-3.5 focus:outline-none focus:ring-4 transition-all`}
                              placeholder={t('auth.password')}
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              aria-invalid={hasError}
                          />
                      </div>

                      <div className="flex items-center justify-between text-sm">
                          <label className="flex items-center cursor-pointer">
                              <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500" />
                              <span className="ml-2 text-slate-600 dark:text-slate-400">{t('auth.remember_me')}</span>
                          </label>
                          <button
                              type="button"
                              onClick={() => setShowResetPassword(!showResetPassword)}
                              className="font-semibold text-blue-600 dark:text-blue-400 hover:underline transition-colors"
                          >
                              {showResetPassword ? t('auth.back_to_login') : t('auth.forgot_password')}
                          </button>
                      </div>
                  </>
              )}

              {showResetPassword && (
                  <div className="flex justify-end text-sm">
                      <button
                          type="button"
                          onClick={() => setShowResetPassword(false)}
                          className="font-semibold text-blue-600 dark:text-blue-400 hover:underline transition-colors"
                      >
                          {t('auth.back_to_login')}
                      </button>
                  </div>
              )}

            {hasError && (
                <div id="login-error" role="alert" className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 rounded-xl text-sm text-red-600 dark:text-red-400 text-center font-medium">
                    {error}
                </div>
            )}

            {resetSuccess && (
                <div id="reset-success" role="status" className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/30 rounded-xl text-sm text-green-600 dark:text-green-400 text-center font-medium">
                    {language === 'de' ? 'Passwort-Reset Link wurde gesendet. Prüfe deine E-Mail.' : 'Password reset link sent. Check your email.'}
                </div>
            )}

              <button
                type="submit"
                disabled={loading || !!socialLoading}
                className="w-full flex justify-center items-center py-4 px-4 border border-transparent font-bold rounded-xl text-white bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 hover:shadow-lg hover:shadow-blue-500/25 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-slate-800 disabled:opacity-70 disabled:cursor-not-allowed active:scale-[0.98] transition-all"
              >
                {loading ? <LoadingSpinner /> : null}
                {loading ? (t('auth.logging_in')) : showResetPassword ? (language === 'de' ? 'Link senden' : 'Send Link') : t('auth.login_btn')}
              </button>
            </form>
          </div>

           <div className="mt-8 text-center text-sm">
              <p className="text-slate-600 dark:text-slate-400">
                {t('auth.no_account')}{' '}
                <button onClick={() => setCurrentPage('register')} className="font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors focus:outline-none">
                  {t('auth.register_now')}
                </button>
              </p>
          </div>
       </div>
    </div>
  );
};

export default LoginPage;

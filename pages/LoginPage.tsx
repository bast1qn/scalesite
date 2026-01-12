import { useState, useContext, useEffect } from 'react';
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
        className="group relative w-full inline-flex justify-center items-center gap-3 py-3 px-4 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm bg-white dark:bg-slate-800 text-sm font-medium text-slate-700 dark:text-slate-300 transition-all duration-250 hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-md hover:-translate-y-px focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
    >
        <span className="relative flex items-center gap-3">
            <span className="transition-transform duration-250 ease-out group-hover:scale-105">{icon}</span>
            <span>{label}</span>
        </span>
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
  // Note: This effect intentionally runs once on mount to check URL params.
  // The callbacks are stable from context, so excluding them is safe.
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
        }).catch(() => {
            setError(t('general.error'));
            setLoading(false);
        });
    } else if (urlError) {
        setError(t('general.error'));
    }
  // Disable exhaustive-deps: This should only run once on mount for URL param checking
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
      } catch (err: unknown) {
          setError(err instanceof Error ? err.message : t('general.error'));
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
       {/* Animated gradient background */}
       <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Floating gradient orbs */}
            <div className="absolute top-[10%] left-[5%] w-[600px] h-[600px] bg-gradient-to-br from-blue-400/15 via-violet-400/10 to-indigo-400/8 rounded-full blur-3xl animate-gradient-orb-1"></div>
            <div className="absolute bottom-[10%] right-[5%] w-[500px] h-[500px] bg-gradient-to-br from-violet-400/12 via-purple-400/8 to-pink-400/5 rounded-full blur-3xl animate-gradient-orb-2"></div>
            <div className="absolute top-[40%] right-[30%] w-[300px] h-[300px] bg-gradient-to-br from-emerald-400/10 to-teal-400/6 rounded-full blur-3xl animate-gradient-orb-3"></div>

            {/* Animated particles */}
            <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-500/30 rounded-full animate-float-up" style={{ animationDelay: '0s' }}></div>
            <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-violet-500/30 rounded-full animate-float-up" style={{ animationDelay: '2s' }}></div>
            <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-indigo-500/30 rounded-full animate-float-up" style={{ animationDelay: '4s' }}></div>
            <div className="absolute top-1/2 right-1/4 w-2 h-2 bg-blue-500/20 rounded-full animate-float-up" style={{ animationDelay: '1s' }}></div>
            <div className="absolute bottom-1/3 right-1/2 w-2 h-2 bg-violet-500/20 rounded-full animate-float-up" style={{ animationDelay: '3s' }}></div>

            {/* Grid pattern overlay */}
            <div
                className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
                style={{
                    backgroundImage: `linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)`,
                    backgroundSize: '60px 60px',
                }}
            ></div>
       </div>

       <div className="relative z-10 w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8 animate-fade-in">
            <button onClick={() => setCurrentPage('home')} className="inline-flex group transition-transform duration-300 hover:scale-105">
                <ScaleSiteLogo className="h-11 text-slate-900 dark:text-white transition-all duration-300 group-hover:drop-shadow-lg group-hover:drop-shadow-blue-500/20" />
            </button>
          </div>

          {/* Login Card with glass-morphism */}
          <div className="relative bg-white/90 dark:bg-slate-800/90 backdrop-blur-2xl rounded-3xl shadow-2xl shadow-slate-200/50 dark:shadow-black/50 border border-slate-200/60 dark:border-slate-700/60 p-8 sm:p-10 animate-scale-in overflow-hidden hover:shadow-primary-500/10 transition-shadow duration-300">
              {/* Decorative gradient border */}
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-500 via-violet-500 to-primary-600 rounded-t-3xl"></div>

              {/* Subtle glow effect */}
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-primary-400/5 to-violet-400/5 rounded-full blur-3xl pointer-events-none"></div>

              <div className="relative">
                <div className="text-center mb-8">
                    <h2 className="font-serif text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                        {t('auth.welcome_back')}
                    </h2>
                    <p className="mt-3 text-slate-600 dark:text-slate-400 leading-relaxed">
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
                    <span className="px-4 bg-white/90 dark:bg-slate-800/90 backdrop-blur">
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
                        className={`group/wrap relative w-full bg-slate-50/80 dark:bg-slate-700/50 backdrop-blur border-2 ${hasError ? 'border-red-300 dark:border-red-600 focus:ring-red-500/20' : 'border-slate-200 dark:border-slate-600 focus:border-primary-500 dark:focus:border-primary-400 focus:ring-primary-500/10'} text-slate-900 dark:text-white rounded-xl px-4 py-3.5 focus:outline-none focus:ring-4 transition-all duration-250 placeholder:text-slate-400`}
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
                              className={`group/wrap relative w-full bg-slate-50/80 dark:bg-slate-700/50 backdrop-blur border-2 ${hasError ? 'border-red-300 dark:border-red-600 focus:ring-red-500/20' : 'border-slate-200 dark:border-slate-600 focus:border-primary-500 dark:focus:border-primary-400 focus:ring-primary-500/10'} text-slate-900 dark:text-white rounded-xl px-4 py-3.5 focus:outline-none focus:ring-4 transition-all duration-250 placeholder:text-slate-400`}
                              placeholder={t('auth.password')}
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              aria-invalid={hasError}
                          />
                      </div>

                      <div className="flex items-center justify-between text-sm">
                          <label className="flex items-center cursor-pointer group">
                              <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-primary-600 border-slate-300 rounded focus:ring-2 focus:ring-primary-500/50 transition-all" />
                              <span className="ml-2 text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors duration-200">{t('auth.remember_me')}</span>
                          </label>
                          <button
                              type="button"
                              onClick={() => setShowResetPassword(!showResetPassword)}
                              className="font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors duration-200"
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
                          className="font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors duration-200"
                      >
                          {t('auth.back_to_login')}
                      </button>
                  </div>
              )}

            {hasError && (
                <div id="login-error" role="alert" className="p-4 bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 border border-red-200/60 dark:border-red-800/40 rounded-xl text-sm text-red-600 dark:text-red-400 text-center font-medium animate-slide-down flex items-center justify-center gap-2">
                    <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                    {error}
                </div>
            )}

            {resetSuccess && (
                <div id="reset-success" role="status" className="p-4 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 border border-emerald-200/60 dark:border-emerald-800/40 rounded-xl text-sm text-emerald-600 dark:text-emerald-400 text-center font-medium animate-slide-down flex items-center justify-center gap-2">
                    <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                    {language === 'de' ? 'Passwort-Reset Link wurde gesendet. Prüfe deine E-Mail.' : 'Password reset link sent. Check your email.'}
                </div>
            )}

              <button
                type="submit"
                disabled={loading || !!socialLoading}
                className="group relative w-full flex justify-center items-center py-3.5 px-4 border border-transparent font-semibold rounded-xl text-white bg-gradient-to-r from-primary-600 to-violet-600 hover:from-primary-500 hover:to-violet-500 hover:shadow-lg hover:shadow-primary-500/20 hover:-translate-y-px focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-slate-800 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 active:scale-[0.98] active:shadow-none transition-all duration-250"
              >
                <span className="relative flex items-center gap-2">
                    {loading ? <LoadingSpinner /> : null}
                    {loading ? (t('auth.logging_in')) : showResetPassword ? (language === 'de' ? 'Link senden' : 'Send Link') : (
                        <>
                            <span>{t('auth.login_btn')}</span>
                            <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-250 ease-out" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                        </>
                    )}
                </span>
              </button>
            </form>
              </div>
          </div>

           <div className="mt-8 text-center text-sm">
              <p className="text-slate-600 dark:text-slate-400">
                {t('auth.no_account')}{' '}
                <button onClick={() => setCurrentPage('register')} className="font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors duration-200 focus:outline-none hover:underline">
                  {t('auth.register_now')}
                </button>
              </p>
          </div>
       </div>
    </div>
  );
};

export default LoginPage;

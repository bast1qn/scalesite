
import React, { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { UserCircleIcon, CheckBadgeIcon } from '../components/Icons';
import { useLanguage } from '../contexts/LanguageContext';
import { validatePassword, getPasswordStrength } from '../lib/validation';

interface RegisterPageProps {
    setCurrentPage: (page: string) => void;
}

const PasswordRequirement: React.FC<{ met: boolean; text: string }> = ({ met, text }) => (
    <div className={`flex items-center gap-2 text-xs ${met ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'}`}>
        <span className={`w-4 h-4 rounded-full flex items-center justify-center ${met ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-slate-100 dark:bg-slate-800'}`}>
            {met ? '✓' : '○'}
        </span>
        {text}
    </div>
);

const RegisterPage: React.FC<RegisterPageProps> = ({ setCurrentPage }) => {
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useContext(AuthContext);
  const { t } = useLanguage();

  const passwordValidation = validatePassword(password);
  const passwordStrength = getPasswordStrength(password);
  const hasMinLength = password.length >= 8;
  const hasLowercase = /[a-z]/.test(password);
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!name || !company || !email || !password) {
      setError(t('general.error'));
      return;
    }
    if (!passwordValidation.isValid) {
      setError(t('auth.password_requirements'));
      return;
    }
    setLoading(true);
    const result = await register(name, company, email, password);
    if (result.error) {
      setError(result.error);
    } else if (result.success) {
      if (result.requiresConfirmation) {
        setSuccess(t('auth.success_reg_desc'));
      } else {
        setCurrentPage('dashboard');
      }
    }
    setLoading(false);
  };

  const getStrengthColor = (strength: string) => {
    switch (strength) {
      case 'weak': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'strong': return 'bg-emerald-500';
      default: return 'bg-slate-200';
    }
  };

  const getStrengthTextColor = (strength: string) => {
    switch (strength) {
      case 'weak': return 'text-red-600 dark:text-red-400';
      case 'medium': return 'text-yellow-600 dark:text-yellow-400';
      case 'strong': return 'text-emerald-600 dark:text-emerald-400';
      default: return 'text-slate-400';
    }
  };

  if (success) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 py-12 relative overflow-hidden">
            {/* Animated background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[20%] left-[10%] w-[500px] h-[500px] bg-gradient-to-br from-emerald-400/8 to-teal-400/6 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-[20%] right-[10%] w-[400px] h-[400px] bg-gradient-to-br from-blue-400/6 to-violet-400/4 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '3s' }}></div>
            </div>

            <div className="relative z-10 max-w-md w-full text-center p-10 bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-700">
                <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckBadgeIcon className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h2 className="font-serif text-2xl font-bold text-slate-900 dark:text-white">
                    {t('auth.success_reg_title')}
                </h2>
                <p className="mt-3 text-slate-600 dark:text-slate-400">
                    {success}
                </p>
                <button onClick={() => setCurrentPage('login')} className="mt-8 w-full bg-gradient-to-r from-blue-600 to-violet-600 text-white font-bold py-4 rounded-xl hover:shadow-lg hover:shadow-blue-500/25 hover:-translate-y-0.5 transition-all">
                    {t('auth.to_login')}
                </button>
            </div>
        </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 py-12 relative overflow-hidden">
       {/* Animated background */}
       <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-[20%] left-[10%] w-[600px] h-[600px] bg-gradient-to-br from-blue-400/8 to-violet-400/6 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-[20%] right-[10%] w-[500px] h-[500px] bg-gradient-to-br from-emerald-400/6 to-teal-400/4 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '3s' }}></div>
       </div>

       <div className="relative z-10 max-w-md w-full">
          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-black/50 border border-slate-200 dark:border-slate-700 p-8 sm:p-10">
            <div className="text-center mb-8">
                <h2 className="font-serif text-3xl font-bold text-slate-900 dark:text-white">
                    {t('auth.register_title')}
                </h2>
                <p className="mt-2 text-slate-600 dark:text-slate-400">
                    {t('auth.register_subtitle')}
                </p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
               <div>
                  <label htmlFor="name" className="block text-sm font-bold text-slate-900 dark:text-white mb-2">{t('auth.name')}</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    className="w-full bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white rounded-xl px-4 py-3.5 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                    placeholder={t('placeholders.name_example')}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
               </div>
                <div>
                  <label htmlFor="company" className="block text-sm font-bold text-slate-900 dark:text-white mb-2">{t('auth.company')}</label>
                  <input
                    id="company"
                    name="company"
                    type="text"
                    required
                    className="w-full bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white rounded-xl px-4 py-3.5 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                    placeholder={t('placeholders.company_example')}
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                  />
               </div>
                <div>
                  <label htmlFor="email-address" className="block text-sm font-bold text-slate-900 dark:text-white mb-2">{t('auth.email')}</label>
                  <input
                    id="email-address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="w-full bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white rounded-xl px-4 py-3.5 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                    placeholder={t('placeholders.email_example_alt')}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
               </div>
               <div>
                  <label htmlFor="password" className="block text-sm font-bold text-slate-900 dark:text-white mb-2">{t('auth.password')}</label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    className="w-full bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white rounded-xl px-4 py-3.5 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                    placeholder={t('auth.password_placeholder')}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  {password && (
                      <div className="mt-3 space-y-2">
                          <div className="flex items-center justify-between">
                              <span className="text-xs text-slate-500 dark:text-slate-400">
                                  {t('auth.password_requirements')}
                              </span>
                              <span className={`text-xs font-semibold ${getStrengthTextColor(passwordStrength)}`}>
                                  {t(`auth.password_${passwordStrength}`)}
                              </span>
                          </div>
                          <div className="flex gap-1 h-1">
                              <div className={`flex-1 rounded-full transition-colors ${passwordStrength === 'weak' ? getStrengthColor('weak') : 'bg-slate-200 dark:bg-slate-700'}`}></div>
                              <div className={`flex-1 rounded-full transition-colors ${passwordStrength === 'medium' || passwordStrength === 'strong' ? getStrengthColor('medium') : 'bg-slate-200 dark:bg-slate-700'}`}></div>
                              <div className={`flex-1 rounded-full transition-colors ${passwordStrength === 'strong' ? getStrengthColor('strong') : 'bg-slate-200 dark:bg-slate-700'}`}></div>
                          </div>
                          <div className="grid grid-cols-2 gap-2 mt-2">
                              <PasswordRequirement met={hasMinLength} text={t('auth.password_min_length')} />
                              <PasswordRequirement met={hasLowercase} text={t('auth.password_lowercase')} />
                              <PasswordRequirement met={hasUppercase} text={t('auth.password_uppercase')} />
                              <PasswordRequirement met={hasNumber} text={t('auth.password_number')} />
                          </div>
                      </div>
                  )}
               </div>

              {error && (
                  <p className="text-sm text-red-600 dark:text-red-400 text-center bg-red-50 dark:bg-red-900/20 rounded-xl p-3 border border-red-200 dark:border-red-800/30">
                      {error}
                  </p>
              )}

              <div className="pt-2">
                <button
                    type="submit"
                    disabled={loading}
                    className="group relative w-full flex justify-center items-center py-4 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 hover:shadow-lg hover:shadow-blue-500/25 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-slate-800 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
                >
                  {loading ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {t('auth.registering')}
                      </span>
                  ) : (
                      <>
                        <UserCircleIcon className="w-5 h-5 mr-2 opacity-70" />
                        {t('auth.register_btn')}
                      </>
                  )}
                </button>
              </div>
            </form>

            <div className="mt-8 text-sm text-center space-y-4">
              <p className="text-slate-600 dark:text-slate-400">
                {t('auth.has_account')}{' '}
                <button onClick={() => setCurrentPage('login')} className="font-bold text-blue-600 dark:text-blue-400 hover:underline">
                  {t('auth.login_now')}
                </button>
              </p>
              <button onClick={() => setCurrentPage('home')} className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                {t('auth.back_home')}
              </button>
            </div>
          </div>
       </div>
    </div>
  );
};

export default RegisterPage;

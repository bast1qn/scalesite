
import React, { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { UserCircleIcon, CheckBadgeIcon } from '../components/Icons';
import { useLanguage } from '../contexts/LanguageContext';

interface RegisterPageProps {
    setCurrentPage: (page: string) => void;
}

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!name || !company || !email || !password) {
      setError(t('general.error'));
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
  
  if (success) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-light-bg dark:bg-dark-bg px-4 py-12">
            <div className="max-w-md w-full text-center p-10 bg-surface dark:bg-dark-surface rounded-2xl shadow-lg">
                <CheckBadgeIcon className="w-16 h-16 text-green-500 mx-auto" />
                <h2 className="mt-4 text-2xl font-bold text-dark-text dark:text-light-text">
                    {t('auth.success_reg_title')}
                </h2>
                <p className="mt-2 text-dark-text/80 dark:text-light-text/80">
                    {success}
                </p>
                <button onClick={() => setCurrentPage('login')} className="mt-6 w-full bg-primary text-white font-semibold py-2 px-4 rounded-md hover:bg-primary/90 transition-colors">
                    {t('auth.to_login')}
                </button>
            </div>
        </div>
    );
  }
  
  const inputClasses = "block w-full px-4 py-3 text-sm rounded-md shadow-sm bg-light-bg dark:bg-dark-bg border border-dark-text/20 dark:border-light-text/20 placeholder-dark-text/60 dark:placeholder-light-text/60 focus:outline-none focus:ring-2 focus:ring-blue-500";


  return (
    <div className="min-h-screen flex items-center justify-center bg-light-bg dark:bg-dark-bg px-4 py-12">
      <div className="max-w-md w-full space-y-8 p-10 bg-surface dark:bg-dark-surface rounded-2xl shadow-lg">
        <div>
          <h2 className="text-center text-3xl font-bold text-dark-text dark:text-light-text">
            {t('auth.register_title')}
          </h2>
          <p className="mt-2 text-center text-sm text-dark-text/80 dark:text-light-text/80">
            {t('auth.register_subtitle')}
          </p>
        </div>
        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
           <div>
              <label htmlFor="name" className="block text-sm font-medium text-dark-text/90 dark:text-light-text/90 mb-1">{t('auth.name')}</label>
              <input id="name" name="name" type="text" required className={inputClasses} placeholder={t('placeholders.name_example')} value={name} onChange={(e) => setName(e.target.value)} />
            </div>
             <div>
              <label htmlFor="company" className="block text-sm font-medium text-dark-text/90 dark:text-light-text/90 mb-1">{t('auth.company')}</label>
              <input id="company" name="company" type="text" required className={inputClasses} placeholder={t('placeholders.company_example')} value={company} onChange={(e) => setCompany(e.target.value)} />
            </div>
            <div>
              <label htmlFor="email-address" className="block text-sm font-medium text-dark-text/90 dark:text-light-text/90 mb-1">{t('auth.email')}</label>
              <input id="email-address" name="email" type="email" autoComplete="email" required className={inputClasses} placeholder={t('placeholders.email_example_alt')} value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-dark-text/90 dark:text-light-text/90 mb-1">{t('auth.password')}</label>
              <input id="password" name="password" type="password" autoComplete="new-password" required className={inputClasses} placeholder={t('auth.password_placeholder')} value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
          
          {error && <p className="text-sm text-primary text-center pt-2">{error}</p>}

          <div className="pt-2">
            <button type="submit" disabled={loading} className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:bg-primary/60 dark:focus:ring-offset-dark-surface">
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <UserCircleIcon className="h-5 w-5 text-primary/50 group-hover:text-primary/40" />
              </span>
              {loading ? t('auth.registering') : t('auth.register_btn')}
            </button>
          </div>
        </form>
        <div className="text-sm text-center">
          <p className="text-dark-text/80 dark:text-light-text/80">
            {t('auth.has_account')}{' '}
            <button onClick={() => setCurrentPage('login')} className="font-medium text-primary hover:text-primary/90">
              {t('auth.login_now')}
            </button>
          </p>
          <p className="mt-4">
            <button onClick={() => setCurrentPage('home')} className="font-medium text-dark-text/60 hover:text-dark-text/80 dark:hover:text-light-text/80">
              {t('auth.back_home')}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
import { SignIn } from '@clerk/clerk-react';
import { useLanguage } from '../contexts';
import { ScaleSiteLogo } from '../components';

interface LoginPageProps {
    setCurrentPage: (page: string) => void;
}

const LoginPage = ({ setCurrentPage }: LoginPageProps) => {
    const { t } = useLanguage();

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-primary-50/20 dark:from-[#030305] dark:via-slate-950 dark:to-violet-950/10 py-12 px-4 sm:px-6 lg:px-8">
            {/* Background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[8%] left-[-10%] sm:left-[-5%] w-[300px] sm:w-[500px] md:w-[600px] lg:w-[700px] h-[300px] sm:h-[500px] md:h-[600px] lg:h-[700px] bg-gradient-to-br from-primary-500/12 to-violet-500/8 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-[5%] right-[-10%] sm:right-[-5%] w-[250px] sm:w-[400px] md:w-[500px] lg:w-[600px] h-[250px] sm:h-[400px] md:h-[500px] lg:h-[600px] bg-gradient-to-br from-violet-500/10 to-primary-500/6 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '3s' }}></div>
            </div>

            <div className="relative z-10 w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <button
                        onClick={() => setCurrentPage('home')}
                        className="inline-flex items-center justify-center"
                    >
                        <ScaleSiteLogo className="h-12 mx-auto" />
                    </button>
                </div>

                {/* Sign In Component */}
                <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-200/60 dark:border-slate-700/60 p-8">
                    <SignIn
                        afterSignInUrl="/"
                        signUpUrl="/register"
                        redirectUrl="/"
                    />
                </div>

                {/* Footer Text */}
                <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
                    {t('general.welcomeBack')} {' '}
                    <button
                        onClick={() => setCurrentPage('home')}
                        className="font-medium text-primary-600 dark:text-violet-400 hover:text-primary-700 dark:hover:text-violet-300 transition-colors"
                    >
                        {t('nav.home')}
                    </button>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;

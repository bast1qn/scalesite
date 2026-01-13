
import { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface CountdownTimerProps {
  targetDate: Date;
  onComplete: () => void;
}

const calculateTimeLeft = (targetDate: Date) => {
  const difference = +targetDate - +new Date();
  let timeLeft = {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
  };

  if (difference > 0) {
    timeLeft = {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }
  return timeLeft;
};

export const CountdownTimer = ({ targetDate, onComplete }: CountdownTimerProps) => {
  // Lazy initialization - calculateTimeLeft is only called once during initial render
  const [timeLeft, setTimeLeft] = useState(() => calculateTimeLeft(targetDate));
  const { t } = useLanguage();

  useEffect(() => {
    const timer = setTimeout(() => {
      const newTimeLeft = calculateTimeLeft(targetDate);
      setTimeLeft(newTimeLeft);

      if (newTimeLeft.days === 0 && newTimeLeft.hours === 0 && newTimeLeft.minutes === 0 && newTimeLeft.seconds === 0) {
          onComplete();
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [targetDate, onComplete]);

  const timerComponents = [
      {label: t('general.days'), value: timeLeft.days},
      {label: t('general.hours'), value: timeLeft.hours},
      {label: t('general.minutes'), value: timeLeft.minutes},
      {label: t('general.seconds'), value: timeLeft.seconds},
  ];

  return (
    <div className="flex items-center gap-3 sm:gap-4 text-dark-text dark:text-light-text">
      {timerComponents.map((c, i) => (
        <div key={c.label} className="flex items-center gap-2">
            <div className="flex flex-col items-center group">
                <span className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-br from-primary-600 to-violet-600 bg-clip-text text-transparent transition-all duration-300 group-hover:scale-105 block px-3 py-2">
                  {String(c.value).padStart(2, '0')}
                </span>
                <span className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-medium mt-1 transition-colors duration-300 group-hover:text-primary-600 dark:group-hover:text-violet-400">
                  {c.label}
                </span>
            </div>
            {i < timerComponents.length - 1 && (
              <span className="text-2xl sm:text-3xl lg:text-4xl font-light text-slate-300 dark:text-slate-700 mb-5 px-1">:</span>
            )}
        </div>
      ))}
    </div>
  );
};

import React, { useState, useEffect } from 'react';
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

export const CountdownTimer: React.FC<CountdownTimerProps> = ({ targetDate, onComplete }) => {
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
    <div className="flex items-center gap-2 sm:gap-3 text-dark-text dark:text-light-text">
      {timerComponents.map((c, i) => (
        <div key={c.label} className="flex items-center gap-1">
            <div className="flex flex-col items-center">
                <span className="text-xl sm:text-2xl font-bold bg-surface dark:bg-dark-surface px-2 py-1 rounded-md shadow-sm">{String(c.value).padStart(2, '0')}</span>
                <span className="text-[10px] uppercase tracking-wide opacity-70">{c.label}</span>
            </div>
            {i < timerComponents.length - 1 && <span className="text-xl sm:text-2xl font-bold mb-4">:</span>}
        </div>
      ))}
    </div>
  );
};
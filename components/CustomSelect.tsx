import { useState } from 'react';
import { useClickOutsideCallback } from '../lib/hooks';

interface Option {
  value: string;
  label: string;
}

interface CustomSelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  id: string;
}

export const CustomSelect = ({ options, value, onChange, id }: CustomSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useClickOutsideCallback(() => setIsOpen(false), isOpen);
  const selectedOption = options.find(opt => opt.value === value);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div ref={wrapperRef} className="relative">
      <button
        id={id}
        type="button"
        className="relative w-full pl-3 pr-10 py-2 text-left border border-dark-text/20 dark:border-light-text/20 bg-surface dark:bg-dark-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary rounded-md cursor-default"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="block truncate">{selectedOption?.label}</span>
        <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
            <svg className="h-5 w-5 text-dark-text/70 dark:text-light-text/70" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 8l4 4 4-4"/>
            </svg>
        </span>
      </button>

      {isOpen && (
        <ul
          className="absolute z-10 mt-1 w-full bg-surface dark:bg-dark-surface shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm"
          tabIndex={-1}
          role="listbox"
          aria-labelledby={id}
        >
          {options.map((option) => (
            <li
              key={option.value}
              className={`cursor-pointer select-none relative py-2 pl-3 pr-9 transition-colors ${
                value === option.value
                  ? 'text-white bg-primary'
                  : 'text-dark-text dark:text-light-text hover:bg-light-bg dark:hover:bg-dark-bg/70'
              }`}
              onClick={() => handleSelect(option.value)}
              role="option"
              aria-selected={value === option.value}
            >
              <span className={`block truncate ${value === option.value ? 'font-semibold' : 'font-normal'}`}>
                {option.label}
              </span>
              {value === option.value && (
                <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-white">
                   <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

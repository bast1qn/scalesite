// ========================================================================
// PREMIUM UI COMPONENTS
// ========================================================================
// Reference: Linear, Vercel, Stripe design systems
// Philosophy: Pixel-perfect, GPU-accelerated, accessible
// Features: Consistent interactions, refined animations, dark mode support
// ========================================================================

import { ReactNode, useState, useRef, useEffect, type MouseEvent, type FocusEvent } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

// ========================================================================
// MAGNETIC BUTTON
// ========================================================================
// Button that subtly follows mouse cursor (magnetic effect)
// Satisfying micro-interaction for primary CTAs

interface MagneticButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
}

export const MagneticButton = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
}: MagneticButtonProps) => {
  const ref = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  // Magnetic effect strength
  const strength = 0.3;

  const handleMouseMove = (e: MouseEvent<HTMLButtonElement>) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const x = (e.clientX - centerX) * strength;
    const y = (e.clientY - centerY) * strength;

    setPosition({ x, y });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
    setIsHovered(false);
  };

  const sizes = {
    sm: 'px-5 py-2.5 text-sm',
    md: 'px-8 py-4 text-base',
    lg: 'px-10 py-5 text-lg',
  };

  const variants = {
    primary: 'bg-gradient-to-r from-primary-600 to-secondary-500 text-white shadow-premium hover:shadow-glow',
    secondary: 'border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-primary-400 hover:bg-slate-50 dark:hover:bg-slate-800',
    ghost: 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200',
  };

  return (
    <motion.button
      ref={ref}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      disabled={disabled}
      className={`relative inline-flex items-center justify-center font-semibold rounded-2xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500/70 ${variants[variant]} ${sizes[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.02] active:scale-[0.98] cursor-pointer'} ${className}`}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: 'spring', stiffness: 150, damping: 15 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
};

// ========================================================================
// SPOTLIGHT CARD
// ========================================================================
// Card with mouse-following spotlight effect
// Premium depth effect for featured content

interface SpotlightCardProps {
  children: ReactNode;
  className?: string;
  spotlightColor?: string;
}

export const SpotlightCard = ({
  children,
  className = '',
  spotlightColor = 'rgba(75, 90, 237, 0.08)',
}: SpotlightCardProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const mouse = useMotionValue({ x: 0.5, y: 0.5 });

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    mouse.set({
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    });
  };

  const maskImage = useTransform(
    mouse,
    ({ x, y }) => `radial-gradient(400px circle at ${x * 100}% ${y * 100}%, ${spotlightColor}, transparent 50%)`
  );

  return (
    <motion.div
      ref={ref}
      className={`relative overflow-hidden bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/60 dark:border-slate-700/60 shadow-premium hover:shadow-card-hover transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] ${className}`}
      onMouseMove={handleMouseMove}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Spotlight effect */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ maskImage }}
      />
      {/* Content */}
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
};

// ========================================================================
// GLASS MORPHISM CARD
// ========================================================================
// Frosted glass effect card
// Premium backdrop blur with subtle border

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  blur?: 'sm' | 'md' | 'lg';
}

export const GlassCard = ({
  children,
  className = '',
  blur = 'md',
}: GlassCardProps) => {
  const blurs = {
    sm: 'backdrop-blur-sm',
    md: 'backdrop-blur-md',
    lg: 'backdrop-blur-lg',
  };

  return (
    <motion.div
      className={`relative bg-white/70 dark:bg-slate-900/70 ${blurs[blur]} border border-white/50 dark:border-slate-700/50 rounded-3xl shadow-premium hover:shadow-premium-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] ${className}`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {children}
    </motion.div>
  );
};

// ========================================================================
// ANIMATED UNDERLINE LINK
// ========================================================================
// Link with animated underline on hover
// Smooth gradient animation

interface AnimatedLinkProps {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
  underlineColor?: string;
}

export const AnimatedLink = ({
  children,
  href,
  onClick,
  className = '',
  underlineColor = 'from-primary-600 to-secondary-500',
}: AnimatedLinkProps) => {
  return (
    <motion.a
      href={href}
      onClick={onClick}
      className={`relative inline-flex items-center gap-1 text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200 ${className}`}
      whileHover={{ x: 2 }}
    >
      {children}
      {/* Animated underline */}
      <motion.span
        className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r ${underlineColor} rounded-full`}
        initial={{ width: 0 }}
        whileHover={{ width: '100%' }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      />
    </motion.a>
  );
};

// ========================================================================
// FLOATING LABEL INPUT
// ========================================================================
// Input with floating label animation
// Clean, modern input field

interface FloatingLabelInputProps {
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
}

export const FloatingLabelInput = ({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  disabled = false,
  className = '',
}: FloatingLabelInputProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = value.length > 0;

  return (
    <div className={`relative ${className}`}>
      {/* Input */}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full px-4 py-3 bg-white dark:bg-slate-800 border rounded-xl transition-all duration-200 outline-none ${
          error
            ? 'border-error-300 dark:border-error-700 focus:border-error-500 focus:ring-4 focus:ring-error-500/8'
            : 'border-slate-200 dark:border-slate-700 focus:border-primary-400 focus:ring-4 focus:ring-primary-500/8'
        } ${isFocused ? 'translate-y-[-1px]' : ''} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        style={{ paddingTop: hasValue || isFocused ? '1.25rem' : '0.75rem' }}
      />

      {/* Floating label */}
      <motion.label
        className={`absolute left-4 pointer-events-none transition-colors duration-200 ${
          error ? 'text-error-500' : 'text-slate-400'
        }`}
        initial={{ top: '0.75rem', fontSize: '1rem' }}
        animate={{
          top: hasValue || isFocused ? '0.375rem' : '0.75rem',
          fontSize: hasValue || isFocused ? '0.75rem' : '1rem',
        }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
      >
        {label}
      </motion.label>

      {/* Error message */}
      {error && (
        <motion.p
          className="mt-1.5 text-sm text-error-500"
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {error}
        </motion.p>
      )}
    </div>
  );
};

// ========================================================================
// PREMIUM TOGGLE SWITCH
// ========================================================================
// Smooth toggle switch with icon animation
// Accessible focus states

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  className?: string;
}

export const ToggleSwitch = ({
  checked,
  onChange,
  label,
  disabled = false,
  className = '',
}: ToggleSwitchProps) => {
  return (
    <motion.button
      type="button"
      onClick={() => !disabled && onChange(!checked)}
      disabled={disabled}
      className={`relative inline-flex items-center gap-3 ${className}`}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
    >
      {/* Toggle track */}
      <motion.div
        className={`w-12 h-7 rounded-full transition-colors duration-200 ${
          checked ? 'bg-primary-500' : 'bg-slate-200 dark:bg-slate-700'
        }`}
      >
        {/* Toggle thumb */}
        <motion.div
          className="absolute top-1 w-5 h-5 bg-white rounded-full shadow-md"
          animate={{ left: checked ? '1.625rem' : '0.25rem' }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      </motion.div>

      {/* Label */}
      {label && (
        <span className={`text-sm font-medium ${disabled ? 'text-slate-400' : 'text-slate-700 dark:text-slate-300'}`}>
          {label}
        </span>
      )}
    </motion.button>
  );
};

// ========================================================================
// 3D CARD TILT
// ========================================================================
// Card with 3D perspective tilt effect
// Subtle depth effect on mouse move

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  intensity?: number;
}

export const TiltCard = ({
  children,
  className = '',
  intensity = 10,
}: TiltCardProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState('');

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -intensity;
    const rotateY = ((x - centerX) / centerX) * intensity;

    setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`);
  };

  const handleMouseLeave = () => {
    setTransform('perspective(1000px) rotateX(0deg) rotateY(0deg)');
  };

  return (
    <motion.div
      ref={ref}
      className={`bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/60 dark:border-slate-700/60 shadow-premium hover:shadow-premium-lg transition-transform duration-200 ease-out ${className}`}
      style={{ transform, transformStyle: 'preserve-3d' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div style={{ transform: 'translateZ(20px)' }}>{children}</div>
    </motion.div>
  );
};

// ========================================================================
// RIPPLE BUTTON
// ========================================================================
// Material Design-inspired ripple effect
// Satisfying click feedback

interface RippleButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: 'primary' | 'secondary';
}

export const RippleButton = ({
  children,
  onClick,
  className = '',
  variant = 'primary',
}: RippleButtonProps) => {
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newRipple = {
      id: Date.now(),
      x,
      y,
    };

    setRipples((prev) => [...prev, newRipple]);

    // Remove ripple after animation
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 600);

    onClick?.();
  };

  const variants = {
    primary: 'bg-gradient-to-r from-primary-600 to-secondary-500 text-white',
    secondary: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300',
  };

  return (
    <motion.button
      onClick={handleClick}
      className={`relative overflow-hidden inline-flex items-center justify-center px-8 py-4 font-semibold rounded-2xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500/70 hover:scale-[1.02] active:scale-[0.98] ${variants[variant]} ${className}`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {ripples.map((ripple) => (
        <motion.span
          key={ripple.id}
          className="absolute rounded-full bg-white/30"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: 0,
            height: 0,
            borderRadius: '50%',
          }}
          animate={{
            width: 300,
            height: 300,
            x: -150,
            y: -150,
            opacity: 0,
          }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      ))}
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
};


import React, { useState } from 'react';
import { PaintBrushIcon, CodeBracketIcon, ServerIcon, ShieldCheckIcon, SparklesIcon, ArrowRightIcon, ChatBubbleBottomCenterTextIcon } from './Icons';
import { AnimatedSection } from './AnimatedSection';
import { useLanguage } from '../contexts/LanguageContext';

const iconMap: { [key: string]: React.ReactNode } = {
  'PaintBrushIcon': <PaintBrushIcon />,
  'CodeBracketIcon': <CodeBracketIcon />,
  'ServerIcon': <ServerIcon />,
  'ShieldCheckIcon': <ShieldCheckIcon />,
  'SparklesIcon': <SparklesIcon className="w-6 h-6" />,
};

// 3D Tilt Card with spotlight effect
const TiltCard3D: React.FC<{
  children: React.ReactNode;
  className?: string;
  gradient?: string;
}> = ({ children, className = '', gradient }) => {
  const [transform, setTransform] = useState('');
  const [glowPos, setGlowPos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -2;
    const rotateY = ((x - centerX) / centerX) * 2;

    setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`);
    setGlowPos({ x: (x / rect.width) * 100, y: (y / rect.height) * 100 });
  };

  const handleMouseLeave = () => {
    setTransform('perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)');
    setGlowPos({ x: 50, y: 50 });
    setIsHovered(false);
  };

  const handleMouseEnter = () => setIsHovered(true);

  return (
    <div
      className={`relative transition-transform duration-300 ease-out ${className}`}
      style={{ transform }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
    >
      {/* Spotlight effect that follows cursor */}
      <div
        className="absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-300 pointer-events-none"
        style={{
          background: `radial-gradient(500px circle at ${glowPos.x}% ${glowPos.y}%, ${gradient || 'rgba(59, 130, 246, 0.12)'}, transparent 50%)`,
          opacity: isHovered ? 1 : 0,
        }}
      />
      {children}
    </div>
  );
};

export const ServicesGrid: React.FC = () => {
  const { t } = useLanguage();

  const services = [
    { id: 1, name: t('services.items.webdesign.name'), description: t('services.items.webdesign.desc'), icon_name: "PaintBrushIcon", color: "text-pink-600 dark:text-pink-400", bg: "bg-pink-50 dark:bg-pink-900/20", border: "group-hover:border-pink-300 dark:group-hover:border-pink-600", gradient: "from-pink-500 to-rose-500", hexFrom: "#ec4899", hexTo: "#f43f5e" },
    { id: 2, name: t('services.items.dev.name'), description: t('services.items.dev.desc'), icon_name: "CodeBracketIcon", color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-900/20", border: "group-hover:border-blue-300 dark:group-hover:border-blue-600", gradient: "from-blue-500 to-indigo-500", hexFrom: "#3b82f6", hexTo: "#6366f1" },
    { id: 3, name: t('services.items.ai.name'), description: t('services.items.ai.desc'), icon_name: "SparklesIcon", color: "text-violet-600 dark:text-violet-400", bg: "bg-violet-50 dark:bg-violet-900/20", border: "group-hover:border-violet-300 dark:group-hover:border-violet-600", gradient: "from-violet-500 to-purple-500", hexFrom: "#8b5cf6", hexTo: "#a855f7" },
    { id: 4, name: t('services.items.hosting.name'), description: t('services.items.hosting.desc'), icon_name: "ServerIcon", color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-900/20", border: "group-hover:border-emerald-300 dark:group-hover:border-emerald-600", gradient: "from-emerald-500 to-teal-500", hexFrom: "#10b981", hexTo: "#14b8a6" },
    { id: 5, name: t('services.items.seo.name'), description: t('services.items.seo.desc'), icon_name: "ShieldCheckIcon", color: "text-orange-600 dark:text-orange-400", bg: "bg-orange-50 dark:bg-orange-900/20", border: "group-hover:border-orange-300 dark:group-hover:border-orange-600", gradient: "from-orange-500 to-amber-500", hexFrom: "#f97316", hexTo: "#f59e0b" },
  ];

  return (
    <section className="py-28 bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 relative overflow-hidden">
      {/* Subtle noise texture */}
      <div className="absolute inset-0 opacity-[0.012] dark:opacity-[0.02] pointer-events-none noise-bg"></div>

      {/* Enhanced animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] right-[5%] w-[700px] h-[700px] bg-gradient-to-br from-blue-400/8 via-violet-400/6 to-indigo-400/4 rounded-full blur-3xl animate-morph-blob"></div>
        <div className="absolute bottom-[10%] left-[5%] w-[600px] h-[600px] bg-gradient-to-br from-violet-400/6 via-purple-400/4 to-pink-400/3 rounded-full blur-3xl animate-morph-blob" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Enhanced grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.02] dark:opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      ></div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <AnimatedSection>
          <div className="text-center mb-20">
            {/* Enhanced Badge */}
            <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-gradient-to-r from-blue-50 to-violet-50 dark:from-blue-900/20 dark:to-violet-900/20 border border-blue-200/60 dark:border-blue-800/30 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-default">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
              {t('services.badge')}
            </div>

            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white tracking-tight tracking-tight-plus">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-violet-600 to-indigo-600 animate-gradient-shimmer">
                {t('services.title')}
              </span>
            </h2>
            <p className="mt-6 max-w-2xl mx-auto text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
              {t('services.subtitle')}
            </p>
          </div>
        </AnimatedSection>

        <AnimatedSection stagger>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 stagger-container">
            {services.map((service, index) => (
              <TiltCard3D
                key={service.name}
                gradient={`rgba(${parseInt(service.hexFrom.slice(1, 3), 16)}, ${parseInt(service.hexFrom.slice(3, 5), 16)}, ${parseInt(service.hexFrom.slice(5, 7), 16)}, 0.12)`}
              >
                <div
                  className={`group relative bg-white/90 dark:bg-slate-800/80 backdrop-blur-xl border border-slate-200/60 dark:border-slate-700/60 rounded-3xl p-8 transition-all duration-500 hover:shadow-premium-lg ${service.border} hover:-translate-y-1 overflow-hidden`}
                  style={{ transitionDelay: `${index * 50}ms` }}
                >
                  {/* Shimmer effect */}
                  <div className="absolute inset-0 card-shimmer rounded-3xl"></div>

                  {/* Animated gradient glow effect on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-[0.06] transition-opacity duration-500 rounded-3xl`}></div>

                  {/* Gradient line on top (appears on hover) */}
                  <div className={`absolute top-0 left-6 right-6 h-[2px] bg-gradient-to-r ${service.gradient} opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-full transform scale-x-0 group-hover:scale-x-100 shadow-lg`}></div>

                  <div className="relative z-10 flex flex-col h-full">
                    <div className={`w-16 h-16 ${service.bg} ${service.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg group-hover:shadow-xl`}>
                      <div className="group-hover:animate-icon-bounce">
                        {iconMap[service.icon_name]}
                      </div>
                    </div>

                    <h3
                      className="font-serif text-xl font-bold text-slate-900 dark:text-white mb-3 transition-all duration-300 group-hover:text-transparent group-hover:bg-clip-text"
                      style={{
                        backgroundImage: `linear-gradient(to right, ${service.hexFrom}, ${service.hexTo})`,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                      }}
                    >
                      {service.name}
                    </h3>

                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm flex-grow">
                      {service.description}
                    </p>

                    <div className="mt-6 flex items-center text-sm font-bold opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                      <span style={{ color: service.hexFrom }}>
                        {t('services.more')}
                      </span>
                      <ArrowRightIcon className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" style={{ color: service.hexFrom }} />
                    </div>
                  </div>

                  {/* Decorative corner accent */}
                  <div className={`absolute bottom-0 right-0 w-20 h-20 bg-gradient-to-tl ${service.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-tl-3xl`}></div>
                </div>
              </TiltCard3D>
            ))}

            {/* Enhanced Secondary CTA Card */}
            <TiltCard3D gradient="rgba(59, 130, 246, 0.15)">
              <div className="group relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white border border-slate-700 dark:border-slate-600 rounded-3xl p-8 flex flex-col justify-center items-center text-center hover:-translate-y-1 hover:shadow-2xl hover:shadow-slate-900/40 transition-all duration-500 overflow-hidden">
                {/* Shimmer effect */}
                <div className="absolute inset-0 card-shimmer rounded-3xl"></div>

                {/* Background decoration */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-violet-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                {/* Animated gradient border effect */}
                <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-violet-500 to-indigo-500 rounded-3xl blur-xl animate-gradient-xy"></div>
                </div>

                {/* Floating orbs */}
                <div className="absolute top-4 left-4 w-2 h-2 bg-blue-400/40 rounded-full animate-float" style={{ animationDelay: '0s' }}></div>
                <div className="absolute bottom-4 right-4 w-2 h-2 bg-violet-400/40 rounded-full animate-float" style={{ animationDelay: '1s' }}></div>

                <div className="relative z-10">
                  <div className="w-16 h-16 bg-white/10 backdrop-blur rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:-rotate-12 transition-all duration-500 shadow-xl">
                    <ChatBubbleBottomCenterTextIcon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-serif text-xl font-bold mb-3">{t('services.cta_card.title')}</h3>
                  <p className="text-slate-300 text-sm mb-8 leading-relaxed">{t('services.cta_card.text')}</p>
                  <button className="bg-white text-slate-900 px-8 py-4 rounded-xl font-bold text-sm hover:bg-slate-100 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-white/20 hover:-translate-y-1 w-full btn-press relative overflow-hidden group/btn">
                    <span className="relative z-10">{t('services.cta_card.btn')}</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-violet-500 opacity-0 group-hover/btn:opacity-10 transition-opacity duration-300"></div>
                  </button>
                </div>
              </div>
            </TiltCard3D>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

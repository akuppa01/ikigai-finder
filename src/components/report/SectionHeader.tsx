'use client';

interface SectionHeaderProps {
  emoji: string;
  title: string;
  subtitle: string;
  className?: string;
}

export default function SectionHeader({
  emoji,
  title,
  subtitle,
  className = '',
}: SectionHeaderProps) {
  return (
    <div className={`text-center mb-12 ${className}`}>
      <div className="inline-flex items-center gap-3 bg-gradient-to-r from-sage-500 to-moss-500 text-white px-6 py-3 rounded-full text-lg font-semibold mb-6 shadow-lg">
        <span className="text-2xl">{emoji}</span>
        <span>{title}</span>
      </div>
      <h2 className="text-4xl font-bold text-sage-800 mb-4 font-serif">
        {title}
      </h2>
      <p className="text-xl text-earth-700 leading-relaxed max-w-3xl mx-auto font-sans">
        {subtitle}
      </p>
    </div>
  );
}

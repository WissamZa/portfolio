import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SectionHeaderProps {
  tag: string;
  title: string;
  subtitle?: string;
  isAr?: boolean;
}

export default function SectionHeader({ tag, title, subtitle, isAr }: SectionHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className={cn('mb-4', isAr && 'text-right')}
    >
      <span className="section-tag">{tag}</span>
      <h2 className={cn(
        'text-4xl sm:text-5xl font-bold mt-2 text-text-primary',
        isAr ? 'font-arabic mb-7' : 'font-display'
      )}>
        {title}
        <span className="text-neon-cyan">.</span>
      </h2>
      {subtitle && (
        <p className={cn('mt-3 text-text-muted font-mono text-sm', isAr && 'font-arabic')}>
          {subtitle}
        </p>
      )}
      <div className={cn('mt-4 w-16 h-0.5 bg-linear-to-r from-neon-cyan to-transparent', isAr && 'ml-auto mr-0')} />
    </motion.div>
  );
}

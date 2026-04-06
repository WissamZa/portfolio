'use client';

import { useState, useRef, useEffect } from 'react';
import { Download, Eye, FileText, Loader } from 'lucide-react';
import type { Locale } from '@/lib/database.types';
import { getT } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import { usePortfolioData } from '@/hooks/usePortfolioData';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import ATSResumeTemplate from '@/components/resume/ATSResumeTemplate';

interface ResumePageClientProps {
  locale: Locale;
}

export default function ResumePageClient({ locale }: ResumePageClientProps) {
  const { data, loading } = usePortfolioData();
  const t = getT(locale);
  const isAr = locale === 'ar';
  const [resumeLocale, setResumeLocale] = useState<Locale>(locale);
  const [printing, setPrinting] = useState(false);
  const resumeRef = useRef<HTMLDivElement>(null);

  // We add styling to specifically handle printing layout via JS since we're initiating it
  useEffect(() => {
    // Add generic print styles to body just in case
    const style = document.createElement('style');
    style.innerHTML = `
      @media print {
        @page {
          margin: 20mm;
          size: A4 portrait;
        }
        body {
          margin: 0;
          background: white !important;
          color: black !important;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        main {
          margin: 0 !important;
          padding: 0 !important;
        }
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const handleDownload = () => {
    window.print();
  };

  return (
    <>
      <div className="print:hidden">
        <Navbar locale={locale} />
      </div>
      <main className="relative z-10 min-h-screen pt-20 pb-12 print:pt-0 print:pb-0 print:min-h-0">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 print:px-0 print:max-w-none print:w-full print:m-0">
          {/* Controls */}
          <div className={cn(
            'flex flex-wrap items-center justify-between gap-4 mb-8 print:hidden',
            isAr && 'flex-row-reverse'
          )}>
            <div>
              <h1 className={cn('text-3xl font-bold text-text-primary', isAr && 'font-arabic text-right')}>
                {t.resume.title}<span className="text-neon-cyan">.</span>
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-2 h-2 bg-neon-green rounded-full animate-pulse-slow" />
                <span className="font-mono text-xs text-neon-green">{t.resume.atsOptimized}</span>
              </div>
            </div>

            <div className={cn('flex items-center gap-3 flex-wrap', isAr && 'flex-row-reverse')}>
              {/* Language toggle for resume */}
              <div className="flex border border-glass-border overflow-hidden">
                {(['en', 'ar'] as Locale[]).map((l) => (
                  <button
                    key={l}
                    onClick={() => setResumeLocale(l)}
                    className={cn(
                      'px-4 py-2 font-mono text-xs transition-colors',
                      resumeLocale === l
                        ? 'bg-neon-cyan/10 text-neon-cyan border-neon-cyan/30'
                        : 'text-text-muted hover:text-neon-cyan'
                    )}
                  >
                    {l === 'en' ? 'English' : 'عربي'}
                  </button>
                ))}
              </div>

              <button
                onClick={handleDownload}
                disabled={printing || loading}
                className="btn-neon-filled px-5 py-2 font-mono text-sm flex items-center gap-2"
              >
                {printing ? <Loader size={16} className="animate-spin" /> : <Download size={16} />}
                {t.resume.download}
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-96 print:hidden">
              <div className="spinner" />
            </div>
          ) : (
            <div className="shadow-2xl border border-glass-border print:shadow-none print:border-none print:m-0 bg-white">
              <div ref={resumeRef} className="print:w-full print:m-0 print:p-0">
                <ATSResumeTemplate
                  data={data!}
                  locale={resumeLocale}
                />
              </div>
            </div>
          )}
        </div>
      </main>
      <div className="print:hidden">
        <Footer locale={locale} />
      </div>
    </>
  );
}


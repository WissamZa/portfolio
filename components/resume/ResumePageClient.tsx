'use client';

import { useState, useRef } from 'react';
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

  const handleDownload = async () => {
    setPrinting(true);
    try {
      // Dynamic import to avoid SSR issues
      const { default: jsPDF } = await import('jspdf');
      const { default: html2canvas } = await import('html2canvas');

      if (!resumeRef.current) return;

      const canvas = await html2canvas(resumeRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
        onclone: (clonedDoc) => {
          // Ensure cloned element is visible and properly sized
          const resume = clonedDoc.querySelector('[data-resume-template]') as HTMLElement;
          if (resume) {
            resume.style.margin = '0';
            resume.style.padding = '40px';
          }
        }
      });

      const imgData = canvas.toDataURL('image/png', 1.0);
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;
      
      let heightLeft = imgHeight;
      let position = 0;

      // Add first page
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
      heightLeft -= pdfHeight;

      // Add subsequent pages if content overflows A4 height
      while (heightLeft > 0) {
        position -= pdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
        heightLeft -= pdfHeight;
      }

      pdf.save(`resume-${resumeLocale}.pdf`);
    } finally {
      setPrinting(false);
    }
  };

  return (
    <>
      <Navbar locale={locale} />
      <main className="relative z-10 min-h-screen pt-20 pb-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Controls */}
          <div className={cn(
            'flex flex-wrap items-center justify-between gap-4 mb-8',
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
            <div className="flex items-center justify-center h-96">
              <div className="spinner" />
            </div>
          ) : (
            <div className="shadow-2xl border border-glass-border">
              <div ref={resumeRef}>
                <ATSResumeTemplate
                  data={data!}
                  locale={resumeLocale}
                />
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer locale={locale} />
    </>
  );
}

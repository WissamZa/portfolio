import type { Locale } from '@/lib/database.types';
import ResumePageClient from '@/components/resume/ResumePageClient';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function ResumePage({ params }: PageProps) {
  const locale = (await params).locale as Locale;
  return <ResumePageClient locale={locale} />;
}

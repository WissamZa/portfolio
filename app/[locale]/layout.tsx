import type { Metadata } from 'next';
import type { Locale } from '@/lib/database.types';
import DirectionProvider from '@/components/ui/DirectionProvider';

interface Props {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'ar' }];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = (await params).locale as Locale;
  return {
    title: locale === 'ar' ? 'ملف أعمال | مهندس برمجيات' : 'Portfolio | CS Engineer',
    description:
      locale === 'ar'
        ? 'مهندس برمجيات متكامل - متخصص في علوم الحاسب'
        : 'Full-Stack Software Engineer - Computer Science specialist',
  };
}


export default async function LocaleLayout({ children, params }: Props) {
  const locale = (await params).locale as Locale;
  const isRTL = locale === 'ar';
  const dir = isRTL ? 'rtl' : 'ltr';
  return (
    <>
      <DirectionProvider locale={locale} dir={dir} />
      <div dir={dir} lang={locale} className="contents">
        {children}
      </div>
    </>
  );
}

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin — Portfolio CMS',
  robots: 'noindex, nofollow',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-void text-text-primary min-h-screen">
      {children}
    </div>
  );
}

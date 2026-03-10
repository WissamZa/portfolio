import HeroCanvas from '@/components/3d/HeroCanvas';
import type { Locale } from '@/lib/database.types';
import { supabaseAdmin } from '@/lib/supabase';
import { getCached, CACHE_KEYS } from '@/lib/cache';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import HeroSection from '@/components/sections/HeroSection';
import ProjectsSection from '@/components/sections/ProjectsSection';
import SkillsSection from '@/components/sections/SkillsSection';
import ExperienceSection from '@/components/sections/ExperienceSection';
import EducationSection from '@/components/sections/EducationSection';
import ContactSection from '@/components/sections/ContactSection';
import AboutSection from '@/components/sections/AboutSection';
import AdminQuickAccess from '@/components/ui/AdminQuickAccess';


export const revalidate = 300;

async function getPortfolioData() {
  const cached = getCached<ReturnType<typeof fetchAll>>(CACHE_KEYS.PROFILE + ':all');
  if (cached) return cached;
  return fetchAll();
}

async function fetchAll() {
  const [
    { data: profile },
    { data: projects },
    { data: skills },
    { data: experience },
    { data: education },
    { data: certifications },
  ] = await Promise.all([
    supabaseAdmin.from('profiles').select('*').single(),
    supabaseAdmin.from('projects').select('*').order('order_index').order('created_at', { ascending: false }),
    supabaseAdmin.from('skills').select('*').order('category').order('order_index'),
    supabaseAdmin.from('experience').select('*').order('order_index').order('start_date', { ascending: false }),
    supabaseAdmin.from('education').select('*').order('order_index').order('start_date', { ascending: false }),
    supabaseAdmin.from('certifications').select('*').order('order_index'),
  ]);

  return {
    profile: profile || null,
    projects: projects || [],
    skills: skills || [],
    experience: experience || [],
    education: education || [],
    certifications: certifications || [],
  };
}

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function PortfolioPage({ params }: PageProps) {
  const locale = (await params).locale as Locale;
  const data = await getPortfolioData();

  return (
    <>
      <HeroCanvas />
      <Navbar locale={locale} />
      <main className="relative z-10">
        <HeroSection profile={data.profile} locale={locale} />
        <AboutSection profile={data.profile} locale={locale} />
        <ProjectsSection projects={data.projects} locale={locale} />
        <SkillsSection skills={data.skills} locale={locale} />
        <ExperienceSection experience={data.experience} locale={locale} />
        <EducationSection education={data.education} locale={locale} />
        <ContactSection profile={data.profile} locale={locale} />
      </main>
      <Footer locale={locale} />
      <AdminQuickAccess locale={locale} />
    </>
  );
}

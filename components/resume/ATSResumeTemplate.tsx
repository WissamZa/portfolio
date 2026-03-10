import type { Locale } from '@/lib/database.types';
import type { PortfolioData } from '@/hooks/usePortfolioData';
import { getT } from '@/lib/i18n';
import { formatDate } from '@/lib/utils';

interface ATSResumeProps {
  data: PortfolioData;
  locale: Locale;
}

// ATS-friendly: white bg, clean layout, no complex CSS, semantic HTML
export default function ATSResumeTemplate({ data, locale }: ATSResumeProps) {
  const { profile, projects, skills, experience, education, certifications } = data;
  const t = getT(locale);
  const isAr = locale === 'ar';

  const skillsByCategory = skills.reduce((acc, s) => {
    if (!acc[s.category]) acc[s.category] = [];
    acc[s.category].push(isAr ? s.name_ar : s.name_en);
    return acc;
  }, {} as Record<string, string[]>);

  return (
    <div
      dir={isAr ? 'rtl' : 'ltr'}
      style={{
        fontFamily: isAr ? '"Cairo", "Arial", sans-serif' : '"Arial", "Helvetica", sans-serif',
        fontSize: '11pt',
        lineHeight: '1.5',
        color: '#1a1a1a',
        backgroundColor: '#ffffff',
        padding: '40px 48px',
        maxWidth: '794px',
        margin: '0 auto',
      }}
    >
      {/* Header */}
      <header style={{ borderBottom: '2px solid #1a1a1a', paddingBottom: '16px', marginBottom: '20px' }}>
        <h1 style={{ fontSize: '24pt', fontWeight: 'bold', margin: '0 0 4px 0', letterSpacing: '-0.5px' }}>
          {isAr ? profile?.name_ar : profile?.name_en}
        </h1>
        <p style={{ fontSize: '12pt', color: '#444', margin: '0 0 8px 0', fontWeight: '500' }}>
          {isAr ? profile?.title_ar : profile?.title_en}
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', fontSize: '9pt', color: '#555' }}>
          {profile?.email && <span>{profile.email}</span>}
          {profile?.phone && <span>{profile.phone}</span>}
          {(isAr ? profile?.location_ar : profile?.location_en) && (
            <span>{isAr ? profile?.location_ar : profile?.location_en}</span>
          )}
          {profile?.github_url && <span>{profile.github_url}</span>}
          {profile?.linkedin_url && <span>{profile.linkedin_url}</span>}
        </div>
      </header>

      {/* Summary */}
      {(profile?.bio_en || profile?.bio_ar) && (
        <section style={{ marginBottom: '20px' }}>
          <SectionTitle title={isAr ? 'الملخص المهني' : 'PROFESSIONAL SUMMARY'} />
          <p style={{ fontSize: '10pt', color: '#333', lineHeight: '1.6' }}>
            {isAr ? profile?.bio_ar : profile?.bio_en}
          </p>
        </section>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <section style={{ marginBottom: '20px' }}>
          <SectionTitle title={isAr ? 'المهارات التقنية' : 'TECHNICAL SKILLS'} />
          {Object.entries(skillsByCategory).map(([cat, skillNames]) => (
            <div key={cat} style={{ display: 'flex', gap: '8px', marginBottom: '4px', fontSize: '10pt' }}>
              <strong style={{ minWidth: isAr ? '140px' : '130px', color: '#1a1a1a' }}>
                {t.skills.categories[cat as keyof typeof t.skills.categories] || cat}:
              </strong>
              <span style={{ color: '#333' }}>{skillNames.join(' • ')}</span>
            </div>
          ))}
        </section>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <section style={{ marginBottom: '20px' }}>
          <SectionTitle title={isAr ? 'الخبرات المهنية' : 'PROFESSIONAL EXPERIENCE'} />
          {experience.map((exp) => (
            <div key={exp.id} style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <strong style={{ fontSize: '11pt' }}>
                    {isAr ? exp.role_ar : exp.role_en}
                  </strong>
                  <span style={{ color: '#555', fontSize: '10pt' }}>
                    {' — '}{isAr ? exp.company_ar : exp.company_en}
                  </span>
                </div>
                <span style={{ fontSize: '9pt', color: '#666', whiteSpace: 'nowrap', marginLeft: '8px' }}>
                  {formatDate(exp.start_date, locale)} – {exp.is_current ? t.experience.present : formatDate(exp.end_date, locale)}
                </span>
              </div>
              {(isAr ? exp.responsibilities_ar : exp.responsibilities_en)?.map((r, i) => (
                <div key={i} style={{ display: 'flex', gap: '8px', marginTop: '4px', fontSize: '10pt', color: '#333' }}>
                  <span style={{ flexShrink: 0 }}>•</span>
                  <span>{r}</span>
                </div>
              ))}
            </div>
          ))}
        </section>
      )}

      {/* Projects */}
      {projects.filter(p => p.featured).length > 0 && (
        <section style={{ marginBottom: '20px' }}>
          <SectionTitle title={isAr ? 'المشاريع المميزة' : 'KEY PROJECTS'} />
          {projects.filter(p => p.featured).slice(0, 4).map((proj) => (
            <div key={proj.id} style={{ marginBottom: '10px' }}>
              <strong style={{ fontSize: '10pt' }}>
                {isAr ? proj.title_ar : proj.title_en}
              </strong>
              {proj.tech_stack?.length > 0 && (
                <span style={{ fontSize: '9pt', color: '#666' }}>
                  {' '}({proj.tech_stack.join(', ')})
                </span>
              )}
              <p style={{ fontSize: '10pt', color: '#333', margin: '2px 0 0 0' }}>
                {isAr ? proj.description_ar : proj.description_en}
              </p>
              {proj.github_url && (
                <span style={{ fontSize: '9pt', color: '#666' }}>{proj.github_url}</span>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Education */}
      {education.length > 0 && (
        <section style={{ marginBottom: '20px' }}>
          <SectionTitle title={isAr ? 'التعليم' : 'EDUCATION'} />
          {education.map((edu) => (
            <div key={edu.id} style={{ marginBottom: '10px', display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <strong style={{ fontSize: '11pt' }}>
                  {isAr ? edu.degree_ar : edu.degree_en}
                  {edu.field_en && <span style={{ fontWeight: 'normal', color: '#555' }}>
                    {' — '}{isAr ? edu.field_ar : edu.field_en}
                  </span>}
                </strong>
                <div style={{ fontSize: '10pt', color: '#555' }}>
                  {isAr ? edu.institution_ar : edu.institution_en}
                </div>
                {edu.gpa && (
                  <div style={{ fontSize: '9pt', color: '#666' }}>
                    {t.education.gpa}: {edu.gpa}
                  </div>
                )}
              </div>
              <span style={{ fontSize: '9pt', color: '#666', whiteSpace: 'nowrap', marginLeft: '8px' }}>
                {formatDate(edu.start_date, locale)} – {edu.is_current ? t.experience.present : formatDate(edu.end_date, locale)}
              </span>
            </div>
          ))}
        </section>
      )}

      {/* Certifications */}
      {certifications.length > 0 && (
        <section>
          <SectionTitle title={isAr ? 'الشهادات' : 'CERTIFICATIONS'} />
          {certifications.map((cert) => (
            <div key={cert.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '10pt' }}>
              <span>
                <strong>{isAr ? cert.name_ar : cert.name_en}</strong>
                {' — '}{isAr ? cert.issuer_ar : cert.issuer_en}
              </span>
              {cert.issue_date && (
                <span style={{ fontSize: '9pt', color: '#666' }}>{formatDate(cert.issue_date, locale)}</span>
              )}
            </div>
          ))}
        </section>
      )}
    </div>
  );
}

function SectionTitle({ title }: { title: string }) {
  return (
    <h2 style={{
      fontSize: '10pt',
      fontWeight: 'bold',
      letterSpacing: '1px',
      borderBottom: '1px solid #ccc',
      paddingBottom: '4px',
      marginBottom: '10px',
      color: '#1a1a1a',
      textTransform: 'uppercase',
    }}>
      {title}
    </h2>
  );
}

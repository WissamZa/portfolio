import type { Locale } from '@/lib/database.types';
import type { PortfolioData } from '@/hooks/usePortfolioData';
import { getT } from '@/lib/i18n';
import { cn, formatDate } from '@/lib/utils';

interface ATSResumeProps {
  data: PortfolioData;
  locale: Locale;
}

// ATS-friendly: white bg, clean layout, no complex CSS, semantic HTML
export default function ATSResumeTemplate({ data, locale }: ATSResumeProps) {
  const { profile, projects, skills, experience, education, certifications, courses } = data;
  const t = getT(locale);
  const isAr = locale === 'ar';

  const skillsByCategory = skills.reduce((acc, s) => {
    if (!acc[s.category]) acc[s.category] = [];
    acc[s.category].push((isAr ? s.name_ar : s.name_en).trim());
    return acc;
  }, {} as Record<string, string[]>);

  return (
    <div
      data-resume-template
      dir={isAr ? 'rtl' : 'ltr'}
      className="p-[8mm] sm:p-[20mm] print:p-0"
      style={{
        fontFamily: isAr ? '"Cairo", system-ui, sans-serif' : 'Arial, Helvetica, sans-serif',
        fontSize: '11pt',
        lineHeight: '1.5',
        color: '#000000',
        backgroundColor: '#ffffff',
        maxWidth: '210mm',
        minHeight: '297mm',
        margin: '0 auto',
        boxSizing: 'border-box',
      }}
    >
      {/* Header */}
      <header style={{ borderBottom: '2px solid #000000', paddingBottom: '16px', marginBottom: '20px' }}>
        <h1 style={{ fontSize: '24pt', fontWeight: 'bold', margin: '0 0 4px 0', letterSpacing: isAr ? 'normal' : '-0.5px', color: '#000000' }}>
          {isAr ? profile?.name_ar : profile?.name_en}
        </h1>
        <p style={{ fontSize: '12pt', color: '#333333', margin: '0 0 8px 0', fontWeight: 'bold' }}>
          {isAr ? profile?.title_ar : profile?.title_en}
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', fontSize: '9pt', color: '#555' }}>
          {profile?.email && <span>{profile.email}</span>}
          {profile?.phone && <span>{profile.phone}</span>}
          {(isAr ? profile?.location_ar : profile?.location_en) && (
            <span>{isAr ? profile?.location_ar : profile?.location_en}</span>
          )}
          {profile?.github_url && <span style={{ fontFamily: 'monospace' }}>{profile.github_url.replace(/^https?:\/\//, '')}</span>}
        </div>
      </header>

      {/* Summary */}
      {(profile?.bio_en || profile?.bio_ar) && (
        <section style={{ marginBottom: '20px' }}>
          <SectionTitle title={isAr ? 'الملخص المهني' : 'PROFESSIONAL SUMMARY'} isAr={isAr} />
          <p style={{ fontSize: '10pt', color: '#333', lineHeight: '1.6' }}>
            {isAr ? profile?.bio_ar : profile?.bio_en}
          </p>
        </section>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <section style={{ marginBottom: '20px' }}>
          <SectionTitle title={isAr ? 'المهارات التقنية' : 'TECHNICAL SKILLS'} isAr={isAr} />
          {Object.entries(skillsByCategory).map(([cat, skillNames]) => (
            <div key={cat} style={{ display: 'flex', gap: '12px', marginBottom: '4px', fontSize: '10pt', alignItems: 'baseline' }}>
              <div style={{ 
                minWidth: isAr ? '160px' : '150px', 
                fontWeight: 'bold', 
                color: '#1a1a1a',
                textAlign: isAr ? 'right' : 'left'
              }}>
                {t.skills.categories[cat as keyof typeof t.skills.categories] || cat}:
              </div>
              <div style={{ color: '#333', flex: 1 }}>
                {skillNames.join(', ')}
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <section style={{ marginBottom: '20px' }}>
          <SectionTitle title={isAr ? 'الخبرات المهنية' : 'PROFESSIONAL EXPERIENCE'} isAr={isAr} />
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
      {projects.length > 0 && (
        <section style={{ marginBottom: '20px' }}>
          <SectionTitle title={isAr ? 'المشاريع' : 'PROJECTS'} isAr={isAr} />
          {projects.filter(p => p.featured || projects.length <= 4).slice(0, 5).map((proj) => (
            <div key={proj.id} style={{ marginBottom: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <strong style={{ fontSize: '10pt' }}>
                  {isAr ? proj.title_ar : proj.title_en}
                </strong>
                {proj.github_url && (
                  <span style={{ fontSize: '8pt', color: '#666', fontFamily: 'monospace' }}>
                    {proj.github_url.replace(/^https?:\/\//, '')}
                  </span>
                )}
              </div>
              {proj.tech_stack?.length > 0 && (
                <div style={{ fontSize: '9pt', color: '#666', fontStyle: 'italic', marginBottom: '2px' }}>
                  {proj.tech_stack.join(' • ')}
                </div>
              )}
              <p style={{ fontSize: '10pt', color: '#333', margin: '0' }}>
                {isAr ? proj.description_ar : proj.description_en}
              </p>
            </div>
          ))}
        </section>
      )}

      {/* Education */}
      {education.length > 0 && (
        <section style={{ marginBottom: '20px' }}>
          <SectionTitle title={isAr ? 'التعليم' : 'EDUCATION'} isAr={isAr} />
          {education.map((edu) => (
            <div key={edu.id} style={{ marginBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
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
                </div>
                <span style={{ fontSize: '9pt', color: '#666', whiteSpace: 'nowrap', marginLeft: '8px' }}>
                  {formatDate(edu.start_date, locale)} – {edu.is_current ? t.experience.present : formatDate(edu.end_date, locale)}
                </span>
              </div>
              {(isAr ? edu.description_ar : edu.description_en) && (
                <p style={{ fontSize: '9pt', color: '#333', margin: '2px 0 0 0', fontStyle: 'italic' }}>
                  {isAr ? edu.description_ar : edu.description_en}
                </p>
              )}
              {edu.gpa && (
                <div style={{ fontSize: '9pt', color: '#666', marginTop: '2px' }}>
                  {t.education.gpa}: {edu.gpa}
                </div>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Certifications & Courses */}
      {(certifications.length > 0 || courses.length > 0) && (
        <section>
          <SectionTitle title={isAr ? 'الشهادات والدورات' : 'CERTIFICATIONS & COURSES'} isAr={isAr} />
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
          {courses.map((course) => (
            <div key={course.id} style={{ marginBottom: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span>
                  <strong>{isAr ? course.name_ar : course.name_en}</strong>
                  {' — '}{isAr ? course.provider_ar : course.provider_en}
                </span>
                {course.completion_date && (
                  <span style={{ fontSize: '9pt', color: '#666' }}>{formatDate(course.completion_date, locale)}</span>
                )}
              </div>
              {(isAr ? course.description_ar : course.description_en) && (
                <p style={{ fontSize: '9pt', color: '#444', margin: '1px 0 0 0' }}>
                  {isAr ? course.description_ar : course.description_en}
                </p>
              )}
            </div>
          ))}
        </section>
      )}
    </div>
  );
}

function SectionTitle({ title, isAr }: { title: string, isAr?: boolean }) {
  return (
    <h2 style={{
      fontSize: '12pt',
      fontWeight: 'bold',
      letterSpacing: isAr ? 'normal' : '1px',
      borderBottom: '2px solid #dddddd',
      paddingBottom: '4px',
      marginBottom: '12px',
      color: '#000000',
      textTransform: 'uppercase',
    }}>
      {title}
    </h2>
  );
}

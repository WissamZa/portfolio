-- ============================================================
-- CS Portfolio Database Schema
-- Run this in Supabase SQL Editor
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- PROFILES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name_en TEXT NOT NULL,
  name_ar TEXT NOT NULL,
  title_en TEXT NOT NULL,
  title_ar TEXT NOT NULL,
  bio_en TEXT,
  bio_ar TEXT,
  email TEXT,
  phone TEXT,
  location_en TEXT,
  location_ar TEXT,
  github_url TEXT,
  linkedin_url TEXT,
  twitter_url TEXT,
  website_url TEXT,
  avatar_url TEXT,
  resume_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- PROJECTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title_en TEXT NOT NULL,
  title_ar TEXT NOT NULL,
  description_en TEXT,
  description_ar TEXT,
  long_description_en TEXT,
  long_description_ar TEXT,
  tech_stack TEXT[] DEFAULT '{}',
  github_url TEXT,
  live_url TEXT,
  image_url TEXT,
  featured BOOLEAN DEFAULT false,
  order_index INTEGER DEFAULT 0,
  status TEXT DEFAULT 'completed' CHECK (status IN ('completed', 'in_progress', 'archived')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- SKILLS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name_en TEXT NOT NULL,
  name_ar TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('languages', 'frameworks', 'databases', 'tools', 'cloud', 'other')),
  proficiency INTEGER DEFAULT 80 CHECK (proficiency BETWEEN 0 AND 100),
  icon TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- EXPERIENCE TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS experience (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_en TEXT NOT NULL,
  company_ar TEXT NOT NULL,
  role_en TEXT NOT NULL,
  role_ar TEXT NOT NULL,
  description_en TEXT,
  description_ar TEXT,
  responsibilities_en TEXT[] DEFAULT '{}',
  responsibilities_ar TEXT[] DEFAULT '{}',
  start_date DATE NOT NULL,
  end_date DATE,
  is_current BOOLEAN DEFAULT false,
  location_en TEXT,
  location_ar TEXT,
  company_logo TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- EDUCATION TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS education (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  institution_en TEXT NOT NULL,
  institution_ar TEXT NOT NULL,
  degree_en TEXT NOT NULL,
  degree_ar TEXT NOT NULL,
  field_en TEXT,
  field_ar TEXT,
  description_en TEXT,
  description_ar TEXT,
  start_date DATE NOT NULL,
  end_date DATE,
  is_current BOOLEAN DEFAULT false,
  gpa TEXT,
  location_en TEXT,
  location_ar TEXT,
  logo_url TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- CERTIFICATIONS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS certifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name_en TEXT NOT NULL,
  name_ar TEXT NOT NULL,
  issuer_en TEXT NOT NULL,
  issuer_ar TEXT NOT NULL,
  issue_date DATE,
  expiry_date DATE,
  credential_id TEXT,
  credential_url TEXT,
  logo_url TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- CONTACT MESSAGES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE education ENABLE ROW LEVEL SECURITY;
ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- PUBLIC READ POLICIES (anyone can read public data)
CREATE POLICY "Public read profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Public read projects" ON projects FOR SELECT USING (true);
CREATE POLICY "Public read skills" ON skills FOR SELECT USING (true);
CREATE POLICY "Public read experience" ON experience FOR SELECT USING (true);
CREATE POLICY "Public read education" ON education FOR SELECT USING (true);
CREATE POLICY "Public read certifications" ON certifications FOR SELECT USING (true);

-- Public can INSERT contact messages
CREATE POLICY "Public insert messages" ON contact_messages FOR INSERT WITH CHECK (true);

-- SERVICE ROLE has full access (used by admin API routes)
-- The service role key bypasses RLS automatically

-- ============================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(featured);
CREATE INDEX IF NOT EXISTS idx_projects_order ON projects(order_index);
CREATE INDEX IF NOT EXISTS idx_skills_category ON skills(category);
CREATE INDEX IF NOT EXISTS idx_experience_order ON experience(order_index);
CREATE INDEX IF NOT EXISTS idx_education_order ON education(order_index);
CREATE INDEX IF NOT EXISTS idx_messages_read ON contact_messages(is_read);

-- ============================================================
-- SAMPLE DATA (Optional - uncomment to insert demo data)
-- ============================================================

INSERT INTO profiles (name_en, name_ar, title_en, title_ar, bio_en, bio_ar, email, location_en, location_ar, github_url, linkedin_url)
VALUES (
  'Wissam Hassan Zaidi',
  'وسام حسن الزايدي',
  'Full-Stack Software Engineer',
  'مهندس برمجيات متكامل',
  'Passionate computer scientist with 5+ years of experience building scalable systems, distributed architectures, and cutting-edge web applications. I thrive at the intersection of algorithms and user experience.',
  'مهندس حاسوب شغوف بخبرة تزيد على 5 سنوات في بناء الأنظمة القابلة للتوسع والمعماريات الموزعة وتطبيقات الويب المتطورة. أعمل عند تقاطع الخوارزميات وتجربة المستخدم.',
  'wissam@example.com',
  'Riyadh, Saudi Arabia',
  'جدة، المملكة العربية السعودية',
  'https://github.com/WissamZa',
  'https://linkedin.com/in/wissam-zaidi'
);

INSERT INTO skills (name_en, name_ar, category, proficiency, icon, order_index) VALUES
  ('TypeScript', 'تايب سكريبت', 'languages', 95, 'typescript', 1),
  ('Python', 'بايثون', 'languages', 90, 'python', 2),
  ('Rust', 'رست', 'languages', 70, 'rust', 3),
  ('Go', 'جولانج', 'languages', 75, 'go', 4),
  ('React', 'ريآكت', 'frameworks', 95, 'react', 5),
  ('Next.js', 'نكست جي إس', 'frameworks', 92, 'nextjs', 6),
  ('Node.js', 'نود جي إس', 'frameworks', 88, 'nodejs', 7),
  ('PostgreSQL', 'بوستغريس', 'databases', 85, 'postgresql', 8),
  ('Redis', 'ريدس', 'databases', 80, 'redis', 9),
  ('Docker', 'دوكر', 'tools', 85, 'docker', 10),
  ('AWS', 'أمازون ويب سيرفيسز', 'cloud', 78, 'aws', 11),
  ('Kubernetes', 'كوبرنيتس', 'tools', 72, 'kubernetes', 12);

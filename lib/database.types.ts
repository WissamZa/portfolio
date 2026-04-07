export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: { Row: Profile; Insert: Omit<Profile, 'id' | 'created_at' | 'updated_at'>; Update: Partial<Profile> };
      projects: { Row: Project; Insert: Omit<Project, 'id' | 'created_at' | 'updated_at'>; Update: Partial<Project> };
      skills: { Row: Skill; Insert: Omit<Skill, 'id' | 'created_at'>; Update: Partial<Skill> };
      experience: { Row: Experience; Insert: Omit<Experience, 'id' | 'created_at' | 'updated_at'>; Update: Partial<Experience> };
      education: { Row: Education; Insert: Omit<Education, 'id' | 'created_at'>; Update: Partial<Education> };
      certifications: { Row: Certification; Insert: Omit<Certification, 'id' | 'created_at'>; Update: Partial<Certification> };
      courses: { Row: Course; Insert: Omit<Course, 'id' | 'created_at' | 'updated_at'>; Update: Partial<Course> };
      contact_messages: { Row: ContactMessage; Insert: Omit<ContactMessage, 'id' | 'created_at'>; Update: Partial<ContactMessage> };
      visitors: { Row: Visitor; Insert: Omit<Visitor, 'id' | 'created_at'>; Update: Partial<Visitor> };
    };
  };
}

export interface Profile {
  id: string;
  name_en: string;
  name_ar: string;
  title_en: string;
  title_ar: string;
  bio_en: string | null;
  bio_ar: string | null;
  email: string | null;
  phone: string | null;
  location_en: string | null;
  location_ar: string | null;
  github_url: string | null;
  linkedin_url: string | null;
  twitter_url: string | null;
  website_url: string | null;
  avatar_url: string | null;
  resume_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  title_en: string;
  title_ar: string;
  description_en: string | null;
  description_ar: string | null;
  long_description_en: string | null;
  long_description_ar: string | null;
  tech_stack: string[];
  github_url: string | null;
  live_url: string | null;
  image_url: string | null;
  featured: boolean;
  order_index: number;
  status: 'completed' | 'in_progress' | 'archived';
  created_at: string;
  updated_at: string;
}

export interface Skill {
  id: string;
  name_en: string;
  name_ar: string;
  category: 'languages' | 'frameworks' | 'databases' | 'tools' | 'cloud' | 'other';
  proficiency: number;
  icon: string | null;
  order_index: number;
  created_at: string;
}

export interface Experience {
  id: string;
  company_en: string;
  company_ar: string;
  role_en: string;
  role_ar: string;
  description_en: string | null;
  description_ar: string | null;
  responsibilities_en: string[];
  responsibilities_ar: string[];
  start_date: string;
  end_date: string | null;
  is_current: boolean;
  location_en: string | null;
  location_ar: string | null;
  company_logo: string | null;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface Education {
  id: string;
  institution_en: string;
  institution_ar: string;
  degree_en: string;
  degree_ar: string;
  field_en: string | null;
  field_ar: string | null;
  description_en: string | null;
  description_ar: string | null;
  start_date: string;
  end_date: string | null;
  is_current: boolean;
  gpa: string | null;
  location_en: string | null;
  location_ar: string | null;
  logo_url: string | null;
  order_index: number;
  created_at: string;
}

export interface Certification {
  id: string;
  name_en: string;
  name_ar: string;
  issuer_en: string;
  issuer_ar: string;
  issue_date: string | null;
  expiry_date: string | null;
  credential_id: string | null;
  credential_url: string | null;
  logo_url: string | null;
  order_index: number;
  created_at: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface Visitor {
  id: string;
  ip: string | null;
  country: string | null;
  city: string | null;
  browser: string | null;
  os: string | null;
  url: string | null;
  referrer: string | null;
  created_at: string;
}

export interface Course {
  id: string;
  name_en: string;
  name_ar: string;
  provider_en: string;
  provider_ar: string;
  completion_date: string | null;
  course_url: string | null;
  certificate_url: string | null;
  description_en: string | null;
  description_ar: string | null;
  logo_url: string | null;
  order_index: number;
  created_at: string;
  updated_at: string;
}

// i18n types
export type Locale = 'en' | 'ar';

export interface LocalizedField<T = string> {
  en: T;
  ar: T;
}

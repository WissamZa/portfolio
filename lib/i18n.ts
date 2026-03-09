import type { Locale } from './database.types';

export const translations = {
  en: {
    nav: {
      home: 'Home',
      about: 'About',
      projects: 'Projects',
      skills: 'Skills',
      experience: 'Experience',
      education: 'Education',
      contact: 'Contact',
      resume: 'Resume',
    },
    hero: {
      greeting: 'Hello, World.',
      available: 'Available for opportunities',
      viewWork: 'View My Work',
      downloadCV: 'Download CV',
      scrollDown: 'Scroll Down',
    },
    about: {
      title: 'About Me',
      subtitle: 'The architect behind the code',
    },
    projects: {
      title: 'Projects',
      subtitle: 'Things I\'ve built',
      viewAll: 'View All Projects',
      viewCode: 'View Code',
      liveDemo: 'Live Demo',
      featured: 'Featured',
      status: {
        completed: 'Completed',
        in_progress: 'In Progress',
        archived: 'Archived',
      },
    },
    skills: {
      title: 'Skills',
      subtitle: 'My technical arsenal',
      categories: {
        languages: 'Programming Languages',
        frameworks: 'Frameworks & Libraries',
        databases: 'Databases',
        tools: 'Dev Tools',
        cloud: 'Cloud & DevOps',
        other: 'Other',
      },
    },
    experience: {
      title: 'Experience',
      subtitle: 'My professional journey',
      present: 'Present',
    },
    education: {
      title: 'Education',
      subtitle: 'Academic background',
      gpa: 'GPA',
    },
    contact: {
      title: 'Contact',
      subtitle: 'Let\'s build something together',
      name: 'Your Name',
      email: 'Your Email',
      subject: 'Subject',
      message: 'Message',
      send: 'Send Message',
      sending: 'Sending...',
      success: 'Message sent successfully!',
      error: 'Failed to send message. Please try again.',
    },
    resume: {
      title: 'Resume',
      download: 'Download PDF',
      preview: 'Preview',
      generate: 'Generate ATS Resume',
      atsOptimized: 'ATS Optimized',
      language: 'Language',
    },
    admin: {
      login: 'Admin Login',
      password: 'Password',
      enterPassword: 'Enter admin password',
      signIn: 'Sign In',
      dashboard: 'Dashboard',
      totalProjects: 'Total Projects',
      totalMessages: 'Messages',
      unreadMessages: 'Unread',
      skills: 'Skills',
      addNew: 'Add New',
      edit: 'Edit',
      delete: 'Delete',
      save: 'Save',
      cancel: 'Cancel',
      confirmDelete: 'Are you sure you want to delete this?',
      logout: 'Logout',
    },
    footer: {
      builtWith: 'Built with Next.js & Supabase',
      rights: 'All rights reserved',
    },
  },
  ar: {
    nav: {
      home: 'الرئيسية',
      about: 'عنّي',
      projects: 'المشاريع',
      skills: 'المهارات',
      experience: 'الخبرات',
      education: 'التعليم',
      contact: 'تواصل',
      resume: 'السيرة الذاتية',
    },
    hero: {
      greeting: 'مرحباً بالعالم.',
      available: 'متاح للفرص',
      viewWork: 'اعرض أعمالي',
      downloadCV: 'تحميل السيرة الذاتية',
      scrollDown: 'اسحب للأسفل',
    },
    about: {
      title: 'عنّي',
      subtitle: 'المهندس خلف الكود',
    },
    projects: {
      title: 'المشاريع',
      subtitle: 'ما بنيته',
      viewAll: 'عرض جميع المشاريع',
      viewCode: 'عرض الكود',
      liveDemo: 'عرض مباشر',
      featured: 'مميز',
      status: {
        completed: 'مكتمل',
        in_progress: 'قيد التطوير',
        archived: 'مؤرشف',
      },
    },
    skills: {
      title: 'المهارات',
      subtitle: 'ترسانتي التقنية',
      categories: {
        languages: 'لغات البرمجة',
        frameworks: 'الأطر والمكتبات',
        databases: 'قواعد البيانات',
        tools: 'أدوات التطوير',
        cloud: 'السحابة والـ DevOps',
        other: 'أخرى',
      },
    },
    experience: {
      title: 'الخبرات',
      subtitle: 'مسيرتي المهنية',
      present: 'حتى الآن',
    },
    education: {
      title: 'التعليم',
      subtitle: 'الخلفية الأكاديمية',
      gpa: 'المعدل التراكمي',
    },
    contact: {
      title: 'تواصل',
      subtitle: 'لنبني شيئاً معاً',
      name: 'اسمك',
      email: 'بريدك الإلكتروني',
      subject: 'الموضوع',
      message: 'الرسالة',
      send: 'أرسل الرسالة',
      sending: 'جاري الإرسال...',
      success: 'تم إرسال الرسالة بنجاح!',
      error: 'فشل الإرسال. يرجى المحاولة مجدداً.',
    },
    resume: {
      title: 'السيرة الذاتية',
      download: 'تحميل PDF',
      preview: 'معاينة',
      generate: 'إنشاء سيرة ذاتية ATS',
      atsOptimized: 'محسّنة لـ ATS',
      language: 'اللغة',
    },
    admin: {
      login: 'دخول الإدارة',
      password: 'كلمة المرور',
      enterPassword: 'أدخل كلمة مرور الإدارة',
      signIn: 'تسجيل الدخول',
      dashboard: 'لوحة التحكم',
      totalProjects: 'إجمالي المشاريع',
      totalMessages: 'الرسائل',
      unreadMessages: 'غير مقروءة',
      skills: 'المهارات',
      addNew: 'إضافة جديد',
      edit: 'تعديل',
      delete: 'حذف',
      save: 'حفظ',
      cancel: 'إلغاء',
      confirmDelete: 'هل أنت متأكد من الحذف؟',
      logout: 'تسجيل خروج',
    },
    footer: {
      builtWith: 'مبني بـ Next.js و Supabase',
      rights: 'جميع الحقوق محفوظة',
    },
  },
} as const;

export type TranslationKeys = typeof translations.en;

export function getT(locale: Locale) {
  return translations[locale] || translations['en'];
}

export function localizedValue<T>(obj: { en: T; ar: T } | null | undefined, locale: Locale): T {
  if (!obj) return '' as T;
  return obj[locale];
}

export function isRTL(locale: Locale): boolean {
  return locale === 'ar';
}

import {
    LayoutDashboard, FolderCode, Cpu, Briefcase, GraduationCap,
    MessageSquare, Award, User, Settings, ShieldCheck, BookOpen
} from 'lucide-react';

export const ADMIN_NAV_ITEMS = [
    { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', key: 'dashboard', color: 'text-neon-cyan' },
    { href: '/dashboard/profile', icon: User, label: 'Profile', key: 'profile', color: 'text-neon-purple' },
    { href: '/dashboard/projects', icon: FolderCode, label: 'Projects', key: 'projects', color: 'text-neon-cyan' },
    { href: '/dashboard/skills', icon: Cpu, label: 'Skills', key: 'skills', color: 'text-neon-orange' },
    { href: '/dashboard/experience', icon: Briefcase, label: 'Experience', key: 'experience', color: 'text-neon-cyan' },
    { href: '/dashboard/education', icon: GraduationCap, label: 'Education', key: 'education', color: 'text-neon-purple' },
    { href: '/dashboard/certifications', icon: Award, label: 'Certifications', key: 'certifications', color: 'text-neon-cyan' },
    { href: '/dashboard/courses', icon: BookOpen, label: 'Courses', key: 'courses', color: 'text-neon-purple' },
    { href: '/dashboard/messages', icon: MessageSquare, label: 'Messages', key: 'messages', color: 'text-neon-orange' },
    { href: '/dashboard/audit-logs', icon: ShieldCheck, label: 'Audit Logs', key: 'audit-logs', color: 'text-text-muted' },
    { href: '/dashboard/settings', icon: Settings, label: 'Settings', key: 'settings', color: 'text-text-muted' },
];

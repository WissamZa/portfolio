/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            colors: {
                void: '#050508',
                'void-2': '#0a0a12',
                'void-3': '#0f0f1a',
                neon: {
                    cyan: '#00f5ff',
                    green: '#00ff88',
                    purple: '#b347ff',
                    orange: '#ff6b35',
                },
                grid: '#1a1a2e',
                'text-primary': '#e2e8f0',
                'text-muted': '#64748b',
                'text-accent': '#94a3b8',
                glass: 'rgba(255,255,255,0.03)',
                'glass-border': 'rgba(255,255,255,0.08)',
            },
            fontFamily: {
                mono: ['"JetBrains Mono"', '"Fira Code"', 'monospace'],
                display: ['"Space Grotesk"', 'sans-serif'],
                arabic: ['"Cairo"', '"Tajawal"', 'sans-serif'],
                body: ['"Inter"', 'sans-serif'],
            },
            animation: {
                'grid-flow': 'gridFlow 20s linear infinite',
                'pulse-slow': 'pulse 4s cubic-bezier(0.4,0,0.6,1) infinite',
                'float': 'float 6s ease-in-out infinite',
                'scan': 'scan 3s linear infinite',
                'glitch': 'glitch 0.3s ease infinite',
                'terminal-cursor': 'terminalCursor 1s step-end infinite',
                'orbit': 'orbit 12s linear infinite',
                'data-flow': 'dataFlow 2s linear infinite',
            },
            keyframes: {
                gridFlow: {
                    '0%': { backgroundPosition: '0 0' },
                    '100%': { backgroundPosition: '60px 60px' },
                },
                float: {
                    '0%,100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-20px)' },
                },
                scan: {
                    '0%': { top: '-10%' },
                    '100%': { top: '110%' },
                },
                glitch: {
                    '0%,100%': { transform: 'translateX(0)' },
                    '20%': { transform: 'translateX(-2px)' },
                    '40%': { transform: 'translateX(2px)' },
                    '60%': { transform: 'translateX(-1px)' },
                },
                terminalCursor: {
                    '0%,100%': { opacity: '1' },
                    '50%': { opacity: '0' },
                },
                orbit: {
                    '0%': { transform: 'rotate(0deg) translateX(120px) rotate(0deg)' },
                    '100%': { transform: 'rotate(360deg) translateX(120px) rotate(-360deg)' },
                },
                dataFlow: {
                    '0%': { backgroundPosition: '0% 50%' },
                    '100%': { backgroundPosition: '100% 50%' },
                },
            },
            backgroundImage: {
                'grid-pattern': 'linear-gradient(rgba(0,245,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,245,255,0.03) 1px, transparent 1px)',
                'hero-glow': 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(0,245,255,0.15), transparent)',
                'card-glow': 'radial-gradient(circle at top left, rgba(0,245,255,0.08), transparent 60%)',
            },
            boxShadow: {
                'neon-cyan': '0 0 20px rgba(0,245,255,0.3), 0 0 60px rgba(0,245,255,0.1)',
                'neon-green': '0 0 20px rgba(0,255,136,0.3), 0 0 60px rgba(0,255,136,0.1)',
                'neon-purple': '0 0 20px rgba(179,71,255,0.3), 0 0 60px rgba(179,71,255,0.1)',
                'glass': '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)',
            },
            backdropBlur: { xs: '2px' },
        },
    },
    plugins: [],
};

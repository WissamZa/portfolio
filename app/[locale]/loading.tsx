export default function Loading() {
    return (
        <div className="min-h-screen bg-void flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-2 border-neon-cyan border-t-transparent animate-spin rounded-full shadow-[0_0_15px_rgba(0,245,255,0.2)]" />
                <p className="font-mono text-xs text-neon-cyan animate-pulse tracking-widest uppercase">Initializing Interface...</p>
            </div>
        </div>
    );
}

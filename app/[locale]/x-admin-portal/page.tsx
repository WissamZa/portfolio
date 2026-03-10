'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Terminal } from 'lucide-react';
import { SignIn, useUser } from '@stackframe/stack';

// The admin page is hidden - users must type the secret sequence
// This acts like a konami code puzzle
// The page is at /en/x-admin-portal but the puzzle must be solved first

const PUZZLE_HINTS = [
  { step: 0, prompt: 'Access terminal v2.0', input: '> ', placeholder: 'Type "access" to begin...', expected: 'access' },
  { step: 1, prompt: 'Identity verification required', input: 'auth> ', placeholder: 'Who built this system? (hint: engineer)', expected: 'engineer' },
  { step: 2, prompt: 'Decryption key needed', input: 'key> ', placeholder: 'Enter the matrix (type "matrix")...', expected: 'matrix' },
];

export default function AdminLoginPage() {
  const [puzzleStep, setPuzzleStep] = useState(0);
  const [puzzleSolved, setPuzzleSolved] = useState(false);
  const [input, setInput] = useState('');
  const [lines, setLines] = useState<string[]>([
    '╔══════════════════════════════════════╗',
    '║   SECURE SYSTEM ACCESS TERMINAL      ║',
    '║   Unauthorized access is prohibited  ║',
    '╚══════════════════════════════════════╝',
    '',
    '> Initializing security protocol...',
    '> Connection encrypted [AES-256]',
    '> Challenge-response required',
    '',
  ]);
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;

  const user = useUser();
  useEffect(() => {
    if (user) {
      router.push(`/${locale}/x-admin-portal/dashboard`);
    }
  }, [user, locale, router]);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
    inputRef.current?.focus();
  }, [lines, puzzleSolved]);

  const addLine = (line: string) => {
    setLines((prev) => [...prev, line]);
  };

  const handlePuzzleInput = (e: React.FormEvent) => {
    e.preventDefault();
    const val = input.trim().toLowerCase();
    const current = PUZZLE_HINTS[puzzleStep];

    addLine(`${current.input}${input}`);
    setInput('');

    if (val === current.expected) {
      setTimeout(() => {
        addLine(`> ✓ Accepted`);
        if (puzzleStep === PUZZLE_HINTS.length - 1) {
          setTimeout(() => {
            addLine('');
            addLine('> ACCESS GRANTED — Enter credentials');
            addLine('');
            setPuzzleSolved(true);
          }, 500);
        } else {
          setTimeout(() => {
            setPuzzleStep((s) => s + 1);
            addLine('');
            addLine(`> ${PUZZLE_HINTS[puzzleStep + 1].prompt}`);
          }, 300);
        }
      }, 200);
    } else {
      setTimeout(() => {
        addLine('> ✗ Invalid input. Try again.');
      }, 200);
    }
  };

  /* handleLogin removed in favor of Stack Auth */

  return (
    <div className="min-h-screen bg-void flex items-center justify-center p-4 overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 bg-grid opacity-20" />
      <div className="fixed inset-0 bg-linear-to-b from-neon-purple/5 via-transparent to-neon-cyan/5" />

      {/* Full Page Login Overlay */}
      {puzzleSolved ? (
        <div className="fixed inset-0 z-50 bg-void flex items-center justify-center p-4 animate-in fade-in duration-700">
          <div className="w-full max-w-md relative">
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
              <div className="w-16 h-16 border-2 border-neon-cyan flex items-center justify-center bg-void-2 shadow-[0_0_20px_rgba(0,245,255,0.3)]">
                <span className="font-mono text-2xl text-neon-cyan font-bold">CS</span>
              </div>
              <h2 className="font-display text-xl text-text-primary tracking-widest uppercase">Admin Access</h2>
            </div>

            <div className="glass-card p-1 border-neon-cyan/30 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
              <div className="bg-void-2 p-6 md:p-8">
                <Suspense fallback={<div className="flex justify-center py-20"><div className="spinner" /></div>}>
                  <SignIn fullPage={false} automaticRedirect={false} />
                </Suspense>
              </div>
            </div>

            <div className="mt-8 text-center">
              <button
                onClick={() => setPuzzleSolved(false)}
                className="font-mono text-xs text-text-muted hover:text-neon-cyan transition-colors flex items-center gap-2 mx-auto"
              >
                <Terminal size={12} />
                Return to terminal
              </button>
            </div>
          </div>

          <style jsx global>{`
            .stack-auth-container {
              --stack-primary: #00f5ff !important;
              --stack-background: transparent !important;
            }
            /* Hide Stack's default branding if any */
            [class*="stack-branding"] { display: none !important; }
            /* Customizing Stack internal components */
            button[type="submit"] {
              background: #00f5ff !important;
              color: #0a0a0b !important;
              font-family: 'JetBrains Mono', monospace !important;
              font-weight: bold !important;
              text-transform: uppercase !important;
              letter-spacing: 0.1em !important;
              border-radius: 0 !important;
            }
            input {
              background: rgba(15, 15, 26, 0.8) !important;
              border: 1px solid rgba(0, 245, 255, 0.2) !important;
              border-radius: 0 !important;
              color: #fff !important;
              font-family: 'JetBrains Mono', monospace !important;
            }
            input:focus {
              border-color: #00f5ff !important;
              box-shadow: 0 0 10px rgba(0, 245, 255, 0.2) !important;
            }
            label {
              color: rgba(226, 232, 240, 0.6) !important;
              font-family: 'JetBrains Mono', monospace !important;
              font-size: 0.75rem !important;
              text-transform: uppercase !important;
            }
          `}</style>
        </div>
      ) : (
        <div className="relative z-10 w-full max-w-2xl animate-in zoom-in-95 duration-500">
          {/* Window chrome */}
          <div className="flex items-center gap-2 bg-void-3 border border-glass-border px-4 py-3 border-b-0">
            <div className="w-3 h-3 rounded-full bg-red-500/70" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
            <div className="w-3 h-3 rounded-full bg-neon-green/70" />
            <span className="ml-2 font-mono text-xs text-text-muted">terminal — bash</span>
          </div>

          {/* Terminal */}
          <div
            ref={terminalRef}
            className="bg-void-2 border border-glass-border border-t-neon-cyan/20 p-6 min-h-80 max-h-96 overflow-y-auto cursor-text shadow-2xl"
            onClick={() => inputRef.current?.focus()}
          >
            {lines.map((line, i) => (
              <div key={i} className={`font-mono text-sm leading-6 ${line.startsWith('╔') || line.startsWith('║') || line.startsWith('╚')
                ? 'text-neon-cyan'
                : line.startsWith('> ✓')
                  ? 'text-neon-green'
                  : line.startsWith('> ✗')
                    ? 'text-red-400'
                    : line.startsWith('> ACCESS')
                      ? 'text-neon-green font-bold'
                      : 'text-text-muted'
                }`}>
                {line || '\u00A0'}
              </div>
            ))}

            {/* Input line */}
            <form onSubmit={handlePuzzleInput} className="flex items-center gap-1">
              <span className="font-mono text-sm text-neon-cyan">
                {PUZZLE_HINTS[puzzleStep]?.input}
              </span>
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 bg-transparent font-mono text-sm text-text-primary outline-none"
                placeholder={PUZZLE_HINTS[puzzleStep]?.placeholder}
                autoComplete="off"
                spellCheck={false}
              />
            </form>
          </div>

          {/* Status bar */}
          <div className="flex items-center justify-between bg-neon-cyan/10 border border-neon-cyan/20 border-t-0 px-4 py-1.5">
            <span className="font-mono text-xs text-neon-cyan">
              CHALLENGE {Math.min(puzzleStep + 1, PUZZLE_HINTS.length)}/{PUZZLE_HINTS.length}
            </span>
            <span className="font-mono text-xs text-text-muted">SECURE</span>
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Terminal, Lock, AlertCircle } from 'lucide-react';

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
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;

  useEffect(() => {
    // Check if already logged in
    fetch('/api/admin/data?table=profiles', { credentials: 'include' }).then(res => {
      if (res.ok) router.push(`/${locale}/x-admin-portal/dashboard`);
    });
  }, [locale]);

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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    addLine(`> Authenticating...`);

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: password }),
        credentials: 'include',
      });

      if (res.ok) {
        addLine('> ✓ Authentication successful');
        addLine('> Redirecting to dashboard...');
        setTimeout(() => router.push(`/${locale}/x-admin-portal/dashboard`), 800);
      } else {
        addLine('> ✗ Authentication failed');
        setError('Invalid credentials');
      }
    } catch {
      setError('Connection error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-void flex items-center justify-center p-4">
      {/* Background */}
      <div className="fixed inset-0 bg-grid opacity-20" />
      <div className="fixed inset-0 bg-linear-to-b from-neon-purple/5 via-transparent to-neon-cyan/5" />

      <div className="relative z-10 w-full max-w-2xl">
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
          className="bg-void-2 border border-glass-border border-t-neon-cyan/20 p-6 min-h-80 max-h-96 overflow-y-auto cursor-text"
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
          {!puzzleSolved ? (
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
          ) : (
            <form onSubmit={handleLogin} className="mt-2 space-y-3">
              <div className="flex items-center gap-2">
                <Lock size={14} className="text-neon-cyan shrink-0" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="flex-1 bg-void-3 border border-neon-cyan/30 font-mono text-sm text-text-primary px-3 py-2 outline-none focus:border-neon-cyan"
                  placeholder="Enter admin token..."
                  autoFocus
                  required
                />
              </div>
              {error && (
                <div className="flex items-center gap-1 text-red-400 font-mono text-xs">
                  <AlertCircle size={12} />
                  {error}
                </div>
              )}
              <button
                type="submit"
                disabled={loading}
                className="btn-neon-filled w-full py-2 font-mono text-sm flex items-center justify-center gap-2"
              >
                <Terminal size={14} />
                {loading ? 'Authenticating...' : 'ACCESS SYSTEM'}
              </button>
            </form>
          )}
        </div>

        {/* Status bar */}
        <div className="flex items-center justify-between bg-neon-cyan/10 border border-neon-cyan/20 border-t-0 px-4 py-1.5">
          <span className="font-mono text-xs text-neon-cyan">
            CHALLENGE {Math.min(puzzleStep + 1, PUZZLE_HINTS.length)}/{PUZZLE_HINTS.length}
          </span>
          <span className="font-mono text-xs text-text-muted">SECURE</span>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Terminal, Lock, AlertCircle, LogIn, Key, Mail } from 'lucide-react';
import { useUser, useStackApp } from '@stackframe/stack';

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
  const [puzzleSolved, setPuzzleSolved] = useState(true);
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
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [passkeyLoading, setPasskeyLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;

  const app = useStackApp();
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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    const res = await app.signInWithCredential({ email, password });
    if (res.status === 'ok') {
      router.push(`/${locale}/x-admin-portal/dashboard`);
    } else {
      // @ts-ignore
      setError(res.error?.message || 'Invalid credentials');
      setLoading(false);
    }
  };

  const handlePasskeyLogin = async () => {
    setPasskeyLoading(true);
    setError('');
    setMessage('');

    const res = await app.signInWithPasskey();
    if (res.status === 'ok') {
      router.push(`/${locale}/x-admin-portal/dashboard`);
    } else {
      // @ts-ignore
      setError(res.error?.message || 'Failed to sign in with Passkey');
      setPasskeyLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError('Please enter your email to reset password');
      return;
    }
    setResetLoading(true);
    setError('');
    setMessage('');

    const res = await app.sendForgotPasswordEmail(email);
    if (res.status === 'ok') {
      setMessage('Password reset email sent. Please check your inbox.');
    } else {
      // @ts-ignore
      setError(res.error?.message || 'Failed to send reset email');
    }
    setResetLoading(false);
  };

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
                <form onSubmit={handleLogin} className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-mono uppercase text-text-muted tracking-widest">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-void-3 border border-neon-cyan/20 p-3 font-mono text-sm outline-none focus:border-neon-cyan transition-colors"
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-mono uppercase text-text-muted tracking-widest">Password</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="bg-void-3 border border-neon-cyan/20 p-3 font-mono text-sm outline-none focus:border-neon-cyan transition-colors"
                      required
                    />
                  </div>

                  {error && (
                    <div className="flex items-center gap-2 text-red-400 font-mono text-xs bg-red-400/10 p-2 border border-red-400/20">
                      <AlertCircle size={14} />
                      {error}
                    </div>
                  )}
                  {message && (
                    <div className="flex items-center gap-2 text-green-400 font-mono text-xs bg-green-400/10 p-2 border border-green-400/20">
                      <AlertCircle size={14} />
                      {message}
                    </div>
                  )}

                  <div className="flex flex-col gap-3 mt-4">
                    <button
                      type="submit"
                      disabled={loading || passkeyLoading || resetLoading}
                      className="flex items-center justify-center gap-2 bg-neon-cyan/10 border border-neon-cyan text-neon-cyan p-3 font-mono text-sm font-bold uppercase tracking-widest hover:bg-neon-cyan/20 transition-all disabled:opacity-50"
                    >
                      {loading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded-full border-2 border-neon-cyan border-r-transparent animate-spin" />
                          Authenticating...
                        </div>
                      ) : (
                        <>
                          <Lock size={16} />
                          Access System
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={handlePasskeyLogin}
                      disabled={loading || passkeyLoading || resetLoading}
                      className="flex items-center justify-center gap-2 bg-void-3 border border-text-muted/30 text-text-muted p-3 font-mono text-sm uppercase hover:text-neon-cyan hover:border-neon-cyan/50 transition-all disabled:opacity-50"
                    >
                      {passkeyLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded-full border-2 border-neon-cyan border-r-transparent animate-spin" />
                          Waiting for Passkey...
                        </div>
                      ) : (
                        <>
                          <Key size={16} />
                          Sign in with Passkey
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={handleForgotPassword}
                      disabled={loading || passkeyLoading || resetLoading}
                      className="text-xs font-mono text-text-muted hover:text-neon-cyan underline-offset-4 hover:underline transition-colors focus:outline-none self-center pt-2"
                    >
                      {resetLoading ? 'Sending email...' : 'Forgot your password?'}
                    </button>
                  </div>
                </form>
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

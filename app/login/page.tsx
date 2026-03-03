'use client';

import { useState, FormEvent, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('from') ?? '/receipt';
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      router.push(redirectTo);
      router.refresh();
    } else {
      const json = await res.json();
      setError(json.error ?? 'Incorrect password');
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F4F6F9] flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-8">
          <img src="/akp-logo.png" alt="Alpha Kappa Psi" className="h-10 w-auto" />
        </div>
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="px-8 py-6 border-b border-slate-100">
            <h1 className="text-base font-semibold text-[#1B3A6B]">Expense Receipt System</h1>
            <p className="text-sm text-slate-400 mt-0.5">Omega Phi Chapter · SJSU</p>
          </div>
          <div className="px-8 py-7">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
                <input
                  id="password" type="password"
                  value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••" autoFocus
                  className={`w-full px-3.5 py-2.5 rounded-lg border text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-colors bg-white ${
                    error ? 'border-red-300 bg-red-50 focus:border-red-400 focus:ring-red-100' : 'border-slate-200 focus:border-[#1B3A6B] focus:ring-[#1B3A6B]/10'
                  }`}
                />
                {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
              </div>
              <button type="submit" disabled={loading || !password}
                className="w-full py-2.5 bg-[#1B3A6B] hover:bg-[#142d54] disabled:bg-slate-200 disabled:text-slate-400 text-white font-semibold rounded-lg transition-colors text-sm">
                {loading ? 'Signing in…' : 'Sign In'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginContent />
    </Suspense>
  );
}

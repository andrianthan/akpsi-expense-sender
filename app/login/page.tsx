'use client';

import { useState, FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

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
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-sm w-full">
        {/* Header */}
        <div className="bg-[#1B3A6B] rounded-t-xl px-8 py-7 text-center">
          <p className="text-[#C9A84C] text-xs font-semibold tracking-[3px] uppercase mb-1.5">
            Alpha Kappa Psi
          </p>
          <h1 className="text-white text-xl font-bold tracking-wide">
            Omega Phi Chapter
          </h1>
          <p className="text-[#C9A84C]/80 text-xs mt-1 tracking-wide">Receipt System</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-b-xl shadow-lg px-8 py-7">
          <p className="text-gray-500 text-sm mb-5 text-center">
            Enter the VP Finance password to continue.
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                autoFocus
                className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#1B3A6B] transition ${
                  error ? 'border-red-400 bg-red-50' : 'border-gray-300'
                }`}
              />
              {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
            </div>
            <button
              type="submit"
              disabled={loading || !password}
              className="w-full py-2.5 px-4 bg-[#1B3A6B] hover:bg-[#14305A] disabled:bg-[#1B3A6B]/50 text-white font-semibold rounded-md transition text-sm tracking-wide shadow-sm"
            >
              {loading ? 'Checking…' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginContent />
    </Suspense>
  );
}

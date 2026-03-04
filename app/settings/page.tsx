'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SettingsPage() {
  const router = useRouter();
  const [template, setTemplate] = useState('');
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/settings')
      .then(r => r.json())
      .then(d => { setTemplate(d.template); setLoading(false); })
      .catch(() => { setError('Failed to load template.'); setLoading(false); });
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSaved(false);
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ template }),
      });
      const json = await res.json();
      if (res.ok) {
        router.push('/receipt');
      } else {
        setError(json.error ?? 'Failed to save');
      }
    } catch {
      setError('Network error — could not save template.');
    }
    setSaving(false);
  }

  return (
    <div className="min-h-screen bg-[#F4F6F9]">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-2xl mx-auto px-6 h-16 flex items-center justify-between">
          <img src="/akp-logo.png" alt="Alpha Kappa Psi" className="h-9 w-auto" />
          <span className="text-[11px] font-semibold text-slate-400 tracking-[0.15em] uppercase">
            AKPSI · Omega Phi
          </span>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="px-8 py-6 border-b border-slate-100">
            <h1 className="text-lg font-semibold text-[#1B3A6B]">Email Template</h1>
            <p className="text-sm text-slate-400 mt-0.5">
              Default message shown in every expense receipt email.
            </p>
          </div>
          <div className="px-8 py-7">
            {loading ? (
              <div className="h-24 bg-slate-100 rounded-lg animate-pulse" />
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Message Body
                  </label>
                  <textarea
                    rows={5}
                    value={template}
                    onChange={e => { setTemplate(e.target.value); setSaved(false); }}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:border-[#1B3A6B] focus:ring-[#1B3A6B]/10 transition-colors bg-white resize-none"
                  />
                  <p className="mt-1.5 text-xs text-slate-400">
                    This appears below "Dear [Name]," in every receipt email. Can be overridden per receipt.
                  </p>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg">{error}</div>
                )}
                {saved && (
                  <div className="bg-green-50 border border-green-200 text-green-600 text-sm px-4 py-3 rounded-lg">Template saved.</div>
                )}

                <div className="pt-1 border-t border-slate-100" />
                <div className="flex gap-3">
                  <Link href="/receipt"
                    className="flex-1 py-2.5 border border-slate-200 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors text-center">
                    ← Back
                  </Link>
                  <button type="submit" disabled={saving || !template.trim()}
                    className="flex-[2] py-2.5 bg-[#1B3A6B] hover:bg-[#142d54] disabled:bg-slate-200 disabled:text-slate-400 text-white font-semibold rounded-lg transition-colors text-sm">
                    {saving ? 'Saving…' : 'Save Template'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

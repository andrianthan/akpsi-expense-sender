'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Steps } from '@/components/Steps';

function PreviewContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const params = searchParams.toString();
  const pdfUrl = `/api/preview-pdf?${params}`;

  const formData = {
    submittedBy: searchParams.get('submittedBy') ?? '',
    email: searchParams.get('email') ?? '',
    expenseDescription: searchParams.get('expenseDescription') ?? '',
    amountPaid: searchParams.get('amountPaid') ?? '',
    paymentMethod: searchParams.get('paymentMethod') ?? '',
    semester: searchParams.get('semester') ?? '',
    year: searchParams.get('year') ?? '',
    expenseDate: searchParams.get('expenseDate') ?? '',
    processedBy: searchParams.get('processedBy') ?? '',
    personalMessage: searchParams.get('personalMessage') ?? '',
  };

  useEffect(() => {
    if (!formData.submittedBy || !formData.email) router.replace('/receipt');
  }, [formData.submittedBy, formData.email, router]);

  async function handleSend() {
    setSending(true);
    setError(null);
    try {
      const res = await fetch('/api/send-receipt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? 'Failed to send receipt');
      router.push(`/confirmation?receiptNumber=${encodeURIComponent(json.receiptNumber)}&email=${encodeURIComponent(formData.email)}&name=${encodeURIComponent(formData.submittedBy)}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      setSending(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F4F6F9]">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-3xl mx-auto px-6 h-16 flex items-center justify-between">
          <img src="/akp-logo.png" alt="Alpha Kappa Psi" className="h-9 w-auto" />
          <span className="text-[11px] font-semibold text-slate-400 tracking-[0.15em] uppercase">AKPSI · Omega Phi</span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex justify-center mb-7">
          <Steps current={2} />
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          {/* Summary bar */}
          <div className="px-8 py-4 border-b border-slate-100 flex flex-wrap items-center gap-x-6 gap-y-2">
            <div>
              <span className="text-xs text-slate-400 block">Reimbursed To</span>
              <span className="text-sm font-semibold text-[#1B3A6B]">{formData.submittedBy}</span>
            </div>
            <div>
              <span className="text-xs text-slate-400 block">Amount</span>
              <span className="text-sm font-bold text-[#C9A84C]">${parseFloat(formData.amountPaid || '0').toFixed(2)}</span>
            </div>
            <div>
              <span className="text-xs text-slate-400 block">Period</span>
              <span className="text-sm font-medium text-slate-700">{formData.semester} {formData.year}</span>
            </div>
            <div className="ml-auto">
              <span className="text-xs bg-[#1B3A6B]/8 text-[#1B3A6B] font-semibold px-2.5 py-1 rounded-full">Preview</span>
            </div>
          </div>

          {/* PDF iframe */}
          <iframe src={pdfUrl} className="w-full" style={{ height: '680px', border: 'none' }} title="Receipt Preview" />

          {/* Actions */}
          <div className="px-8 py-5 border-t border-slate-100">
            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg">{error}</div>
            )}
            <div className="flex gap-3">
              <button onClick={() => router.back()} disabled={sending}
                className="flex-1 py-2.5 border border-slate-200 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50">
                ← Edit
              </button>
              <button onClick={handleSend} disabled={sending}
                className="flex-[2] py-2.5 bg-[#1B3A6B] hover:bg-[#142d54] disabled:bg-[#1B3A6B]/50 text-white font-semibold rounded-lg transition-colors text-sm flex items-center justify-center gap-2">
                {sending ? (
                  <>
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Sending…
                  </>
                ) : 'Approve & Send Receipt'}
              </button>
            </div>
            <p className="text-center text-xs text-slate-400 mt-3">
              PDF will be emailed to <strong>{formData.email}</strong>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function PreviewPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F4F6F9] flex items-center justify-center"><span className="text-slate-400 text-sm">Loading…</span></div>}>
      <PreviewContent />
    </Suspense>
  );
}

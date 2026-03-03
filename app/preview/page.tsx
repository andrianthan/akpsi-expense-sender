'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

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
  };

  useEffect(() => {
    if (!formData.submittedBy || !formData.email) {
      router.replace('/receipt');
    }
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
      if (!res.ok) {
        throw new Error(json.error ?? 'Failed to send receipt');
      }
      router.push(
        `/confirmation?receiptNumber=${encodeURIComponent(json.receiptNumber)}&email=${encodeURIComponent(formData.email)}&name=${encodeURIComponent(formData.submittedBy)}`
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      setSending(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="bg-[#1B3A6B] rounded-t-xl px-8 py-5 flex items-center justify-between">
          <div>
            <p className="text-[#C9A84C] text-xs font-semibold tracking-[2px] uppercase">
              Alpha Kappa Psi · Omega Phi
            </p>
            <h1 className="text-white text-lg font-bold mt-0.5">Expense Receipt Preview</h1>
          </div>
          <span className="bg-[#C9A84C]/20 text-[#C9A84C] text-xs font-semibold px-3 py-1 rounded-full tracking-wide uppercase">
            Preview Mode
          </span>
        </div>

        {/* Summary bar */}
        <div className="bg-[#FDF8EC] border-b border-[#E0D4A8] px-8 py-3 flex flex-wrap gap-4 text-sm">
          <span><span className="text-gray-500">To:</span> <strong className="text-[#1B3A6B]">{formData.submittedBy}</strong></span>
          <span><span className="text-gray-500">Email:</span> <span>{formData.email}</span></span>
          <span><span className="text-gray-500">Amount:</span> <strong className="text-[#1B3A6B]">${parseFloat(formData.amountPaid || '0').toFixed(2)}</strong></span>
          <span><span className="text-gray-500">Period:</span> <span>{formData.semester} {formData.year}</span></span>
        </div>

        {/* PDF Preview */}
        <div className="bg-white shadow-lg" style={{ minHeight: '600px' }}>
          <iframe
            src={pdfUrl}
            className="w-full"
            style={{ height: '680px', border: 'none' }}
            title="Expense Receipt Preview"
          />
        </div>

        {/* Action Bar */}
        <div className="bg-white rounded-b-xl shadow-lg px-8 py-5 flex flex-col gap-3">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-md">
              {error}
            </div>
          )}
          <div className="flex gap-3">
            <button
              onClick={() => router.back()}
              disabled={sending}
              className="flex-1 py-2.5 px-4 border border-gray-300 rounded-md text-sm font-semibold text-gray-700 hover:bg-gray-50 transition disabled:opacity-50"
            >
              ← Edit
            </button>
            <button
              onClick={handleSend}
              disabled={sending}
              className="flex-[2] py-2.5 px-4 bg-[#1B3A6B] hover:bg-[#14305A] disabled:bg-[#1B3A6B]/60 text-white font-semibold rounded-md transition text-sm tracking-wide shadow-sm flex items-center justify-center gap-2"
            >
              {sending ? (
                <>
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Sending…
                </>
              ) : (
                'Approve & Send Receipt ✉'
              )}
            </button>
          </div>
          <p className="text-center text-xs text-gray-400">
            A PDF receipt will be emailed to <strong>{formData.email}</strong>
          </p>
        </div>
      </div>
    </main>
  );
}

export default function PreviewPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading preview…</div>
      </div>
    }>
      <PreviewContent />
    </Suspense>
  );
}

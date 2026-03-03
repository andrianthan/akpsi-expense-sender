'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Steps } from '@/components/Steps';

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const receiptNumber = searchParams.get('receiptNumber') ?? '';
  const email = searchParams.get('email') ?? '';
  const name = searchParams.get('name') ?? '';

  return (
    <div className="min-h-screen bg-[#F4F6F9]">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-2xl mx-auto px-6 h-16 flex items-center justify-between">
          <img src="/akp-logo.png" alt="Alpha Kappa Psi" className="h-9 w-auto" />
          <span className="text-[11px] font-semibold text-slate-400 tracking-[0.15em] uppercase">Omega Phi · SJSU</span>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex justify-center mb-7">
          <Steps current={3} />
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="px-8 py-10 text-center border-b border-slate-100">
            <div className="mx-auto w-14 h-14 bg-green-50 rounded-full flex items-center justify-center mb-4">
              <svg className="w-7 h-7 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-xl font-semibold text-slate-900">Receipt Sent</h1>
            <p className="text-sm text-slate-400 mt-1">
              {name ? <><strong className="text-slate-600">{name}</strong> will receive it at </> : 'Sent to '}
              <strong className="text-slate-600">{email}</strong>
            </p>
          </div>

          <div className="px-8 py-6 border-b border-slate-100 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">Receipt Number</span>
              <span className="text-sm font-bold text-[#C9A84C] tracking-wide">{receiptNumber}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">Sent To</span>
              <span className="text-sm font-medium text-slate-700">{email}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">Issued At</span>
              <span className="text-sm font-medium text-slate-700">{new Date().toLocaleString()}</span>
            </div>
          </div>

          <div className="px-8 py-6">
            <Link href="/receipt"
              className="block w-full py-2.5 bg-[#1B3A6B] hover:bg-[#142d54] text-white font-semibold rounded-lg transition-colors text-sm text-center">
              Issue Another Receipt
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F4F6F9] flex items-center justify-center"><span className="text-slate-400 text-sm">Loading…</span></div>}>
      <ConfirmationContent />
    </Suspense>
  );
}

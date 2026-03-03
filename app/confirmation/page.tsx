'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const receiptNumber = searchParams.get('receiptNumber') ?? '';
  const email = searchParams.get('email') ?? '';
  const name = searchParams.get('name') ?? '';

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center py-10 px-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="bg-[#1B3A6B] rounded-t-xl px-8 py-6 text-center">
          <p className="text-[#C9A84C] text-xs font-semibold tracking-[3px] uppercase mb-1">
            Alpha Kappa Psi
          </p>
          <h1 className="text-white text-xl font-bold tracking-wide">
            Omega Phi Chapter — SJSU
          </h1>
        </div>

        {/* Success Card */}
        <div className="bg-white rounded-b-xl shadow-lg px-8 py-8 text-center">
          {/* Check icon */}
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-5">
            <svg className="w-9 h-9 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-1">Receipt Sent!</h2>
          <p className="text-gray-500 text-sm mb-6">
            The dues receipt was successfully emailed to {name ? <><strong>{name}</strong></> : 'the member'}.
          </p>

          {/* Details */}
          <div className="bg-[#F0F4FA] rounded-lg px-6 py-4 text-left space-y-3 mb-6">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 font-semibold">Receipt #</span>
              <span className="text-[#1B3A6B] font-bold tracking-wide">{receiptNumber}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 font-semibold">Sent To</span>
              <span className="text-gray-800">{email}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 font-semibold">Time</span>
              <span className="text-gray-800">{new Date().toLocaleString()}</span>
            </div>
          </div>

          {/* Gold accent bar */}
          <div className="h-1 bg-[#C9A84C] rounded-full mb-6 mx-8 opacity-60" />

          <Link
            href="/receipt"
            className="block w-full py-3 px-6 bg-[#1B3A6B] hover:bg-[#14305A] text-white font-semibold rounded-md transition text-sm tracking-wide shadow-sm text-center"
          >
            Issue Another Receipt
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading…</div>
      </div>
    }>
      <ConfirmationContent />
    </Suspense>
  );
}

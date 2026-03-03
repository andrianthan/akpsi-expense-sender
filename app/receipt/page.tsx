import { ReceiptForm } from '@/components/ReceiptForm';
import { Steps } from '@/components/Steps';

export const metadata = {
  title: 'Issue Expense Receipt — AKPSI Omega Phi',
};

export default function ReceiptPage() {
  return (
    <div className="min-h-screen bg-[#F4F6F9]">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-2xl mx-auto px-6 h-16 flex items-center justify-between">
          <img src="/akp-logo.png" alt="Alpha Kappa Psi" className="h-9 w-auto" />
          <span className="text-[11px] font-semibold text-slate-400 tracking-[0.15em] uppercase">
            AKPSI · Omega Phi
          </span>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        {/* Steps */}
        <div className="flex justify-center mb-7">
          <Steps current={1} />
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="px-8 py-6 border-b border-slate-100">
            <h1 className="text-lg font-semibold text-[#1B3A6B]">Expense Reimbursement</h1>
            <p className="text-sm text-slate-400 mt-0.5">
              Fill in the details below. You&apos;ll preview before sending.
            </p>
          </div>
          <div className="px-8 py-7">
            <ReceiptForm />
          </div>
        </div>
      </main>
    </div>
  );
}

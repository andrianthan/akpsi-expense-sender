import { ReceiptForm } from '@/components/ReceiptForm';

export const metadata = {
  title: 'Issue Expense Receipt — AKPSI Omega Phi',
};

export default function ReceiptPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="bg-[#1B3A6B] rounded-t-xl px-8 py-6 text-center">
          <p className="text-[#C9A84C] text-xs font-semibold tracking-[3px] uppercase mb-1">
            Alpha Kappa Psi
          </p>
          <h1 className="text-white text-xl font-bold tracking-wide">
            Omega Phi Chapter — SJSU
          </h1>
          <p className="text-[#C9A84C] text-xs tracking-[2px] uppercase mt-1">
            Issue Expense Receipt
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-b-xl shadow-lg px-8 py-7">
          <p className="text-gray-500 text-xs mb-6">
            Fill in the expense details. You will preview the receipt before sending.
          </p>
          <ReceiptForm />
        </div>
      </div>
    </main>
  );
}

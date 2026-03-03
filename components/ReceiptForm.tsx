'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import type { ReceiptFormData } from '@/lib/types';

const currentYear = new Date().getFullYear();
const years = [currentYear - 1, currentYear, currentYear + 1];
const paymentMethods: ReceiptFormData['paymentMethod'][] = ['Venmo', 'Zelle', 'Cash', 'Check', 'Other'];
const semesters: ReceiptFormData['semester'][] = ['Fall', 'Spring', 'Summer'];

const inputBase =
  'w-full px-3.5 py-2.5 rounded-lg border text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-colors bg-white';
const inputNormal = `${inputBase} border-slate-200 focus:border-[#1B3A6B] focus:ring-[#1B3A6B]/10`;
const inputError = `${inputBase} border-red-300 bg-red-50 focus:border-red-400 focus:ring-red-100`;

export function ReceiptForm() {
  const router = useRouter();
  const [errors, setErrors] = useState<Partial<Record<keyof ReceiptFormData, string>>>({});
  const [form, setForm] = useState<ReceiptFormData>({
    submittedBy: '',
    email: '',
    expenseDescription: '',
    amountPaid: '',
    paymentMethod: 'Cash',
    semester: 'Spring',
    year: String(currentYear),
    expenseDate: new Date().toISOString().split('T')[0],
    processedBy: '',
  });

  function validate(): boolean {
    const e: Partial<Record<keyof ReceiptFormData, string>> = {};
    if (!form.submittedBy.trim()) e.submittedBy = 'Required';
    if (!form.email.trim()) {
      e.email = 'Required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      e.email = 'Enter a valid email';
    }
    if (!form.expenseDescription.trim()) e.expenseDescription = 'Required';
    if (!form.amountPaid) {
      e.amountPaid = 'Required';
    } else if (isNaN(parseFloat(form.amountPaid)) || parseFloat(form.amountPaid) <= 0) {
      e.amountPaid = 'Enter an amount greater than $0';
    }
    if (!form.expenseDate) e.expenseDate = 'Required';
    if (!form.processedBy.trim()) e.processedBy = 'Required';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof ReceiptFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    const params = new URLSearchParams(form as unknown as Record<string, string>);
    router.push(`/preview?${params.toString()}`);
  }

  const label = (text: string, required = true) => (
    <label className="block text-sm font-medium text-slate-700 mb-1.5">
      {text}
      {required && <span className="text-red-400 ml-0.5">*</span>}
    </label>
  );

  const errorMsg = (field: keyof ReceiptFormData) =>
    errors[field] ? (
      <p className="mt-1.5 text-xs text-red-500">{errors[field]}</p>
    ) : null;

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">

      {/* Row: Reimbursed To + Email */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          {label('Reimbursed To')}
          <input
            id="submittedBy" name="submittedBy" type="text"
            value={form.submittedBy} onChange={handleChange}
            placeholder="Full name"
            className={errors.submittedBy ? inputError : inputNormal}
          />
          {errorMsg('submittedBy')}
        </div>
        <div>
          {label('Member Email')}
          <input
            id="email" name="email" type="email"
            value={form.email} onChange={handleChange}
            placeholder="Email address"
            className={errors.email ? inputError : inputNormal}
          />
          {errorMsg('email')}
        </div>
      </div>

      {/* Expense Description */}
      <div>
        {label('Expense Description')}
        <textarea
          id="expenseDescription" name="expenseDescription" rows={3}
          value={form.expenseDescription} onChange={handleChange}
          placeholder="Describe the expense and reason for reimbursement — e.g. Supplies for Fall Rush event (decorations and printing)"
          className={`resize-none ${errors.expenseDescription ? inputError : inputNormal}`}
        />
        {errorMsg('expenseDescription')}
      </div>

      {/* Row: Amount + Payment Method */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          {label('Expense Amount')}
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm select-none">$</span>
            <input
              id="amountPaid" name="amountPaid" type="number"
              min="0.01" step="0.01"
              value={form.amountPaid} onChange={handleChange}
              placeholder="0.00"
              className={`pl-7 ${errors.amountPaid ? inputError : inputNormal}`}
            />
          </div>
          {errorMsg('amountPaid')}
        </div>
        <div>
          {label('Payment Method')}
          <select
            id="paymentMethod" name="paymentMethod"
            value={form.paymentMethod} onChange={handleChange}
            className={inputNormal}
          >
            {paymentMethods.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
      </div>

      {/* Row: Semester + Year + Date */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          {label('Semester')}
          <select
            id="semester" name="semester"
            value={form.semester} onChange={handleChange}
            className={inputNormal}
          >
            {semesters.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          {label('Year')}
          <select
            id="year" name="year"
            value={form.year} onChange={handleChange}
            className={inputNormal}
          >
            {years.map(y => <option key={y} value={String(y)}>{y}</option>)}
          </select>
        </div>
        <div>
          {label('Expense Date')}
          <input
            id="expenseDate" name="expenseDate" type="date"
            value={form.expenseDate} onChange={handleChange}
            className={errors.expenseDate ? inputError : inputNormal}
          />
          {errorMsg('expenseDate')}
        </div>
      </div>

      {/* Processed By */}
      <div>
        {label('Processed By')}
        <input
          id="processedBy" name="processedBy" type="text"
          value={form.processedBy} onChange={handleChange}
          placeholder="Your name"
          className={errors.processedBy ? inputError : inputNormal}
        />
        {errorMsg('processedBy')}
      </div>

      {/* Divider */}
      <div className="pt-1 border-t border-slate-100" />

      <button
        type="submit"
        className="w-full py-2.5 px-6 bg-[#1B3A6B] hover:bg-[#142d54] active:bg-[#0f2240] text-white font-semibold rounded-lg transition-colors text-sm tracking-wide"
      >
        Preview Receipt →
      </button>
    </form>
  );
}

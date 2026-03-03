'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import type { ReceiptFormData } from '@/lib/types';

const currentYear = new Date().getFullYear();
const years = [currentYear - 1, currentYear, currentYear + 1];

const paymentMethods: ReceiptFormData['paymentMethod'][] = ['Venmo', 'Zelle', 'Cash', 'Check', 'Other'];
const semesters: ReceiptFormData['semester'][] = ['Fall', 'Spring', 'Summer'];

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
    const newErrors: Partial<Record<keyof ReceiptFormData, string>> = {};
    if (!form.submittedBy.trim()) newErrors.submittedBy = 'Member name is required';
    if (!form.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Enter a valid email address';
    }
    if (!form.expenseDescription.trim()) newErrors.expenseDescription = 'Expense description is required';
    if (!form.amountPaid) {
      newErrors.amountPaid = 'Amount is required';
    } else if (isNaN(parseFloat(form.amountPaid)) || parseFloat(form.amountPaid) <= 0) {
      newErrors.amountPaid = 'Enter a valid amount greater than $0';
    }
    if (!form.expenseDate) newErrors.expenseDate = 'Date is required';
    if (!form.processedBy.trim()) newErrors.processedBy = 'Processed by is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
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

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {/* Reimbursed To */}
      <div>
        <label htmlFor="submittedBy" className="block text-sm font-semibold text-gray-700 mb-1">
          Reimbursed To <span className="text-red-500">*</span>
        </label>
        <input
          id="submittedBy"
          name="submittedBy"
          type="text"
          value={form.submittedBy}
          onChange={handleChange}
          placeholder="Full name of member"
          className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#1B3A6B] transition ${
            errors.submittedBy ? 'border-red-400 bg-red-50' : 'border-gray-300'
          }`}
        />
        {errors.submittedBy && <p className="mt-1 text-xs text-red-600">{errors.submittedBy}</p>}
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1">
          Member Email <span className="text-red-500">*</span>
        </label>
        <input
          id="email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="member@sjsu.edu"
          className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#1B3A6B] transition ${
            errors.email ? 'border-red-400 bg-red-50' : 'border-gray-300'
          }`}
        />
        {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
      </div>

      {/* Expense Description */}
      <div>
        <label htmlFor="expenseDescription" className="block text-sm font-semibold text-gray-700 mb-1">
          Expense Description <span className="text-red-500">*</span>
        </label>
        <textarea
          id="expenseDescription"
          name="expenseDescription"
          rows={3}
          value={form.expenseDescription}
          onChange={handleChange}
          placeholder="Describe the expense and reason for reimbursement (e.g. Supplies for Fall Rush event — decorations and printing)"
          className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#1B3A6B] transition resize-none ${
            errors.expenseDescription ? 'border-red-400 bg-red-50' : 'border-gray-300'
          }`}
        />
        {errors.expenseDescription && <p className="mt-1 text-xs text-red-600">{errors.expenseDescription}</p>}
      </div>

      {/* Amount */}
      <div>
        <label htmlFor="amountPaid" className="block text-sm font-semibold text-gray-700 mb-1">
          Expense Amount <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
          <input
            id="amountPaid"
            name="amountPaid"
            type="number"
            min="0.01"
            step="0.01"
            value={form.amountPaid}
            onChange={handleChange}
            placeholder="0.00"
            className={`w-full pl-7 pr-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#1B3A6B] transition ${
              errors.amountPaid ? 'border-red-400 bg-red-50' : 'border-gray-300'
            }`}
          />
        </div>
        {errors.amountPaid && <p className="mt-1 text-xs text-red-600">{errors.amountPaid}</p>}
      </div>

      {/* Payment Method */}
      <div>
        <label htmlFor="paymentMethod" className="block text-sm font-semibold text-gray-700 mb-1">
          Payment Method <span className="text-red-500">*</span>
        </label>
        <select
          id="paymentMethod"
          name="paymentMethod"
          value={form.paymentMethod}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#1B3A6B] transition bg-white"
        >
          {paymentMethods.map(m => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
      </div>

      {/* Semester + Year */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="semester" className="block text-sm font-semibold text-gray-700 mb-1">
            Semester <span className="text-red-500">*</span>
          </label>
          <select
            id="semester"
            name="semester"
            value={form.semester}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#1B3A6B] transition bg-white"
          >
            {semesters.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="year" className="block text-sm font-semibold text-gray-700 mb-1">
            Year <span className="text-red-500">*</span>
          </label>
          <select
            id="year"
            name="year"
            value={form.year}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#1B3A6B] transition bg-white"
          >
            {years.map(y => (
              <option key={y} value={String(y)}>{y}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Expense Date */}
      <div>
        <label htmlFor="expenseDate" className="block text-sm font-semibold text-gray-700 mb-1">
          Expense Date <span className="text-red-500">*</span>
        </label>
        <input
          id="expenseDate"
          name="expenseDate"
          type="date"
          value={form.expenseDate}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#1B3A6B] transition ${
            errors.expenseDate ? 'border-red-400 bg-red-50' : 'border-gray-300'
          }`}
        />
        {errors.expenseDate && <p className="mt-1 text-xs text-red-600">{errors.expenseDate}</p>}
      </div>

      {/* Processed By */}
      <div>
        <label htmlFor="processedBy" className="block text-sm font-semibold text-gray-700 mb-1">
          Processed By <span className="text-red-500">*</span>
        </label>
        <input
          id="processedBy"
          name="processedBy"
          type="text"
          value={form.processedBy}
          onChange={handleChange}
          placeholder="VP Finance name"
          className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#1B3A6B] transition ${
            errors.processedBy ? 'border-red-400 bg-red-50' : 'border-gray-300'
          }`}
        />
        {errors.processedBy && <p className="mt-1 text-xs text-red-600">{errors.processedBy}</p>}
      </div>

      <button
        type="submit"
        className="w-full py-3 px-6 bg-[#1B3A6B] hover:bg-[#14305A] text-white font-semibold rounded-md transition text-sm tracking-wide shadow-sm"
      >
        Preview Receipt →
      </button>
    </form>
  );
}

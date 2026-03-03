export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { renderToBuffer } from '@react-pdf/renderer';
import React from 'react';
import { ReceiptDocument } from '@/lib/pdf/ReceiptDocument';
import { sendReceiptEmail } from '@/lib/email/sendReceiptEmail';
import { getSupabase } from '@/lib/db/supabaseClient';
import type { ReceiptFormData } from '@/lib/types';

export async function POST(request: NextRequest) {
  let data: ReceiptFormData;

  try {
    data = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  // Validate required fields
  const required: (keyof ReceiptFormData)[] = [
    'submittedBy', 'email', 'expenseDescription', 'amountPaid',
    'paymentMethod', 'semester', 'year', 'expenseDate', 'processedBy',
  ];
  for (const field of required) {
    if (!data[field]) {
      return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 });
    }
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
  }

  const amount = parseFloat(data.amountPaid);
  if (isNaN(amount) || amount <= 0) {
    return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
  }

  // Generate receipt number from Supabase count
  let receiptNumber: string;
  try {
    const { count, error } = await getSupabase()
      .from('receipts')
      .select('*', { count: 'exact', head: true });

    if (error) throw error;
    const nextNum = (count ?? 0) + 1;
    receiptNumber = `AKPSI-${data.year}-${String(nextNum).padStart(4, '0')}`;
  } catch (err) {
    console.error('Supabase count error:', err);
    receiptNumber = `AKPSI-${data.year}-${Date.now().toString().slice(-6)}`;
  }

  // Generate PDF
  let pdfBuffer: Buffer;
  try {
    // @ts-ignore — renderToBuffer types expect DocumentProps but our component is valid
    pdfBuffer = await renderToBuffer(
      React.createElement(ReceiptDocument, { data, receiptNumber }) as any
    );
  } catch (err) {
    console.error('PDF generation error:', err);
    return NextResponse.json({ error: 'Failed to generate PDF' }, { status: 500 });
  }

  // Send email
  let emailId: string;
  try {
    emailId = await sendReceiptEmail(data, pdfBuffer, receiptNumber);
  } catch (err) {
    console.error('Email send error:', err);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }

  const sentAt = new Date().toISOString();

  // Log to Supabase — non-blocking
  getSupabase()
    .from('receipts')
    .insert({
      receipt_number: receiptNumber,
      submitted_by: data.submittedBy,
      email: data.email,
      expense_description: data.expenseDescription,
      amount_paid: amount,
      payment_method: data.paymentMethod,
      semester: data.semester,
      year: parseInt(data.year),
      expense_date: data.expenseDate,
      processed_by: data.processedBy,
      sent_at: sentAt,
      resend_message_id: emailId,
    })
    .then(({ error }) => {
      if (error) console.error('Supabase insert error (non-fatal):', error);
    });

  return NextResponse.json({ success: true, receiptNumber, sentAt, emailId });
}

export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { renderToBuffer } from '@react-pdf/renderer';
import React from 'react';
import { ReceiptDocument } from '@/lib/pdf/ReceiptDocument';
import { getSupabase } from '@/lib/db/supabaseClient';
import type { ReceiptFormData } from '@/lib/types';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const data: ReceiptFormData = {
    submittedBy: searchParams.get('submittedBy') ?? '',
    email: searchParams.get('email') ?? '',
    expenseDescription: searchParams.get('expenseDescription') ?? '',
    amountPaid: searchParams.get('amountPaid') ?? '0',
    paymentMethod: (searchParams.get('paymentMethod') ?? 'Cash') as ReceiptFormData['paymentMethod'],
    semester: (searchParams.get('semester') ?? 'Spring') as ReceiptFormData['semester'],
    year: searchParams.get('year') ?? String(new Date().getFullYear()),
    expenseDate: searchParams.get('expenseDate') ?? new Date().toISOString().split('T')[0],
    processedBy: searchParams.get('processedBy') ?? '',
  };

  let receiptNumber: string;
  try {
    const { count, error } = await getSupabase()
      .from('receipts')
      .select('*', { count: 'exact', head: true });

    if (error) throw error;
    const nextNum = (count ?? 0) + 1;
    receiptNumber = `AKPSI-${data.year}-${String(nextNum).padStart(4, '0')}`;
  } catch (err) {
    console.error('Supabase count error in preview:', err);
    receiptNumber = `AKPSI-${data.year}-PREVIEW`;
  }

  try {
    // @ts-ignore — renderToBuffer types expect DocumentProps but our component is valid
    const pdfBuffer = await renderToBuffer(
      React.createElement(ReceiptDocument, { data, receiptNumber }) as any
    );

    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'inline; filename="receipt-preview.pdf"',
        'Cache-Control': 'no-store',
      },
    });
  } catch (err) {
    console.error('PDF preview error:', err);
    return NextResponse.json({ error: 'Failed to generate PDF preview' }, { status: 500 });
  }
}

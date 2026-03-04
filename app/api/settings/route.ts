export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { getEmailTemplate, setEmailTemplate } from '@/lib/db/settings';

export async function GET() {
  const template = await getEmailTemplate();
  return NextResponse.json({ template });
}

export async function POST(request: NextRequest) {
  const { template } = await request.json();
  if (typeof template !== 'string' || !template.trim()) {
    return NextResponse.json({ error: 'Template cannot be empty' }, { status: 400 });
  }
  await setEmailTemplate(template.trim());
  return NextResponse.json({ success: true });
}

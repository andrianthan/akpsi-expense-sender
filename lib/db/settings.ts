import { getSupabase } from './supabaseClient';

const EMAIL_TEMPLATE_KEY = 'email_message_template';
const DEFAULT_TEMPLATE =
  'Your expense reimbursement request has been approved and processed. Please find your official receipt attached as a PDF.';

export async function getEmailTemplate(): Promise<string> {
  try {
    const { data, error } = await getSupabase()
      .from('settings')
      .select('value')
      .eq('key', EMAIL_TEMPLATE_KEY)
      .single();

    if (error || !data) return DEFAULT_TEMPLATE;
    return data.value;
  } catch {
    return DEFAULT_TEMPLATE;
  }
}

export async function setEmailTemplate(value: string): Promise<void> {
  const { error } = await getSupabase()
    .from('settings')
    .upsert({ key: EMAIL_TEMPLATE_KEY, value });

  if (error) throw new Error(`Failed to save template: ${error.message}`);
}

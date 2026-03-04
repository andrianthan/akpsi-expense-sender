import { Resend } from 'resend';
import type { ReceiptFormData } from '@/lib/types';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendReceiptEmail(
  data: ReceiptFormData,
  pdfBuffer: Buffer,
  receiptNumber: string
): Promise<string> {
  const formattedAmount = parseFloat(data.amountPaid).toFixed(2);
  const formattedDate = new Date(data.expenseDate + 'T00:00:00').toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:30px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="background:#1B3A6B;padding:28px 32px;text-align:center;">
              <p style="margin:0;color:#C9A84C;font-size:11px;font-weight:600;letter-spacing:3px;text-transform:uppercase;">Alpha Kappa Psi</p>
              <h1 style="margin:6px 0 2px;color:#ffffff;font-size:22px;font-weight:700;letter-spacing:1px;">Omega Phi Chapter — SJSU</h1>
              <p style="margin:0;color:#C9A84C;font-size:13px;letter-spacing:2px;text-transform:uppercase;">Expense Receipt</p>
            </td>
          </tr>
          <!-- Receipt Number Banner -->
          <tr>
            <td style="background:#FDF8EC;padding:12px 32px;border-bottom:1px solid #e8dfc8;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="color:#1B3A6B;font-size:13px;font-weight:600;">Receipt #: ${receiptNumber}</td>
                  <td align="right" style="color:#666;font-size:12px;">Issued: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Greeting -->
          <tr>
            <td style="padding:24px 32px 8px;">
              <p style="margin:0;color:#333;font-size:14px;line-height:1.6;">
                Dear <strong>${data.submittedBy}</strong>,
              </p>
              <p style="margin:10px 0 0;color:#555;font-size:14px;line-height:1.6;">
                ${data.personalMessage?.trim() || 'Your expense reimbursement request has been approved and processed. Please find your official receipt attached as a PDF.'}
              </p>
            </td>
          </tr>
          <!-- Receipt Details Table -->
          <tr>
            <td style="padding:16px 32px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e0e0e0;border-radius:6px;overflow:hidden;font-size:13px;">
                <tr style="background:#f9f9f9;">
                  <td style="padding:10px 16px;color:#666;font-weight:600;width:45%;border-bottom:1px solid #e0e0e0;">Reimbursed To</td>
                  <td style="padding:10px 16px;color:#333;border-bottom:1px solid #e0e0e0;">${data.submittedBy}</td>
                </tr>
                <tr>
                  <td style="padding:10px 16px;color:#666;font-weight:600;border-bottom:1px solid #e0e0e0;">Expense Description</td>
                  <td style="padding:10px 16px;color:#333;border-bottom:1px solid #e0e0e0;">${data.expenseDescription}</td>
                </tr>
                <tr style="background:#f9f9f9;">
                  <td style="padding:10px 16px;color:#666;font-weight:600;border-bottom:1px solid #e0e0e0;">Expense Amount</td>
                  <td style="padding:10px 16px;color:#1B3A6B;font-weight:700;font-size:15px;border-bottom:1px solid #e0e0e0;">$${formattedAmount}</td>
                </tr>
                <tr>
                  <td style="padding:10px 16px;color:#666;font-weight:600;border-bottom:1px solid #e0e0e0;">Payment Method</td>
                  <td style="padding:10px 16px;color:#333;border-bottom:1px solid #e0e0e0;">${data.paymentMethod}</td>
                </tr>
                <tr style="background:#f9f9f9;">
                  <td style="padding:10px 16px;color:#666;font-weight:600;border-bottom:1px solid #e0e0e0;">Semester / Year</td>
                  <td style="padding:10px 16px;color:#333;border-bottom:1px solid #e0e0e0;">${data.semester} ${data.year}</td>
                </tr>
                <tr>
                  <td style="padding:10px 16px;color:#666;font-weight:600;border-bottom:1px solid #e0e0e0;">Expense Date</td>
                  <td style="padding:10px 16px;color:#333;border-bottom:1px solid #e0e0e0;">${formattedDate}</td>
                </tr>
                <tr style="background:#f9f9f9;">
                  <td style="padding:10px 16px;color:#666;font-weight:600;">Processed By</td>
                  <td style="padding:10px 16px;color:#333;">${data.processedBy}</td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Note -->
          <tr>
            <td style="padding:8px 32px 24px;">
              <p style="margin:0;color:#555;font-size:13px;line-height:1.6;background:#FDF8EC;padding:12px 16px;border-left:3px solid #C9A84C;border-radius:0 4px 4px 0;">
                This receipt confirms reimbursement of an approved expense submitted to Alpha Kappa Psi Omega Phi Chapter at San José State University. Please retain this for your records.
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background:#1B3A6B;padding:16px 32px;text-align:center;">
              <p style="margin:0;color:#C9A84C;font-size:11px;letter-spacing:1px;">ALPHA KAPPA PSI · FOUNDED 1904</p>
              <p style="margin:4px 0 0;color:rgba(255,255,255,0.6);font-size:11px;">Omega Phi Chapter · San José State University</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  const { data: result, error } = await resend.emails.send({
    from: 'AKPSI Omega Phi <noreply@sjsuakpsi.com>',
    to: [data.email],
    subject: `AKPSI Expense Receipt — ${receiptNumber} (${data.semester} ${data.year})`,
    html: htmlBody,
    attachments: [
      {
        filename: `${receiptNumber}.pdf`,
        content: pdfBuffer,
      },
    ],
  });

  if (error) {
    throw new Error(`Failed to send email: ${error.message}`);
  }

  return result!.id;
}

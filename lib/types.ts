export interface ReceiptFormData {
  submittedBy: string;         // person being reimbursed
  email: string;
  expenseDescription: string;  // reason / purpose of the expense
  amountPaid: string;          // string from form, parsed to number when needed
  paymentMethod: 'Venmo' | 'Zelle' | 'Cash' | 'Check' | 'Other';
  semester: 'Fall' | 'Spring' | 'Summer';
  year: string;
  expenseDate: string;         // ISO date string YYYY-MM-DD
  processedBy: string;
}

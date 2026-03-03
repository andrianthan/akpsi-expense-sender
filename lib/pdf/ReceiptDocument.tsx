import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
} from '@react-pdf/renderer';
import fs from 'fs';
import path from 'path';
import type { ReceiptFormData } from '@/lib/types';

// Load logo as base64 at module load — @react-pdf/renderer cannot fetch /public during SSR
function loadLogoBase64(): string | null {
  try {
    const logoPath = path.join(process.cwd(), 'public', 'akp-logo.png');
    if (fs.existsSync(logoPath)) {
      const buffer = fs.readFileSync(logoPath);
      return `data:image/png;base64,${buffer.toString('base64')}`;
    }
  } catch {
    // Logo file not found — render without it
  }
  return null;
}

const logoBase64 = loadLogoBase64();

const NAVY = '#1B3A6B';
const GOLD = '#C9A84C';
const LIGHT_GOLD_BG = '#FDF8EC';
const LIGHT_BLUE_BG = '#F0F4FA';
const WHITE = '#FFFFFF';
const DARK_TEXT = '#1A1A1A';
const MEDIUM_TEXT = '#444444';
const BORDER = '#D0D8E8';

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    backgroundColor: WHITE,
    padding: 0,
  },
  // ── Logo Strip (white background so dark logo is visible) ────────────
  logoStrip: {
    backgroundColor: WHITE,
    paddingTop: 20,
    paddingBottom: 14,
    paddingLeft: 32,
    paddingRight: 32,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
  },
  logoImage: {
    width: 190,
    height: 52,
  },
  logoPlaceholder: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoPlaceholderBox: {
    width: 44,
    height: 44,
    backgroundColor: GOLD,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  logoPlaceholderGlyph: {
    color: NAVY,
    fontSize: 18,
    fontFamily: 'Helvetica-Bold',
  },
  logoPlaceholderText: {
    color: NAVY,
    fontSize: 15,
    fontFamily: 'Helvetica-Bold',
    letterSpacing: 0.5,
  },
  // ── Navy Title Banner ────────────────────────────────────────────────
  titleBanner: {
    backgroundColor: NAVY,
    paddingTop: 12,
    paddingBottom: 12,
    paddingLeft: 32,
    paddingRight: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleChapter: {
    color: WHITE,
    fontSize: 13,
    fontFamily: 'Helvetica-Bold',
    letterSpacing: 0.3,
  },
  titleType: {
    color: GOLD,
    fontSize: 9,
    letterSpacing: 2.5,
    textTransform: 'uppercase',
  },
  // ── Receipt Number Banner ─────────────────────────────────────────────
  receiptBanner: {
    backgroundColor: LIGHT_GOLD_BG,
    borderBottomWidth: 1,
    borderBottomColor: '#E0D4A8',
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 32,
    paddingRight: 32,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  receiptNumber: {
    color: NAVY,
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    letterSpacing: 0.5,
  },
  receiptIssued: {
    color: MEDIUM_TEXT,
    fontSize: 9,
  },
  // ── Body ─────────────────────────────────────────────────────────────
  body: {
    paddingTop: 20,
    paddingBottom: 20,
    paddingLeft: 32,
    paddingRight: 32,
  },
  // ── Details Table ─────────────────────────────────────────────────────
  table: {
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 4,
    overflow: 'hidden',
    marginTop: 8,
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  rowEven: {
    backgroundColor: LIGHT_BLUE_BG,
  },
  rowOdd: {
    backgroundColor: WHITE,
  },
  rowLast: {
    borderBottomWidth: 0,
  },
  cellLabel: {
    width: '38%',
    paddingTop: 9,
    paddingBottom: 9,
    paddingLeft: 14,
    paddingRight: 14,
    color: MEDIUM_TEXT,
    fontSize: 9.5,
    fontFamily: 'Helvetica-Bold',
  },
  cellValue: {
    flex: 1,
    paddingTop: 9,
    paddingBottom: 9,
    paddingLeft: 14,
    paddingRight: 14,
    color: DARK_TEXT,
    fontSize: 9.5,
  },
  cellValueAmount: {
    flex: 1,
    paddingTop: 9,
    paddingBottom: 9,
    paddingLeft: 14,
    paddingRight: 14,
    color: NAVY,
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
  },
  // ── Confirmation Note ─────────────────────────────────────────────────
  note: {
    marginTop: 20,
    backgroundColor: LIGHT_GOLD_BG,
    borderLeftWidth: 3,
    borderLeftColor: GOLD,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 14,
    paddingRight: 14,
    borderRadius: 2,
  },
  noteText: {
    color: MEDIUM_TEXT,
    fontSize: 9,
    lineHeight: 1.6,
  },
  // ── Footer ────────────────────────────────────────────────────────────
  footer: {
    marginTop: 'auto',
    backgroundColor: NAVY,
    paddingTop: 14,
    paddingBottom: 14,
    paddingLeft: 32,
    paddingRight: 32,
    alignItems: 'center',
  },
  footerGoldBar: {
    height: 4,
    backgroundColor: GOLD,
    marginBottom: 12,
  },
  footerText: {
    color: GOLD,
    fontSize: 8.5,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 3,
  },
  footerSubText: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 8,
    letterSpacing: 0.5,
  },
});

interface Props {
  data: ReceiptFormData;
  receiptNumber: string;
}

function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function formatAmount(amount: string): string {
  return `$${parseFloat(amount).toFixed(2)}`;
}

function formatIssued(): string {
  return new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

type FieldKey = keyof ReceiptFormData | 'semYear';
const tableRows: Array<{ label: string; field: FieldKey; isAmount?: boolean }> = [
  { label: 'Reimbursed To', field: 'submittedBy' },
  { label: 'Email', field: 'email' },
  { label: 'Expense Description', field: 'expenseDescription' },
  { label: 'Expense Amount', field: 'amountPaid', isAmount: true },
  { label: 'Payment Method', field: 'paymentMethod' },
  { label: 'Semester / Year', field: 'semYear' },
  { label: 'Expense Date', field: 'expenseDate' },
  { label: 'Processed By', field: 'processedBy' },
];

export function ReceiptDocument({ data, receiptNumber }: Props) {
  function getCellValue(field: FieldKey, isAmount?: boolean): string {
    if (field === 'semYear') return `${data.semester} ${data.year}`;
    if (field === 'amountPaid' && isAmount) return formatAmount(data.amountPaid);
    if (field === 'expenseDate') return formatDate(data.expenseDate);
    return data[field as keyof ReceiptFormData] as string;
  }

  return (
    <Document title={`AKPSI Expense Receipt — ${receiptNumber}`} author="Alpha Kappa Psi Omega Phi">
      <Page size="A4" style={styles.page}>

        {/* ── Logo Strip ── */}
        <View style={styles.logoStrip}>
          {logoBase64 ? (
            // eslint-disable-next-line jsx-a11y/alt-text
            <Image src={logoBase64} style={styles.logoImage} />
          ) : (
            <View style={styles.logoPlaceholder}>
              <View style={styles.logoPlaceholderBox}>
                <Text style={styles.logoPlaceholderGlyph}>ΑΚΨ</Text>
              </View>
              <Text style={styles.logoPlaceholderText}>ALPHA KAPPA PSI</Text>
            </View>
          )}
        </View>

        {/* ── Navy Title Banner ── */}
        <View style={styles.titleBanner}>
          <Text style={styles.titleChapter}>Omega Phi Chapter — SJSU</Text>
          <Text style={styles.titleType}>Expense Receipt</Text>
        </View>

        {/* ── Receipt Number Banner ── */}
        <View style={styles.receiptBanner}>
          <Text style={styles.receiptNumber}>Receipt #: {receiptNumber}</Text>
          <Text style={styles.receiptIssued}>Issued: {formatIssued()}</Text>
        </View>

        {/* ── Body ── */}
        <View style={styles.body}>
          <View style={styles.table}>
            {tableRows.map((row, i) => {
              const isLast = i === tableRows.length - 1;
              const isEven = i % 2 === 0;
              return (
                <View
                  key={row.field}
                  style={[
                    styles.row,
                    isEven ? styles.rowEven : styles.rowOdd,
                    isLast ? styles.rowLast : {},
                  ]}
                >
                  <Text style={styles.cellLabel}>{row.label}</Text>
                  <Text style={row.isAmount ? styles.cellValueAmount : styles.cellValue}>
                    {getCellValue(row.field, row.isAmount)}
                  </Text>
                </View>
              );
            })}
          </View>

          {/* Reimbursement Note */}
          <View style={styles.note}>
            <Text style={styles.noteText}>
              This receipt confirms reimbursement of an approved expense submitted to Alpha Kappa Psi
              Omega Phi Chapter at San José State University. Please retain this document for your records.
            </Text>
          </View>
        </View>

        {/* ── Footer ── */}
        <View style={styles.footer} fixed>
          <View style={styles.footerGoldBar} />
          <Text style={styles.footerText}>Alpha Kappa Psi · Founded 1904</Text>
          <Text style={styles.footerSubText}>Omega Phi Chapter · San José State University</Text>
        </View>

      </Page>
    </Document>
  );
}

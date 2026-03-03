-- Run this in your Supabase SQL editor (Dashboard > SQL Editor)

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE receipts (
  id                  UUID          PRIMARY KEY DEFAULT uuid_generate_v4(),
  receipt_number      TEXT          NOT NULL UNIQUE,
  submitted_by        TEXT          NOT NULL,
  email               TEXT          NOT NULL,
  expense_description TEXT          NOT NULL,
  amount_paid         NUMERIC(8,2)  NOT NULL,
  payment_method      TEXT          NOT NULL CHECK (payment_method IN ('Venmo','Zelle','Cash','Check','Other')),
  semester            TEXT          NOT NULL CHECK (semester IN ('Fall','Spring','Summer')),
  year                INTEGER       NOT NULL,
  expense_date        DATE          NOT NULL,
  processed_by        TEXT          NOT NULL,
  sent_at             TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  resend_message_id   TEXT,
  created_at          TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- Row Level Security: block all public access (service role bypasses RLS)
ALTER TABLE receipts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service_role_only" ON receipts USING (false) WITH CHECK (false);

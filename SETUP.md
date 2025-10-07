# PayLance Invoice Generator - Setup Guide

## Overview

PayLance is an AI-powered invoice generator built with React, Vite, and Supabase. It allows users to create professional invoices by simply describing them in plain English.

## Features

- AI-powered invoice generation using Claude
- Beautiful, modern UI with WebGL shader effects
- Real-time invoice preview and editing
- Dashboard for managing invoices
- Client and item autocomplete with localStorage
- PDF-ready print formatting
- Multiple currency support
- Status tracking (draft, sent, paid, overdue)

## Tech Stack

- **Frontend:** React 18, Vite
- **Styling:** Tailwind CSS, Framer Motion
- **Database:** Supabase (PostgreSQL)
- **AI:** Anthropic Claude API
- **Date handling:** date-fns
- **Icons:** Lucide React

## Setup Instructions

### 1. Environment Variables

Create a `.env` file with the following variables:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_ANTHROPIC_API_KEY=your_anthropic_api_key
```

### 2. Database Setup

You need to set up the Supabase database with the following table:

```sql
CREATE TABLE IF NOT EXISTS invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number text NOT NULL,
  client_name text NOT NULL,
  client_email text,
  client_address text,
  invoice_date date NOT NULL,
  due_date date,
  currency text DEFAULT 'USD',
  status text DEFAULT 'draft',
  items jsonb NOT NULL DEFAULT '[]'::jsonb,
  subtotal numeric(10, 2) DEFAULT 0,
  tax_rate numeric(5, 2) DEFAULT 0,
  tax_amount numeric(10, 2) DEFAULT 0,
  surcharges jsonb DEFAULT '[]'::jsonb,
  total numeric(10, 2) NOT NULL,
  notes text,
  payment_terms text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (demo purposes)
CREATE POLICY "Allow public read access to invoices"
  ON invoices FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Allow public insert access to invoices"
  ON invoices FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "Allow public update access to invoices"
  ON invoices FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow public delete access to invoices"
  ON invoices FOR DELETE TO anon, authenticated USING (true);

-- Create indexes
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_invoices_invoice_date ON invoices(invoice_date);
CREATE INDEX idx_invoices_created_at ON invoices(created_at);
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Development

```bash
npm run dev
```

### 5. Build for Production

```bash
npm run build
```

## Project Structure

```
src/
├── components/
│   ├── ui/              # Reusable UI components
│   └── invoice/         # Invoice-specific components
├── entities/            # Data models
├── integrations/        # External API integrations
├── lib/                 # Utility functions
├── pages/              # Page components
├── App.jsx             # Main app component
├── Layout.jsx          # Layout wrapper
└── main.jsx            # App entry point
```

## Key Components

- **Landing Page:** Hero section with AI capabilities showcase
- **Generator:** AI-powered invoice creation from natural language
- **Dashboard:** Invoice management and status tracking
- **Invoice Preview:** Print-ready invoice display
- **Invoice Edit:** Manual invoice creation/editing

## Usage

1. Visit the landing page
2. Click "Create Invoice"
3. Describe your invoice in plain English
4. AI generates a complete invoice
5. Edit if needed or save directly
6. View and manage all invoices from the dashboard

## Notes

- The app uses localStorage for client/item autocomplete
- Invoices are stored in Supabase PostgreSQL
- AI generation requires a valid Anthropic API key
- The demo uses public database access for simplicity

## License

MIT

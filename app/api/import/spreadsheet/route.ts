import { NextResponse } from 'next/server';
import * as XLSX from 'xlsx';
import { createClient } from '@/lib/supabase/server';
import { normalizeImportedRows } from '@/lib/imports';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'No file uploaded.' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const workbook = XLSX.read(bytes, { type: 'array' });
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    const rawRows = XLSX.utils.sheet_to_json<Record<string, unknown>>(worksheet, {
      defval: '',
      raw: true,
    });

    const rows = normalizeImportedRows(rawRows);

    return NextResponse.json({ rows });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to parse spreadsheet.' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const body = await request.json();
    const rows = Array.isArray(body.rows) ? body.rows : [];

    type Row = {
      dash_date?: string;
      driver_name?: string;
      gross_amount?: number | string;
      start_time?: string;
      end_time?: string;
      start_odometer?: number | string;
      end_odometer?: number | string;
      tax_rate?: number | string;
      extra_holdback_label?: string;
      extra_holdback_percent?: number | string;
      payout_account?: string;
      payout_note?: string;
      notes?: string;
    };
    const payload = rows.map((row: Row) => {
      const gross = Number(row.gross_amount || 0);
      const taxRate = Number(row.tax_rate || 0);
      const extraPct = Number(row.extra_holdback_percent || 0);
      const taxAmount = Number((gross * (taxRate / 100)).toFixed(2));
      const extraAmount = Number((gross * (extraPct / 100)).toFixed(2));
      const netAmount = Number((gross - taxAmount - extraAmount).toFixed(2));

      return {
        user_id: user.id,
        dash_date: row.dash_date,
        driver_name: row.driver_name || null,
        gross_amount: gross,
        start_time: row.start_time || null,
        end_time: row.end_time || null,
        start_odometer: row.start_odometer ?? null,
        end_odometer: row.end_odometer ?? null,
        tax_rate: taxRate,
        tax_amount: taxAmount,
        extra_holdback_label: row.extra_holdback_label || 'Car maintenance',
        extra_holdback_percent: extraPct,
        extra_holdback_amount: extraAmount,
        net_amount: netAmount,
        payout_account: row.payout_account || null,
        payout_note: row.payout_note || null,
        notes: row.notes || null,
      };
    });

    const { error } = await supabase.from('dashes').insert(payload);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, count: payload.length });
  } catch {
    return NextResponse.json({ error: 'Failed to import rows.' }, { status: 500 });
  }
}
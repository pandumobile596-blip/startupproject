import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

function toCSV(headers: string[], rows: (string | number | null | undefined)[][]): string {
  const escape = (v: string | number | null | undefined) => {
    const s = v === null || v === undefined ? "" : String(v);
    return s.includes(",") || s.includes('"') || s.includes("\n")
      ? `"${s.replace(/"/g, '""')}"`
      : s;
  };
  return [headers, ...rows].map((row) => row.map(escape).join(",")).join("\r\n");
}

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const type = request.nextUrl.searchParams.get("type");

  if (type === "rent-roll") {
    const { data: leases } = await supabase
      .from("leases")
      .select(`
        rent_amount, status, start_date, end_date, payment_due_day, security_deposit,
        tenants(first_name, last_name, email, phone),
        units(unit_number, properties(name, address_line1, city, state, zip))
      `)
      .eq("landlord_id", user.id)
      .order("status");

    const headers = [
      "Tenant Name", "Email", "Phone",
      "Property", "Address", "City", "State", "ZIP", "Unit",
      "Status", "Rent/mo", "Security Deposit", "Due Day", "Start Date", "End Date",
    ];

    const rows = (leases ?? []).map((l) => {
      const t = l.tenants as { first_name: string; last_name: string; email: string; phone: string | null } | null;
      const u = l.units as {
        unit_number: string;
        properties: { name: string; address_line1: string; city: string; state: string; zip: string } | null;
      } | null;
      return [
        t ? `${t.first_name} ${t.last_name}` : "",
        t?.email ?? "",
        t?.phone ?? "",
        u?.properties?.name ?? "",
        u?.properties?.address_line1 ?? "",
        u?.properties?.city ?? "",
        u?.properties?.state ?? "",
        u?.properties?.zip ?? "",
        u?.unit_number ?? "",
        l.status,
        l.rent_amount,
        l.security_deposit,
        l.payment_due_day,
        l.start_date,
        l.end_date ?? "Month-to-month",
      ];
    });

    const csv = toCSV(headers, rows);
    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="rent-roll-${new Date().getFullYear()}.csv"`,
      },
    });
  }

  if (type === "expenses") {
    const currentYear = new Date().getFullYear();
    const { data: expenses } = await supabase
      .from("expenses")
      .select("category, amount, expense_date, vendor_name, description, is_tax_deductible, tax_year, properties(name)")
      .eq("landlord_id", user.id)
      .eq("tax_year", currentYear)
      .order("expense_date", { ascending: false });

    const headers = [
      "Date", "Category", "Description", "Vendor", "Property", "Amount", "Tax Deductible",
    ];

    const rows = (expenses ?? []).map((e) => {
      const prop = e.properties as { name: string } | null;
      return [
        e.expense_date,
        e.category,
        e.description,
        e.vendor_name ?? "",
        prop?.name ?? "",
        e.amount,
        e.is_tax_deductible ? "Yes" : "No",
      ];
    });

    const csv = toCSV(headers, rows);
    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="expenses-${currentYear}.csv"`,
      },
    });
  }

  return new NextResponse("Invalid export type", { status: 400 });
}

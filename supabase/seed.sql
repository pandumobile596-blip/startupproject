-- ============================================================
-- Landlord Ledger — Development Seed Data
-- Run: supabase db reset  (applies migrations + this seed)
-- ============================================================

-- NOTE: In a real project, create the seed user via Supabase Dashboard or
-- `supabase auth add-user` so a proper auth.users row exists first.
-- These UUIDs are fixed so foreign keys remain consistent across resets.

DO $$
DECLARE
  v_landlord_id  uuid := '00000000-0000-0000-0000-000000000001';
  v_property_id  uuid := '00000000-0000-0000-0000-000000000010';
  v_unit1_id     uuid := '00000000-0000-0000-0000-000000000020';
  v_unit2_id     uuid := '00000000-0000-0000-0000-000000000021';
  v_tenant_id    uuid := '00000000-0000-0000-0000-000000000030';
  v_lease_id     uuid := '00000000-0000-0000-0000-000000000040';
BEGIN

  -- Landlord profile (auth.users row must exist first)
  INSERT INTO landlords (id, full_name, email, business_name)
  VALUES (v_landlord_id, 'Dev Landlord', 'dev@landlordledger.test', 'Dev Properties LLC')
  ON CONFLICT (id) DO NOTHING;

  -- Property
  INSERT INTO properties (id, landlord_id, name, address_line1, city, state, zip, property_type, purchase_price, purchase_date)
  VALUES (v_property_id, v_landlord_id, 'Oak Street Duplex', '123 Oak Street', 'Austin', 'TX', '78701', 'multi_family', 450000.00, '2022-03-15')
  ON CONFLICT (id) DO NOTHING;

  -- Units
  INSERT INTO units (id, property_id, unit_number, bedrooms, bathrooms, square_feet, status, market_rent)
  VALUES
    (v_unit1_id, v_property_id, 'Unit A', 2, 1.0, 900, 'occupied', 1600.00),
    (v_unit2_id, v_property_id, 'Unit B', 2, 1.0, 950, 'vacant',   1650.00)
  ON CONFLICT (id) DO NOTHING;

  -- Tenant
  INSERT INTO tenants (id, landlord_id, first_name, last_name, email, phone)
  VALUES (v_tenant_id, v_landlord_id, 'Jane', 'Doe', 'jane.doe@example.com', '555-0100')
  ON CONFLICT (id) DO NOTHING;

  -- Lease
  INSERT INTO leases (id, unit_id, tenant_id, landlord_id, start_date, end_date, rent_amount, security_deposit, payment_due_day, grace_period_days, status)
  VALUES (v_lease_id, v_unit1_id, v_tenant_id, v_landlord_id, '2024-02-01', '2025-01-31', 1600.00, 1600.00, 1, 5, 'active')
  ON CONFLICT (id) DO NOTHING;

  -- Payments (last 3 months of rent)
  INSERT INTO payments (lease_id, landlord_id, tenant_id, amount, payment_date, due_date, payment_method, payment_type, status)
  VALUES
    (v_lease_id, v_landlord_id, v_tenant_id, 1600.00, '2026-01-01', '2026-01-01', 'check', 'rent', 'completed'),
    (v_lease_id, v_landlord_id, v_tenant_id, 1600.00, '2026-02-01', '2026-02-01', 'check', 'rent', 'completed'),
    (v_lease_id, v_landlord_id, v_tenant_id, 1600.00, '2026-03-03', '2026-03-01', 'check', 'rent', 'completed')
  ON CONFLICT DO NOTHING;

  -- Expenses (mix of categories)
  INSERT INTO expenses (landlord_id, property_id, category, amount, expense_date, vendor_name, description, is_tax_deductible)
  VALUES
    (v_landlord_id, v_property_id, 'mortgage',    1450.00, '2026-01-01', 'First National Bank', 'Monthly mortgage payment', true),
    (v_landlord_id, v_property_id, 'insurance',    175.00, '2026-01-15', 'State Farm',           'Landlord insurance premium', true),
    (v_landlord_id, v_property_id, 'maintenance',   85.00, '2026-02-10', 'Bob the Plumber',      'Fix kitchen faucet Unit A', true),
    (v_landlord_id, v_property_id, 'mortgage',    1450.00, '2026-02-01', 'First National Bank', 'Monthly mortgage payment', true),
    (v_landlord_id, v_property_id, 'advertising',   49.00, '2026-03-01', 'Zillow',               'Rental listing for Unit B', true),
    (v_landlord_id, v_property_id, 'mortgage',    1450.00, '2026-03-01', 'First National Bank', 'Monthly mortgage payment', true)
  ON CONFLICT DO NOTHING;

END $$;

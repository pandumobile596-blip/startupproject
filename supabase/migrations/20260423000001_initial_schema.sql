-- ============================================================
-- Landlord Ledger — Initial Schema
-- ============================================================

-- ── Enum types ───────────────────────────────────────────────────────────────

CREATE TYPE property_type AS ENUM (
  'single_family', 'multi_family', 'condo', 'commercial'
);

CREATE TYPE unit_status AS ENUM (
  'vacant', 'occupied', 'maintenance'
);

CREATE TYPE lease_status AS ENUM (
  'active', 'expired', 'terminated', 'pending'
);

CREATE TYPE late_fee_type AS ENUM (
  'flat', 'percentage'
);

CREATE TYPE payment_method AS ENUM (
  'ach', 'check', 'cash', 'other'
);

CREATE TYPE payment_type AS ENUM (
  'rent', 'security_deposit', 'late_fee', 'other'
);

CREATE TYPE payment_status AS ENUM (
  'pending', 'completed', 'failed', 'refunded'
);

CREATE TYPE expense_category AS ENUM (
  'mortgage', 'insurance', 'taxes', 'maintenance', 'repairs',
  'utilities', 'management', 'advertising', 'legal', 'other'
);

-- ── landlords ────────────────────────────────────────────────────────────────
-- Extends auth.users; created via trigger on signup.

CREATE TABLE landlords (
  id                        uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name                 text NOT NULL,
  email                     text NOT NULL,
  phone                     text,
  business_name             text,
  tax_id                    text,          -- EIN or SSN; encrypt at rest via Supabase Vault
  stripe_connect_account_id text,
  created_at                timestamptz NOT NULL DEFAULT now(),
  updated_at                timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE landlords ENABLE ROW LEVEL SECURITY;

CREATE POLICY "landlords: owner full access"
  ON landlords
  FOR ALL
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- ── properties ───────────────────────────────────────────────────────────────

CREATE TABLE properties (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  landlord_id     uuid NOT NULL REFERENCES landlords(id) ON DELETE CASCADE,
  name            text NOT NULL,
  address_line1   text NOT NULL,
  address_line2   text,
  city            text NOT NULL,
  state           char(2) NOT NULL,
  zip             text NOT NULL,
  property_type   property_type NOT NULL,
  purchase_price  numeric(12,2),
  purchase_date   date,
  mortgage_balance numeric(12,2),
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_properties_landlord_id ON properties (landlord_id);

ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

CREATE POLICY "properties: owner full access"
  ON properties
  FOR ALL
  USING (landlord_id = auth.uid())
  WITH CHECK (landlord_id = auth.uid());

-- ── units ────────────────────────────────────────────────────────────────────

CREATE TABLE units (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id  uuid NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  unit_number  text NOT NULL,
  bedrooms     smallint NOT NULL DEFAULT 0,
  bathrooms    numeric(3,1) NOT NULL DEFAULT 1,
  square_feet  integer,
  status       unit_status NOT NULL DEFAULT 'vacant',
  market_rent  numeric(8,2),
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_units_property_id ON units (property_id);

ALTER TABLE units ENABLE ROW LEVEL SECURITY;

-- Units are scoped via their property's landlord_id.
CREATE POLICY "units: owner full access"
  ON units
  FOR ALL
  USING (
    property_id IN (
      SELECT id FROM properties WHERE landlord_id = auth.uid()
    )
  )
  WITH CHECK (
    property_id IN (
      SELECT id FROM properties WHERE landlord_id = auth.uid()
    )
  );

-- ── tenants ──────────────────────────────────────────────────────────────────

CREATE TABLE tenants (
  id                      uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  landlord_id             uuid NOT NULL REFERENCES landlords(id) ON DELETE CASCADE,
  first_name              text NOT NULL,
  last_name               text NOT NULL,
  email                   text NOT NULL,
  phone                   text,
  emergency_contact_name  text,
  emergency_contact_phone text,
  stripe_customer_id      text,
  created_at              timestamptz NOT NULL DEFAULT now(),
  updated_at              timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_tenants_landlord_id ON tenants (landlord_id);

ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "tenants: owner full access"
  ON tenants
  FOR ALL
  USING (landlord_id = auth.uid())
  WITH CHECK (landlord_id = auth.uid());

-- ── leases ───────────────────────────────────────────────────────────────────

CREATE TABLE leases (
  id                      uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_id                 uuid NOT NULL REFERENCES units(id) ON DELETE RESTRICT,
  tenant_id               uuid NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
  landlord_id             uuid NOT NULL REFERENCES landlords(id) ON DELETE CASCADE,
  start_date              date NOT NULL,
  end_date                date,          -- NULL = month-to-month
  rent_amount             numeric(8,2) NOT NULL,
  security_deposit        numeric(8,2) NOT NULL DEFAULT 0,
  payment_due_day         smallint NOT NULL DEFAULT 1
                            CHECK (payment_due_day BETWEEN 1 AND 28),
  grace_period_days       smallint NOT NULL DEFAULT 5,
  late_fee_amount         numeric(8,2),
  late_fee_type           late_fee_type,
  status                  lease_status NOT NULL DEFAULT 'pending',
  stripe_subscription_id  text,
  notes                   text,
  created_at              timestamptz NOT NULL DEFAULT now(),
  updated_at              timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_leases_landlord_id ON leases (landlord_id);
CREATE INDEX idx_leases_unit_id     ON leases (unit_id);
CREATE INDEX idx_leases_tenant_id   ON leases (tenant_id);

ALTER TABLE leases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "leases: owner full access"
  ON leases
  FOR ALL
  USING (landlord_id = auth.uid())
  WITH CHECK (landlord_id = auth.uid());

-- ── payments ─────────────────────────────────────────────────────────────────

CREATE TABLE payments (
  id                        uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lease_id                  uuid NOT NULL REFERENCES leases(id) ON DELETE RESTRICT,
  landlord_id               uuid NOT NULL REFERENCES landlords(id) ON DELETE CASCADE,
  tenant_id                 uuid NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
  amount                    numeric(8,2) NOT NULL,
  payment_date              date NOT NULL,
  due_date                  date NOT NULL,
  payment_method            payment_method NOT NULL,
  payment_type              payment_type NOT NULL DEFAULT 'rent',
  status                    payment_status NOT NULL DEFAULT 'pending',
  stripe_payment_intent_id  text,
  notes                     text,
  created_at                timestamptz NOT NULL DEFAULT now(),
  updated_at                timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_payments_landlord_id ON payments (landlord_id);
CREATE INDEX idx_payments_lease_id    ON payments (lease_id);
CREATE INDEX idx_payments_tenant_id   ON payments (tenant_id);
CREATE INDEX idx_payments_status      ON payments (status);

ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "payments: owner full access"
  ON payments
  FOR ALL
  USING (landlord_id = auth.uid())
  WITH CHECK (landlord_id = auth.uid());

-- ── expenses ─────────────────────────────────────────────────────────────────

CREATE TABLE expenses (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  landlord_id       uuid NOT NULL REFERENCES landlords(id) ON DELETE CASCADE,
  property_id       uuid REFERENCES properties(id) ON DELETE SET NULL,
  unit_id           uuid REFERENCES units(id) ON DELETE SET NULL,
  category          expense_category NOT NULL,
  amount            numeric(10,2) NOT NULL,
  expense_date      date NOT NULL,
  vendor_name       text,
  description       text NOT NULL,
  receipt_url       text,
  is_tax_deductible boolean NOT NULL DEFAULT true,
  tax_year          smallint NOT NULL
                      GENERATED ALWAYS AS (EXTRACT(YEAR FROM expense_date)::smallint) STORED,
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_expenses_landlord_id   ON expenses (landlord_id);
CREATE INDEX idx_expenses_property_id   ON expenses (property_id);
CREATE INDEX idx_expenses_tax_year      ON expenses (tax_year);
CREATE INDEX idx_expenses_vendor_name   ON expenses (vendor_name) WHERE vendor_name IS NOT NULL;

ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "expenses: owner full access"
  ON expenses
  FOR ALL
  USING (landlord_id = auth.uid())
  WITH CHECK (landlord_id = auth.uid());

-- ── updated_at trigger ───────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_landlords_updated_at  BEFORE UPDATE ON landlords  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_properties_updated_at BEFORE UPDATE ON properties FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_units_updated_at      BEFORE UPDATE ON units      FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_tenants_updated_at    BEFORE UPDATE ON tenants    FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_leases_updated_at     BEFORE UPDATE ON leases     FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_payments_updated_at   BEFORE UPDATE ON payments   FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_expenses_updated_at   BEFORE UPDATE ON expenses   FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ── Auto-create landlord profile on signup ───────────────────────────────────
-- Fires after a new user is inserted into auth.users.
-- Reads full_name from user_metadata set during signUp() in the client.
-- Note: We only read full_name from metadata for profile creation, not for
-- authorization — authorization data always uses app_metadata.

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.landlords (id, full_name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NEW.email
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

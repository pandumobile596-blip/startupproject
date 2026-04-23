/**
 * Stub database types matching Supabase's generated format.
 * Replace with auto-generated output after running:
 *   supabase gen types typescript --local > types/database.ts
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      landlords: {
        Row: {
          id: string;
          full_name: string;
          email: string;
          phone: string | null;
          business_name: string | null;
          tax_id: string | null;
          stripe_connect_account_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name: string;
          email: string;
          phone?: string | null;
          business_name?: string | null;
          tax_id?: string | null;
          stripe_connect_account_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          full_name?: string;
          email?: string;
          phone?: string | null;
          business_name?: string | null;
          tax_id?: string | null;
          stripe_connect_account_id?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      properties: {
        Row: {
          id: string;
          landlord_id: string;
          name: string;
          address_line1: string;
          address_line2: string | null;
          city: string;
          state: string;
          zip: string;
          property_type: "single_family" | "multi_family" | "condo" | "commercial";
          purchase_price: number | null;
          purchase_date: string | null;
          mortgage_balance: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          landlord_id: string;
          name: string;
          address_line1: string;
          address_line2?: string | null;
          city: string;
          state: string;
          zip: string;
          property_type: "single_family" | "multi_family" | "condo" | "commercial";
          purchase_price?: number | null;
          purchase_date?: string | null;
          mortgage_balance?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          landlord_id?: string;
          name?: string;
          address_line1?: string;
          address_line2?: string | null;
          city?: string;
          state?: string;
          zip?: string;
          property_type?: "single_family" | "multi_family" | "condo" | "commercial";
          purchase_price?: number | null;
          purchase_date?: string | null;
          mortgage_balance?: number | null;
          updated_at?: string;
        };
        Relationships: [
          { foreignKeyName: "properties_landlord_id_fkey"; columns: ["landlord_id"]; referencedRelation: "landlords"; referencedColumns: ["id"] }
        ];
      };
      units: {
        Row: {
          id: string;
          property_id: string;
          unit_number: string;
          bedrooms: number;
          bathrooms: number;
          square_feet: number | null;
          status: "vacant" | "occupied" | "maintenance";
          market_rent: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          property_id: string;
          unit_number: string;
          bedrooms: number;
          bathrooms: number;
          square_feet?: number | null;
          status?: "vacant" | "occupied" | "maintenance";
          market_rent?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          property_id?: string;
          unit_number?: string;
          bedrooms?: number;
          bathrooms?: number;
          square_feet?: number | null;
          status?: "vacant" | "occupied" | "maintenance";
          market_rent?: number | null;
          updated_at?: string;
        };
        Relationships: [
          { foreignKeyName: "units_property_id_fkey"; columns: ["property_id"]; referencedRelation: "properties"; referencedColumns: ["id"] }
        ];
      };
      tenants: {
        Row: {
          id: string;
          landlord_id: string;
          first_name: string;
          last_name: string;
          email: string;
          phone: string | null;
          emergency_contact_name: string | null;
          emergency_contact_phone: string | null;
          stripe_customer_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          landlord_id: string;
          first_name: string;
          last_name: string;
          email: string;
          phone?: string | null;
          emergency_contact_name?: string | null;
          emergency_contact_phone?: string | null;
          stripe_customer_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          landlord_id?: string;
          first_name?: string;
          last_name?: string;
          email?: string;
          phone?: string | null;
          emergency_contact_name?: string | null;
          emergency_contact_phone?: string | null;
          stripe_customer_id?: string | null;
          updated_at?: string;
        };
        Relationships: [
          { foreignKeyName: "tenants_landlord_id_fkey"; columns: ["landlord_id"]; referencedRelation: "landlords"; referencedColumns: ["id"] }
        ];
      };
      leases: {
        Row: {
          id: string;
          unit_id: string;
          tenant_id: string;
          landlord_id: string;
          start_date: string;
          end_date: string | null;
          rent_amount: number;
          security_deposit: number;
          payment_due_day: number;
          grace_period_days: number;
          late_fee_amount: number | null;
          late_fee_type: "flat" | "percentage" | null;
          status: "active" | "expired" | "terminated" | "pending";
          stripe_subscription_id: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          unit_id: string;
          tenant_id: string;
          landlord_id: string;
          start_date: string;
          end_date?: string | null;
          rent_amount: number;
          security_deposit: number;
          payment_due_day: number;
          grace_period_days?: number;
          late_fee_amount?: number | null;
          late_fee_type?: "flat" | "percentage" | null;
          status?: "active" | "expired" | "terminated" | "pending";
          stripe_subscription_id?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          unit_id?: string;
          tenant_id?: string;
          landlord_id?: string;
          start_date?: string;
          end_date?: string | null;
          rent_amount?: number;
          security_deposit?: number;
          payment_due_day?: number;
          grace_period_days?: number;
          late_fee_amount?: number | null;
          late_fee_type?: "flat" | "percentage" | null;
          status?: "active" | "expired" | "terminated" | "pending";
          stripe_subscription_id?: string | null;
          notes?: string | null;
          updated_at?: string;
        };
        Relationships: [
          { foreignKeyName: "leases_landlord_id_fkey"; columns: ["landlord_id"]; referencedRelation: "landlords"; referencedColumns: ["id"] },
          { foreignKeyName: "leases_unit_id_fkey"; columns: ["unit_id"]; referencedRelation: "units"; referencedColumns: ["id"] },
          { foreignKeyName: "leases_tenant_id_fkey"; columns: ["tenant_id"]; referencedRelation: "tenants"; referencedColumns: ["id"] }
        ];
      };
      payments: {
        Row: {
          id: string;
          lease_id: string;
          landlord_id: string;
          tenant_id: string;
          amount: number;
          payment_date: string;
          due_date: string;
          payment_method: "ach" | "check" | "cash" | "other";
          payment_type: "rent" | "security_deposit" | "late_fee" | "other";
          status: "pending" | "completed" | "failed" | "refunded";
          stripe_payment_intent_id: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          lease_id: string;
          landlord_id: string;
          tenant_id: string;
          amount: number;
          payment_date: string;
          due_date: string;
          payment_method: "ach" | "check" | "cash" | "other";
          payment_type: "rent" | "security_deposit" | "late_fee" | "other";
          status?: "pending" | "completed" | "failed" | "refunded";
          stripe_payment_intent_id?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          lease_id?: string;
          landlord_id?: string;
          tenant_id?: string;
          amount?: number;
          payment_date?: string;
          due_date?: string;
          payment_method?: "ach" | "check" | "cash" | "other";
          payment_type?: "rent" | "security_deposit" | "late_fee" | "other";
          status?: "pending" | "completed" | "failed" | "refunded";
          stripe_payment_intent_id?: string | null;
          notes?: string | null;
          updated_at?: string;
        };
        Relationships: [
          { foreignKeyName: "payments_landlord_id_fkey"; columns: ["landlord_id"]; referencedRelation: "landlords"; referencedColumns: ["id"] },
          { foreignKeyName: "payments_lease_id_fkey"; columns: ["lease_id"]; referencedRelation: "leases"; referencedColumns: ["id"] },
          { foreignKeyName: "payments_tenant_id_fkey"; columns: ["tenant_id"]; referencedRelation: "tenants"; referencedColumns: ["id"] }
        ];
      };
      expenses: {
        Row: {
          id: string;
          landlord_id: string;
          property_id: string | null;
          unit_id: string | null;
          category:
            | "mortgage" | "insurance" | "taxes" | "maintenance" | "repairs"
            | "utilities" | "management" | "advertising" | "legal" | "other";
          amount: number;
          expense_date: string;
          vendor_name: string | null;
          description: string;
          receipt_url: string | null;
          is_tax_deductible: boolean;
          tax_year: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          landlord_id: string;
          property_id?: string | null;
          unit_id?: string | null;
          category:
            | "mortgage" | "insurance" | "taxes" | "maintenance" | "repairs"
            | "utilities" | "management" | "advertising" | "legal" | "other";
          amount: number;
          expense_date: string;
          vendor_name?: string | null;
          description: string;
          receipt_url?: string | null;
          is_tax_deductible?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          landlord_id?: string;
          property_id?: string | null;
          unit_id?: string | null;
          category?:
            | "mortgage" | "insurance" | "taxes" | "maintenance" | "repairs"
            | "utilities" | "management" | "advertising" | "legal" | "other";
          amount?: number;
          expense_date?: string;
          vendor_name?: string | null;
          description?: string;
          receipt_url?: string | null;
          is_tax_deductible?: boolean;
          updated_at?: string;
        };
        Relationships: [
          { foreignKeyName: "expenses_landlord_id_fkey"; columns: ["landlord_id"]; referencedRelation: "landlords"; referencedColumns: ["id"] },
          { foreignKeyName: "expenses_property_id_fkey"; columns: ["property_id"]; referencedRelation: "properties"; referencedColumns: ["id"] }
        ];
      };
    };
    Views: { [_ in never]: never };
    Functions: { [_ in never]: never };
    Enums: {
      property_type: "single_family" | "multi_family" | "condo" | "commercial";
      unit_status: "vacant" | "occupied" | "maintenance";
      lease_status: "active" | "expired" | "terminated" | "pending";
      late_fee_type: "flat" | "percentage";
      payment_method: "ach" | "check" | "cash" | "other";
      payment_type: "rent" | "security_deposit" | "late_fee" | "other";
      payment_status: "pending" | "completed" | "failed" | "refunded";
      expense_category:
        | "mortgage" | "insurance" | "taxes" | "maintenance" | "repairs"
        | "utilities" | "management" | "advertising" | "legal" | "other";
    };
    CompositeTypes: { [_ in never]: never };
  };
};

// Convenience row-type aliases
export type Landlord = Database["public"]["Tables"]["landlords"]["Row"];
export type Property = Database["public"]["Tables"]["properties"]["Row"];
export type Unit = Database["public"]["Tables"]["units"]["Row"];
export type Tenant = Database["public"]["Tables"]["tenants"]["Row"];
export type Lease = Database["public"]["Tables"]["leases"]["Row"];
export type Payment = Database["public"]["Tables"]["payments"]["Row"];
export type Expense = Database["public"]["Tables"]["expenses"]["Row"];

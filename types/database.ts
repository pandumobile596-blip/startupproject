/**
 * Auto-generated types from Supabase project qseliytareilgfkpjyok.
 * Regenerate with: npx supabase gen types typescript --project-id qseliytareilgfkpjyok
 *
 * Note: conversions, events, projects, sessions, users, visitors are
 * pre-existing tables in the Supabase project and are not used by Landlord Ledger.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      conversions: {
        Row: {
          created_at: string
          id: string
          session_id: string
          value: number
        }
        Insert: {
          created_at?: string
          id?: string
          session_id: string
          value?: number
        }
        Update: {
          created_at?: string
          id?: string
          session_id?: string
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "conversions_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          created_at: string
          id: string
          session_id: string
          type: string
        }
        Insert: {
          created_at?: string
          id?: string
          session_id: string
          type: string
        }
        Update: {
          created_at?: string
          id?: string
          session_id?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "events_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      expenses: {
        Row: {
          amount: number
          category: Database["public"]["Enums"]["expense_category"]
          created_at: string
          description: string
          expense_date: string
          id: string
          is_tax_deductible: boolean
          landlord_id: string
          property_id: string | null
          receipt_url: string | null
          tax_year: number
          unit_id: string | null
          updated_at: string
          vendor_name: string | null
        }
        Insert: {
          amount: number
          category: Database["public"]["Enums"]["expense_category"]
          created_at?: string
          description: string
          expense_date: string
          id?: string
          is_tax_deductible?: boolean
          landlord_id: string
          property_id?: string | null
          receipt_url?: string | null
          tax_year?: number
          unit_id?: string | null
          updated_at?: string
          vendor_name?: string | null
        }
        Update: {
          amount?: number
          category?: Database["public"]["Enums"]["expense_category"]
          created_at?: string
          description?: string
          expense_date?: string
          id?: string
          is_tax_deductible?: boolean
          landlord_id?: string
          property_id?: string | null
          receipt_url?: string | null
          tax_year?: number
          unit_id?: string | null
          updated_at?: string
          vendor_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "expenses_landlord_id_fkey"
            columns: ["landlord_id"]
            isOneToOne: false
            referencedRelation: "landlords"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expenses_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expenses_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
        ]
      }
      landlords: {
        Row: {
          business_name: string | null
          created_at: string
          email: string
          full_name: string
          id: string
          phone: string | null
          stripe_connect_account_id: string | null
          tax_id: string | null
          updated_at: string
        }
        Insert: {
          business_name?: string | null
          created_at?: string
          email: string
          full_name: string
          id: string
          phone?: string | null
          stripe_connect_account_id?: string | null
          tax_id?: string | null
          updated_at?: string
        }
        Update: {
          business_name?: string | null
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          phone?: string | null
          stripe_connect_account_id?: string | null
          tax_id?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      leases: {
        Row: {
          created_at: string
          end_date: string | null
          expected_rent_amount: number | null
          grace_period_days: number
          id: string
          landlord_id: string
          late_fee_amount: number | null
          late_fee_type: Database["public"]["Enums"]["late_fee_type"] | null
          notes: string | null
          payment_due_day: number
          rent_due_day: number | null
          rent_amount: number
          security_deposit: number
          start_date: string
          status: Database["public"]["Enums"]["lease_status"]
          stripe_subscription_id: string | null
          tenant_id: string
          unit_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          end_date?: string | null
          expected_rent_amount?: number | null
          grace_period_days?: number
          id?: string
          landlord_id: string
          late_fee_amount?: number | null
          late_fee_type?: Database["public"]["Enums"]["late_fee_type"] | null
          notes?: string | null
          payment_due_day?: number
          rent_due_day?: number | null
          rent_amount: number
          security_deposit?: number
          start_date: string
          status?: Database["public"]["Enums"]["lease_status"]
          stripe_subscription_id?: string | null
          tenant_id: string
          unit_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          end_date?: string | null
          expected_rent_amount?: number | null
          grace_period_days?: number
          id?: string
          landlord_id?: string
          late_fee_amount?: number | null
          late_fee_type?: Database["public"]["Enums"]["late_fee_type"] | null
          notes?: string | null
          payment_due_day?: number
          rent_due_day?: number | null
          rent_amount?: number
          security_deposit?: number
          start_date?: string
          status?: Database["public"]["Enums"]["lease_status"]
          stripe_subscription_id?: string | null
          tenant_id?: string
          unit_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "leases_landlord_id_fkey"
            columns: ["landlord_id"]
            isOneToOne: false
            referencedRelation: "landlords"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leases_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leases_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          created_at: string
          due_date: string
          id: string
          landlord_id: string
          lease_id: string
          notes: string | null
          payment_date: string
          payment_method: Database["public"]["Enums"]["payment_method"]
          payment_type: Database["public"]["Enums"]["payment_type"]
          status: Database["public"]["Enums"]["payment_status"]
          stripe_payment_intent_id: string | null
          tenant_id: string
          updated_at: string
        }
        Insert: {
          amount: number
          created_at?: string
          due_date: string
          id?: string
          landlord_id: string
          lease_id: string
          notes?: string | null
          payment_date: string
          payment_method: Database["public"]["Enums"]["payment_method"]
          payment_type?: Database["public"]["Enums"]["payment_type"]
          status?: Database["public"]["Enums"]["payment_status"]
          stripe_payment_intent_id?: string | null
          tenant_id: string
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          due_date?: string
          id?: string
          landlord_id?: string
          lease_id?: string
          notes?: string | null
          payment_date?: string
          payment_method?: Database["public"]["Enums"]["payment_method"]
          payment_type?: Database["public"]["Enums"]["payment_type"]
          status?: Database["public"]["Enums"]["payment_status"]
          stripe_payment_intent_id?: string | null
          tenant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_landlord_id_fkey"
            columns: ["landlord_id"]
            isOneToOne: false
            referencedRelation: "landlords"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_lease_id_fkey"
            columns: ["lease_id"]
            isOneToOne: false
            referencedRelation: "leases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          created_at: string
          domain: string
          id: string
          name: string
          user_id: string
        }
        Insert: {
          created_at?: string
          domain: string
          id?: string
          name: string
          user_id: string
        }
        Update: {
          created_at?: string
          domain?: string
          id?: string
          name?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "projects_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      properties: {
        Row: {
          address_line1: string
          address_line2: string | null
          city: string
          created_at: string
          id: string
          landlord_id: string
          mortgage_balance: number | null
          name: string
          property_type: Database["public"]["Enums"]["property_type"]
          purchase_date: string | null
          purchase_price: number | null
          state: string
          updated_at: string
          zip: string
        }
        Insert: {
          address_line1: string
          address_line2?: string | null
          city: string
          created_at?: string
          id?: string
          landlord_id: string
          mortgage_balance?: number | null
          name: string
          property_type: Database["public"]["Enums"]["property_type"]
          purchase_date?: string | null
          purchase_price?: number | null
          state: string
          updated_at?: string
          zip: string
        }
        Update: {
          address_line1?: string
          address_line2?: string | null
          city?: string
          created_at?: string
          id?: string
          landlord_id?: string
          mortgage_balance?: number | null
          name?: string
          property_type?: Database["public"]["Enums"]["property_type"]
          purchase_date?: string | null
          purchase_price?: number | null
          state?: string
          updated_at?: string
          zip?: string
        }
        Relationships: [
          {
            foreignKeyName: "properties_landlord_id_fkey"
            columns: ["landlord_id"]
            isOneToOne: false
            referencedRelation: "landlords"
            referencedColumns: ["id"]
          },
        ]
      }
      sessions: {
        Row: {
          campaign: string | null
          created_at: string
          id: string
          medium: string | null
          referrer: string | null
          source: string | null
          visitor_id: string
        }
        Insert: {
          campaign?: string | null
          created_at?: string
          id?: string
          medium?: string | null
          referrer?: string | null
          source?: string | null
          visitor_id: string
        }
        Update: {
          campaign?: string | null
          created_at?: string
          id?: string
          medium?: string | null
          referrer?: string | null
          source?: string | null
          visitor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sessions_visitor_id_fkey"
            columns: ["visitor_id"]
            isOneToOne: false
            referencedRelation: "visitors"
            referencedColumns: ["id"]
          },
        ]
      }
      tenants: {
        Row: {
          created_at: string
          email: string
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          first_name: string
          id: string
          landlord_id: string
          last_name: string
          phone: string | null
          stripe_customer_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          first_name: string
          id?: string
          landlord_id: string
          last_name: string
          phone?: string | null
          stripe_customer_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          first_name?: string
          id?: string
          landlord_id?: string
          last_name?: string
          phone?: string | null
          stripe_customer_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tenants_landlord_id_fkey"
            columns: ["landlord_id"]
            isOneToOne: false
            referencedRelation: "landlords"
            referencedColumns: ["id"]
          },
        ]
      }
      units: {
        Row: {
          bathrooms: number
          bedrooms: number
          created_at: string
          id: string
          market_rent: number | null
          property_id: string
          square_feet: number | null
          status: Database["public"]["Enums"]["unit_status"]
          unit_number: string
          updated_at: string
        }
        Insert: {
          bathrooms?: number
          bedrooms?: number
          created_at?: string
          id?: string
          market_rent?: number | null
          property_id: string
          square_feet?: number | null
          status?: Database["public"]["Enums"]["unit_status"]
          unit_number: string
          updated_at?: string
        }
        Update: {
          bathrooms?: number
          bedrooms?: number
          created_at?: string
          id?: string
          market_rent?: number | null
          property_id?: string
          square_feet?: number | null
          status?: Database["public"]["Enums"]["unit_status"]
          unit_number?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "units_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string
          email: string
          id: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
        }
        Relationships: []
      }
      visitors: {
        Row: {
          cookie_id: string
          created_at: string
          id: string
          project_id: string
        }
        Insert: {
          cookie_id: string
          created_at?: string
          id?: string
          project_id: string
        }
        Update: {
          cookie_id?: string
          created_at?: string
          id?: string
          project_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "visitors_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      expense_category:
        | "mortgage"
        | "insurance"
        | "taxes"
        | "maintenance"
        | "repairs"
        | "utilities"
        | "management"
        | "advertising"
        | "legal"
        | "other"
      late_fee_type: "flat" | "percentage"
      lease_status: "active" | "expired" | "terminated" | "pending"
      payment_method: "ach" | "check" | "cash" | "other"
      payment_status: "pending" | "completed" | "failed" | "refunded"
      payment_type: "rent" | "security_deposit" | "late_fee" | "other"
      property_type: "single_family" | "multi_family" | "condo" | "commercial"
      unit_status: "vacant" | "occupied" | "maintenance"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">
type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

// ── Convenience row-type aliases ──────────────────────────────────────────────
export type Landlord = Database["public"]["Tables"]["landlords"]["Row"]
export type Property = Database["public"]["Tables"]["properties"]["Row"]
export type Unit = Database["public"]["Tables"]["units"]["Row"]
export type Tenant = Database["public"]["Tables"]["tenants"]["Row"]
export type Lease = Database["public"]["Tables"]["leases"]["Row"]
export type Payment = Database["public"]["Tables"]["payments"]["Row"]
export type Expense = Database["public"]["Tables"]["expenses"]["Row"]

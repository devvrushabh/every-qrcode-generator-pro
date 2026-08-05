export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          user_id: string
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      folders: {
        Row: {
          id: string
          user_id: string
          name: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "folders_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      qr_codes: {
        Row: {
          id: string
          user_id: string
          folder_id: string | null
          name: string
          type: string
          mode: string
          payload: string
          configuration: Json
          image_url: string | null
          short_code: string | null
          scan_count: number
          status: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          folder_id?: string | null
          name: string
          type: string
          mode?: string
          payload: string
          configuration: Json
          image_url?: string | null
          short_code?: string | null
          scan_count?: number
          status?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          folder_id?: string | null
          name?: string
          type?: string
          mode?: string
          payload?: string
          configuration?: Json
          image_url?: string | null
          short_code?: string | null
          scan_count?: number
          status?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "qr_codes_folder_id_fkey"
            columns: ["folder_id"]
            referencedRelation: "folders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "qr_codes_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      qr_scans: {
        Row: {
          id: string
          qr_code_id: string
          scanned_at: string
          device_type: string | null
          browser: string | null
          os: string | null
          country: string | null
          city: string | null
          ip_address: string | null
        }
        Insert: {
          id?: string
          qr_code_id: string
          scanned_at?: string
          device_type?: string | null
          browser?: string | null
          os?: string | null
          country?: string | null
          city?: string | null
          ip_address?: string | null
        }
        Update: {
          id?: string
          qr_code_id?: string
          scanned_at?: string
          device_type?: string | null
          browser?: string | null
          os?: string | null
          country?: string | null
          city?: string | null
          ip_address?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "qr_scans_qr_code_id_fkey"
            columns: ["qr_code_id"]
            referencedRelation: "qr_codes"
            referencedColumns: ["id"]
          }
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
      [_ in never]: never
    }
  }
}

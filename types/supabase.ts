export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string | null
          role: string | null
          company: string | null
          bio: string | null
          image: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name?: string | null
          role?: string | null
          company?: string | null
          bio?: string | null
          image?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          role?: string | null
          company?: string | null
          bio?: string | null
          image?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      amazon_credentials: {
        Row: {
          id: string
          user_id: string
          client_id: string
          client_secret: string
          refresh_token: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          client_id: string
          client_secret: string
          refresh_token: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          client_id?: string
          client_secret?: string
          refresh_token?: string
          created_at?: string
          updated_at?: string
        }
      }
      reports: {
        Row: {
          id: string
          user_id: string
          name: string
          type: string
          format: string
          date_created: string
          size: string
          file_path: string | null
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          type: string
          format: string
          date_created?: string
          size: string
          file_path?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          type?: string
          format?: string
          date_created?: string
          size?: string
          file_path?: string | null
        }
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


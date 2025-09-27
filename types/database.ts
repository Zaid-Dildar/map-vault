export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };

      saved_places: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          address: string | null;
          latitude: number;
          longitude: number;
          url: string | null;
          visited_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          address?: string | null;
          latitude: number;
          longitude: number;
          url?: string | null;
          visited_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          address?: string | null;
          latitude?: number;
          longitude?: number;
          url?: string | null;
          visited_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "saved_places_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };

      place_lists: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "place_lists_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };

      export_jobs: {
        Row: {
          id: string;
          user_id: string;
          list_id: string | null;
          status: "pending" | "processing" | "completed" | "failed";
          format: "csv" | "txt";
          file_url: string | null;
          file_size: number | null;
          error_message: string | null;
          total_places: number | null;
          processed_places: number | null;
          created_at: string;
          completed_at: string | null;
        };
        Insert: {
          id?: string;
          user_id?: string;
          list_id?: string | null;
          status?: "pending" | "processing" | "completed" | "failed";
          format: "csv" | "txt";
          file_url?: string | null;
          file_size?: number | null;
          error_message?: string | null;
          total_places?: number | null;
          processed_places?: number | null;
          created_at?: string;
          completed_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          list_id?: string | null;
          status?: "pending" | "processing" | "completed" | "failed";
          format?: "csv" | "txt";
          file_url?: string | null;
          file_size?: number | null;
          error_message?: string | null;
          total_places?: number | null;
          processed_places?: number | null;
          created_at?: string;
          completed_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "export_jobs_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "export_jobs_list_id_fkey";
            columns: ["list_id"];
            isOneToOne: false;
            referencedRelation: "place_lists";
            referencedColumns: ["id"];
          }
        ];
      };
    };

    Views: {
      [_ in never]: never;
    };

    Functions: {
      [_ in never]: never;
    };

    Enums: {
      export_status: "pending" | "processing" | "completed" | "failed";
      export_format: "csv" | "txt";
    };

    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

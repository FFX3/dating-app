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
      availabilities: {
        Row: {
          end_friday: string | null
          end_monday: string | null
          end_saturday: string | null
          end_sunday: string | null
          end_thursday: string | null
          end_tuesday: string | null
          end_wednesday: string | null
          id: string
          item_id: string
          item_type: Database["public"]["Enums"]["has_availability"]
          start_friday: string | null
          start_monday: string | null
          start_saturday: string | null
          start_sunday: string | null
          start_thursday: string | null
          start_tuesday: string | null
          start_wednesday: string | null
        }
        Insert: {
          end_friday?: string | null
          end_monday?: string | null
          end_saturday?: string | null
          end_sunday?: string | null
          end_thursday?: string | null
          end_tuesday?: string | null
          end_wednesday?: string | null
          id?: string
          item_id: string
          item_type: Database["public"]["Enums"]["has_availability"]
          start_friday?: string | null
          start_monday?: string | null
          start_saturday?: string | null
          start_sunday?: string | null
          start_thursday?: string | null
          start_tuesday?: string | null
          start_wednesday?: string | null
        }
        Update: {
          end_friday?: string | null
          end_monday?: string | null
          end_saturday?: string | null
          end_sunday?: string | null
          end_thursday?: string | null
          end_tuesday?: string | null
          end_wednesday?: string | null
          id?: string
          item_id?: string
          item_type?: Database["public"]["Enums"]["has_availability"]
          start_friday?: string | null
          start_monday?: string | null
          start_saturday?: string | null
          start_sunday?: string | null
          start_thursday?: string | null
          start_tuesday?: string | null
          start_wednesday?: string | null
        }
        Relationships: []
      }
      availability_exceptions: {
        Row: {
          availability_id: string
          created_at: string
          end: string
          id: string
          start: string
        }
        Insert: {
          availability_id: string
          created_at?: string
          end: string
          id?: string
          start: string
        }
        Update: {
          availability_id?: string
          created_at?: string
          end?: string
          id?: string
          start?: string
        }
        Relationships: [
          {
            foreignKeyName: "availability_exceptions_availability_id_fkey"
            columns: ["availability_id"]
            isOneToOne: false
            referencedRelation: "availabilities"
            referencedColumns: ["id"]
          }
        ]
      }
      dates: {
        Row: {
          confirmed_by: string[] | null
          created_at: string
          experience_id: string
          id: string
          message_room_id: string
          start_time: string
        }
        Insert: {
          confirmed_by?: string[] | null
          created_at?: string
          experience_id: string
          id?: string
          message_room_id: string
          start_time: string
        }
        Update: {
          confirmed_by?: string[] | null
          created_at?: string
          experience_id?: string
          id?: string
          message_room_id?: string
          start_time?: string
        }
        Relationships: [
          {
            foreignKeyName: "dates_experience_id_fkey"
            columns: ["experience_id"]
            isOneToOne: false
            referencedRelation: "experiences"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dates_message_room_id_fkey"
            columns: ["message_room_id"]
            isOneToOne: false
            referencedRelation: "message_rooms"
            referencedColumns: ["id"]
          }
        ]
      }
      experiences: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string | null
        }
        Relationships: []
      }
      message_rooms: {
        Row: {
          created_at: string
          id: string
          members: string[]
        }
        Insert: {
          created_at?: string
          id?: string
          members: string[]
        }
        Update: {
          created_at?: string
          id?: string
          members?: string[]
        }
        Relationships: []
      }
      messages: {
        Row: {
          created_at: string
          id: string
          message: string | null
          message_room_id: string
          sender_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          message?: string | null
          message_room_id: string
          sender_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          message?: string | null
          message_room_id?: string
          sender_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_message_room_id_fkey"
            columns: ["message_room_id"]
            isOneToOne: false
            referencedRelation: "message_rooms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          }
        ]
      }
      profile_images: {
        Row: {
          created_at: string
          id: string
          index: number
          key: string
          profile_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          index: number
          key: string
          profile_id?: string
        }
        Update: {
          created_at?: string
          id?: string
          index?: number
          key?: string
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profile_images_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          }
        ]
      }
      profiles: {
        Row: {
          bio: string | null
          created_at: string
          interested_in: Database["public"]["Enums"]["sex"][] | null
          name: string | null
          onboarded: boolean | null
          sex: Database["public"]["Enums"]["sex"] | null
          user_id: string
        }
        Insert: {
          bio?: string | null
          created_at?: string
          interested_in?: Database["public"]["Enums"]["sex"][] | null
          name?: string | null
          onboarded?: boolean | null
          sex?: Database["public"]["Enums"]["sex"] | null
          user_id?: string
        }
        Update: {
          bio?: string | null
          created_at?: string
          interested_in?: Database["public"]["Enums"]["sex"][] | null
          name?: string | null
          onboarded?: boolean | null
          sex?: Database["public"]["Enums"]["sex"] | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      add_availability_exception: {
        Args: {
          _start: string
          _end: string
        }
        Returns: string
      }
    }
    Enums: {
      has_availability: "profile" | "experience"
      sex: "male" | "female" | "other"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

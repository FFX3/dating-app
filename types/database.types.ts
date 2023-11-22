export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
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
            referencedRelation: "experiences"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dates_message_room_id_fkey"
            columns: ["message_room_id"]
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dates_message_room_id_fkey"
            columns: ["message_room_id"]
            referencedRelation: "contacts"
            referencedColumns: ["match_id"]
          },
          {
            foreignKeyName: "dates_message_room_id_fkey"
            columns: ["message_room_id"]
            referencedRelation: "pending_matches"
            referencedColumns: ["match_id"]
          }
        ]
      }
      experience_selections: {
        Row: {
          created_at: string
          experience_id: string
          id: string
          profile_id: string
        }
        Insert: {
          created_at?: string
          experience_id: string
          id?: string
          profile_id?: string
        }
        Update: {
          created_at?: string
          experience_id?: string
          id?: string
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "experience_selections_experience_id_fkey"
            columns: ["experience_id"]
            referencedRelation: "experiences"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "experience_selections_profile_id_fkey"
            columns: ["profile_id"]
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "experience_selections_profile_id_fkey"
            columns: ["profile_id"]
            referencedRelation: "contacts"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "experience_selections_profile_id_fkey"
            columns: ["profile_id"]
            referencedRelation: "intersecting_experiences"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "experience_selections_profile_id_fkey"
            columns: ["profile_id"]
            referencedRelation: "intersecting_experiences"
            referencedColumns: ["intersecting_user_id"]
          },
          {
            foreignKeyName: "experience_selections_profile_id_fkey"
            columns: ["profile_id"]
            referencedRelation: "pending_matches"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "experience_selections_profile_id_fkey"
            columns: ["profile_id"]
            referencedRelation: "users_at_like_cap"
            referencedColumns: ["user_id"]
          }
        ]
      }
      experiences: {
        Row: {
          availability: unknown | null
          created_at: string
          description: string | null
          id: string
          name: string | null
        }
        Insert: {
          availability?: unknown | null
          created_at?: string
          description?: string | null
          id?: string
          name?: string | null
        }
        Update: {
          availability?: unknown | null
          created_at?: string
          description?: string | null
          id?: string
          name?: string | null
        }
        Relationships: []
      }
      likes: {
        Row: {
          created_at: string
          id: string
          liker_id: string
          match_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          liker_id?: string
          match_id: string
        }
        Update: {
          created_at?: string
          id?: string
          liker_id?: string
          match_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "likes_liker_id_fkey"
            columns: ["liker_id"]
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "likes_liker_id_fkey"
            columns: ["liker_id"]
            referencedRelation: "contacts"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "likes_liker_id_fkey"
            columns: ["liker_id"]
            referencedRelation: "intersecting_experiences"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "likes_liker_id_fkey"
            columns: ["liker_id"]
            referencedRelation: "intersecting_experiences"
            referencedColumns: ["intersecting_user_id"]
          },
          {
            foreignKeyName: "likes_liker_id_fkey"
            columns: ["liker_id"]
            referencedRelation: "pending_matches"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "likes_liker_id_fkey"
            columns: ["liker_id"]
            referencedRelation: "users_at_like_cap"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "likes_match_id_fkey"
            columns: ["match_id"]
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "likes_match_id_fkey"
            columns: ["match_id"]
            referencedRelation: "contacts"
            referencedColumns: ["match_id"]
          },
          {
            foreignKeyName: "likes_match_id_fkey"
            columns: ["match_id"]
            referencedRelation: "pending_matches"
            referencedColumns: ["match_id"]
          }
        ]
      }
      matches: {
        Row: {
          created_at: string
          id: string
          liked: string[] | null
          members: string[]
          passed: string[] | null
          seen_by: string[] | null
        }
        Insert: {
          created_at?: string
          id?: string
          liked?: string[] | null
          members: string[]
          passed?: string[] | null
          seen_by?: string[] | null
        }
        Update: {
          created_at?: string
          id?: string
          liked?: string[] | null
          members?: string[]
          passed?: string[] | null
          seen_by?: string[] | null
        }
        Relationships: []
      }
      messages: {
        Row: {
          created_at: string
          id: string
          match_id: string
          message: string
          sender_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          match_id: string
          message: string
          sender_id?: string
        }
        Update: {
          created_at?: string
          id?: string
          match_id?: string
          message?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_match_id_fkey"
            columns: ["match_id"]
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_match_id_fkey"
            columns: ["match_id"]
            referencedRelation: "contacts"
            referencedColumns: ["match_id"]
          },
          {
            foreignKeyName: "messages_match_id_fkey"
            columns: ["match_id"]
            referencedRelation: "pending_matches"
            referencedColumns: ["match_id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            referencedRelation: "contacts"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            referencedRelation: "intersecting_experiences"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            referencedRelation: "intersecting_experiences"
            referencedColumns: ["intersecting_user_id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            referencedRelation: "pending_matches"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            referencedRelation: "users_at_like_cap"
            referencedColumns: ["user_id"]
          }
        ]
      }
      profile_images: {
        Row: {
          created_at: string
          id: string
          index: number
          profile_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          index: number
          profile_id?: string
        }
        Update: {
          created_at?: string
          id?: string
          index?: number
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profile_images_profile_id_fkey"
            columns: ["profile_id"]
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "profile_images_profile_id_fkey"
            columns: ["profile_id"]
            referencedRelation: "contacts"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "profile_images_profile_id_fkey"
            columns: ["profile_id"]
            referencedRelation: "intersecting_experiences"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "profile_images_profile_id_fkey"
            columns: ["profile_id"]
            referencedRelation: "intersecting_experiences"
            referencedColumns: ["intersecting_user_id"]
          },
          {
            foreignKeyName: "profile_images_profile_id_fkey"
            columns: ["profile_id"]
            referencedRelation: "pending_matches"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "profile_images_profile_id_fkey"
            columns: ["profile_id"]
            referencedRelation: "users_at_like_cap"
            referencedColumns: ["user_id"]
          }
        ]
      }
      profiles: {
        Row: {
          availability: unknown | null
          bio: string | null
          created_at: string
          interested_in: Database["public"]["Enums"]["sex"][] | null
          name: string | null
          onboarded: boolean
          sex: Database["public"]["Enums"]["sex"] | null
          user_id: string
        }
        Insert: {
          availability?: unknown | null
          bio?: string | null
          created_at?: string
          interested_in?: Database["public"]["Enums"]["sex"][] | null
          name?: string | null
          onboarded?: boolean
          sex?: Database["public"]["Enums"]["sex"] | null
          user_id?: string
        }
        Update: {
          availability?: unknown | null
          bio?: string | null
          created_at?: string
          interested_in?: Database["public"]["Enums"]["sex"][] | null
          name?: string | null
          onboarded?: boolean
          sex?: Database["public"]["Enums"]["sex"] | null
          user_id?: string
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
    }
    Views: {
      contacts: {
        Row: {
          bio: string | null
          image_ids: string[] | null
          match_id: string | null
          name: string | null
          profile_id: string | null
          sex: Database["public"]["Enums"]["sex"] | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_user_id_fkey"
            columns: ["profile_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      intersecting_experiences: {
        Row: {
          experience_ids: string[] | null
          intersecting_user_id: string | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_user_id_fkey"
            columns: ["intersecting_user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      message_view: {
        Row: {
          contact_id: string | null
          created_at: string | null
          id: string | null
          is_sender: boolean | null
          match_id: string | null
          message: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_match_id_fkey"
            columns: ["match_id"]
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_match_id_fkey"
            columns: ["match_id"]
            referencedRelation: "contacts"
            referencedColumns: ["match_id"]
          },
          {
            foreignKeyName: "messages_match_id_fkey"
            columns: ["match_id"]
            referencedRelation: "pending_matches"
            referencedColumns: ["match_id"]
          }
        ]
      }
      pending_matches: {
        Row: {
          bio: string | null
          image_ids: string[] | null
          match_id: string | null
          name: string | null
          profile_id: string | null
          sex: Database["public"]["Enums"]["sex"] | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_user_id_fkey"
            columns: ["profile_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      users_at_like_cap: {
        Row: {
          user_id: string | null
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
    }
    Functions: {
      add_availability_exception: {
        Args: {
          _start: string
          _end: string
        }
        Returns: string
      }
      filter_minimum_window_weekly_availability: {
        Args: {
          availability: unknown
          minimum_interval: number
        }
        Returns: unknown
      }
      intersect_weekly_availability: {
        Args: {
          a: unknown
          b: unknown
        }
        Returns: unknown
      }
      isempty: {
        Args: {
          "": unknown
        }
        Returns: boolean
      }
      like: {
        Args: {
          profile_id: string
        }
        Returns: {
          created_at: string
          id: string
          liked: string[] | null
          members: string[]
          passed: string[] | null
          seen_by: string[] | null
        }[]
      }
      pass: {
        Args: {
          _profile_id: string
        }
        Returns: undefined
      }
      send_message: {
        Args: {
          _message: string
          _contact_id: string
        }
        Returns: undefined
      }
      union_weekly_availability: {
        Args: {
          a: unknown
          b: unknown
        }
        Returns: unknown
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
  storage: {
    Tables: {
      buckets: {
        Row: {
          allowed_mime_types: string[] | null
          avif_autodetection: boolean | null
          created_at: string | null
          file_size_limit: number | null
          id: string
          name: string
          owner: string | null
          owner_id: string | null
          public: boolean | null
          updated_at: string | null
        }
        Insert: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id: string
          name: string
          owner?: string | null
          owner_id?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Update: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id?: string
          name?: string
          owner?: string | null
          owner_id?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      migrations: {
        Row: {
          executed_at: string | null
          hash: string
          id: number
          name: string
        }
        Insert: {
          executed_at?: string | null
          hash: string
          id: number
          name: string
        }
        Update: {
          executed_at?: string | null
          hash?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      objects: {
        Row: {
          bucket_id: string | null
          created_at: string | null
          id: string
          last_accessed_at: string | null
          metadata: Json | null
          name: string | null
          owner: string | null
          owner_id: string | null
          path_tokens: string[] | null
          updated_at: string | null
          version: string | null
        }
        Insert: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          owner_id?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          version?: string | null
        }
        Update: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          owner_id?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "objects_bucketId_fkey"
            columns: ["bucket_id"]
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_insert_object: {
        Args: {
          bucketid: string
          name: string
          owner: string
          metadata: Json
        }
        Returns: undefined
      }
      extension: {
        Args: {
          name: string
        }
        Returns: string
      }
      filename: {
        Args: {
          name: string
        }
        Returns: string
      }
      foldername: {
        Args: {
          name: string
        }
        Returns: unknown
      }
      get_size_by_bucket: {
        Args: Record<PropertyKey, never>
        Returns: {
          size: number
          bucket_id: string
        }[]
      }
      search: {
        Args: {
          prefix: string
          bucketname: string
          limits?: number
          levels?: number
          offsets?: number
          search?: string
          sortcolumn?: string
          sortorder?: string
        }
        Returns: {
          name: string
          id: string
          updated_at: string
          created_at: string
          last_accessed_at: string
          metadata: Json
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}


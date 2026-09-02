export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      courses: {
        Row: {
          id: string
          title: string
          slug: string | null
          description: string | null
          thumbnail: string | null
          category: string | null
          is_published: boolean | null
          order_index: number | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          title: string
          slug?: string | null
          description?: string | null
          thumbnail?: string | null
          category?: string | null
          is_published?: boolean | null
          order_index?: number | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          title?: string
          slug?: string | null
          description?: string | null
          thumbnail?: string | null
          category?: string | null
          is_published?: boolean | null
          order_index?: number | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: never[]
      }
      course_modules: {
        Row: {
          id: string
          course_id: string
          title: string
          description: string | null
          order_index: number | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          course_id: string
          title: string
          description?: string | null
          order_index?: number | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          course_id?: string
          title?: string
          description?: string | null
          order_index?: number | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: never[]
      }
      course_lessons: {
        Row: {
          id: string
          module_id: string
          course_id: string
          title: string
          description: string | null
          video_id: string | null
          video_url: string | null
          duration: number | null
          order_index: number | null
          is_published: boolean | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          module_id: string
          course_id: string
          title: string
          description?: string | null
          video_id?: string | null
          video_url?: string | null
          duration?: number | null
          order_index?: number | null
          is_published?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          module_id?: string
          course_id?: string
          title?: string
          description?: string | null
          video_id?: string | null
          video_url?: string | null
          duration?: number | null
          order_index?: number | null
          is_published?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: never[]
      }
      articles: {
        Row: {
          id: string
          title: string
          slug: string | null
          content: string | null
          excerpt: string | null
          cover_image: string | null
          category: string | null
          tags: string[] | null
          author: string | null
          is_published: boolean | null
          published_at: string | null
          meta_title: string | null
          meta_description: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          title: string
          slug?: string | null
          content?: string | null
          excerpt?: string | null
          cover_image?: string | null
          category?: string | null
          tags?: string[] | null
          author?: string | null
          is_published?: boolean | null
          published_at?: string | null
          meta_title?: string | null
          meta_description?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          title?: string
          slug?: string | null
          content?: string | null
          excerpt?: string | null
          cover_image?: string | null
          category?: string | null
          tags?: string[] | null
          author?: string | null
          is_published?: boolean | null
          published_at?: string | null
          meta_title?: string | null
          meta_description?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: never[]
      }
      pages: {
        Row: {
          id: string
          title: string
          slug: string
          content: string | null
          excerpt: string | null
          cover_image: string | null
          is_published: boolean | null
          sort_order: number | null
          meta_title: string | null
          meta_description: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          title: string
          slug: string
          content?: string | null
          excerpt?: string | null
          cover_image?: string | null
          is_published?: boolean | null
          sort_order?: number | null
          meta_title?: string | null
          meta_description?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          content?: string | null
          excerpt?: string | null
          cover_image?: string | null
          is_published?: boolean | null
          sort_order?: number | null
          meta_title?: string | null
          meta_description?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: never[]
      }
      downloads: {
        Row: {
          id: string
          title: string
          description: string | null
          version: string | null
          file_url: string
          file_size: string | null
          changelog: string | null
          is_published: boolean | null
          download_count: number | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          version?: string | null
          file_url: string
          file_size?: string | null
          changelog?: string | null
          is_published?: boolean | null
          download_count?: number | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          version?: string | null
          file_url?: string
          file_size?: string | null
          changelog?: string | null
          is_published?: boolean | null
          download_count?: number | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: never[]
      }
      certificates: {
        Row: {
          id: string
          title: string
          description: string | null
          image_url: string
          issue_date: string | null
          order_index: number | null
          created_at: string | null
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          image_url: string
          issue_date?: string | null
          order_index?: number | null
          created_at?: string | null
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          image_url?: string
          issue_date?: string | null
          order_index?: number | null
          created_at?: string | null
        }
        Relationships: never[]
      }
      subscribers: {
        Row: {
          id: string
          email: string
          source: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          email: string
          source?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          email?: string
          source?: string | null
          created_at?: string | null
        }
        Relationships: never[]
      }
      media: {
        Row: {
          id: string
          filename: string
          file_path: string
          file_size: number | null
          mime_type: string | null
          alt_text: string | null
          uploaded_by: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          filename: string
          file_path: string
          file_size?: number | null
          mime_type?: string | null
          alt_text?: string | null
          uploaded_by?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          filename?: string
          file_path?: string
          file_size?: number | null
          mime_type?: string | null
          alt_text?: string | null
          uploaded_by?: string | null
          created_at?: string | null
        }
        Relationships: never[]
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

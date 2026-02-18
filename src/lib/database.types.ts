// Auto-generated Supabase Database types
// This file provides TypeScript type safety for all database operations.
// Regenerate with: npx supabase gen types typescript --project-id etvtszjwsojfdsyvkebe > src/lib/database.types.ts

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
          full_name: string
          full_name_ne: string | null
          email: string
          phone: string | null
          avatar_url: string | null
          role: 'committee' | 'subcommittee' | 'member'
          bio: string | null
          bio_ne: string | null
          organization: string | null
          is_active: boolean
          last_login_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name: string
          full_name_ne?: string | null
          email: string
          phone?: string | null
          avatar_url?: string | null
          role?: 'committee' | 'subcommittee' | 'member'
          bio?: string | null
          bio_ne?: string | null
          organization?: string | null
          is_active?: boolean
          last_login_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string
          full_name_ne?: string | null
          email?: string
          phone?: string | null
          avatar_url?: string | null
          role?: 'committee' | 'subcommittee' | 'member'
          bio?: string | null
          bio_ne?: string | null
          organization?: string | null
          is_active?: boolean
          last_login_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      committee_members: {
        Row: {
          id: number
          name: string
          name_ne: string
          position: string
          position_ne: string
          contact: string | null
          photo_url: string | null
          user_id: string | null
          term_id: number | null
          sort_order: number
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: number
          name: string
          name_ne: string
          position: string
          position_ne: string
          contact?: string | null
          photo_url?: string | null
          user_id?: string | null
          term_id?: number | null
          sort_order?: number
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: number
          name?: string
          name_ne?: string
          position?: string
          position_ne?: string
          contact?: string | null
          photo_url?: string | null
          user_id?: string | null
          term_id?: number | null
          sort_order?: number
          is_active?: boolean
          created_at?: string
        }
      }
      past_committees: {
        Row: {
          id: number
          period: string
          period_ne: string
          category: string | null
          start_year: number | null
          end_year: number | null
          sort_order: number
          created_at: string
        }
        Insert: {
          id?: number
          period: string
          period_ne: string
          category?: string | null
          start_year?: number | null
          end_year?: number | null
          sort_order?: number
          created_at?: string
        }
        Update: {
          id?: number
          period?: string
          period_ne?: string
          category?: string | null
          start_year?: number | null
          end_year?: number | null
          sort_order?: number
          created_at?: string
        }
      }
      subcommittees: {
        Row: {
          id: number
          name: string
          name_ne: string
          focus: string | null
          focus_ne: string | null
          member_count: number
          type: string | null
          coordinator_id: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          name: string
          name_ne: string
          focus?: string | null
          focus_ne?: string | null
          member_count?: number
          type?: string | null
          coordinator_id?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          name?: string
          name_ne?: string
          focus?: string | null
          focus_ne?: string | null
          member_count?: number
          type?: string | null
          coordinator_id?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      subcommittee_members: {
        Row: {
          id: number
          subcommittee_id: number
          user_id: string
          role: string
          joined_at: string
          left_at: string | null
          is_active: boolean
        }
        Insert: {
          id?: number
          subcommittee_id: number
          user_id: string
          role?: string
          joined_at?: string
          left_at?: string | null
          is_active?: boolean
        }
        Update: {
          id?: number
          subcommittee_id?: number
          user_id?: string
          role?: string
          joined_at?: string
          left_at?: string | null
          is_active?: boolean
        }
      }
      it_clubs: {
        Row: {
          id: number
          name: string
          name_ne: string
          students: number
          established: number | null
          location: string | null
          location_ne: string | null
          school_name: string | null
          school_name_ne: string | null
          contact_email: string | null
          contact_phone: string | null
          logo_url: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          name: string
          name_ne: string
          students?: number
          established?: number | null
          location?: string | null
          location_ne?: string | null
          school_name?: string | null
          school_name_ne?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          logo_url?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          name?: string
          name_ne?: string
          students?: number
          established?: number | null
          location?: string | null
          location_ne?: string | null
          school_name?: string | null
          school_name_ne?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          logo_url?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      membership_types: {
        Row: {
          id: number
          type: string
          type_ne: string
          fee: string
          fee_ne: string
          fee_amount: number | null
          is_recurring: boolean
          renewal_period: string
          description: string | null
          description_ne: string | null
          benefits: Json
          benefits_ne: Json
          icon: string | null
          color: string
          sort_order: number
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: number
          type: string
          type_ne: string
          fee: string
          fee_ne: string
          fee_amount?: number | null
          is_recurring?: boolean
          renewal_period?: string
          description?: string | null
          description_ne?: string | null
          benefits?: Json
          benefits_ne?: Json
          icon?: string | null
          color?: string
          sort_order?: number
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: number
          type?: string
          type_ne?: string
          fee?: string
          fee_ne?: string
          fee_amount?: number | null
          is_recurring?: boolean
          renewal_period?: string
          description?: string | null
          description_ne?: string | null
          benefits?: Json
          benefits_ne?: Json
          icon?: string | null
          color?: string
          sort_order?: number
          is_active?: boolean
          created_at?: string
        }
      }
      membership_applications: {
        Row: {
          id: number
          user_id: string | null
          membership_type_id: number
          full_name: string
          full_name_ne: string | null
          email: string
          phone: string
          address: string | null
          address_ne: string | null
          organization: string | null
          citizenship_doc_url: string | null
          photo_url: string | null
          academic_doc_url: string | null
          professional_doc_url: string | null
          status: string
          reviewed_by: string | null
          reviewed_at: string | null
          review_notes: string | null
          payment_status: string
          payment_receipt_url: string | null
          expires_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          user_id?: string | null
          membership_type_id: number
          full_name: string
          full_name_ne?: string | null
          email: string
          phone: string
          address?: string | null
          address_ne?: string | null
          organization?: string | null
          citizenship_doc_url?: string | null
          photo_url?: string | null
          academic_doc_url?: string | null
          professional_doc_url?: string | null
          status?: string
          reviewed_by?: string | null
          reviewed_at?: string | null
          review_notes?: string | null
          payment_status?: string
          payment_receipt_url?: string | null
          expires_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          user_id?: string | null
          membership_type_id?: number
          full_name?: string
          full_name_ne?: string | null
          email?: string
          phone?: string
          address?: string | null
          address_ne?: string | null
          organization?: string | null
          citizenship_doc_url?: string | null
          photo_url?: string | null
          academic_doc_url?: string | null
          professional_doc_url?: string | null
          status?: string
          reviewed_by?: string | null
          reviewed_at?: string | null
          review_notes?: string | null
          payment_status?: string
          payment_receipt_url?: string | null
          expires_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: number
          name: string
          name_ne: string
          slug: string | null
          description: string | null
          parent_id: number | null
          sort_order: number
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: number
          name: string
          name_ne: string
          slug?: string | null
          description?: string | null
          parent_id?: number | null
          sort_order?: number
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: number
          name?: string
          name_ne?: string
          slug?: string | null
          description?: string | null
          parent_id?: number | null
          sort_order?: number
          is_active?: boolean
          created_at?: string
        }
      }
      notices: {
        Row: {
          id: number
          title: string
          title_ne: string
          content: string | null
          content_ne: string | null
          date: string | null
          expiry_date: string | null
          priority: string
          type: string
          attachment_url: string | null
          author_id: string | null
          is_pinned: boolean
          is_published: boolean
          view_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          title: string
          title_ne: string
          content?: string | null
          content_ne?: string | null
          date?: string | null
          expiry_date?: string | null
          priority?: string
          type?: string
          attachment_url?: string | null
          author_id?: string | null
          is_pinned?: boolean
          is_published?: boolean
          view_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          title?: string
          title_ne?: string
          content?: string | null
          content_ne?: string | null
          date?: string | null
          expiry_date?: string | null
          priority?: string
          type?: string
          attachment_url?: string | null
          author_id?: string | null
          is_pinned?: boolean
          is_published?: boolean
          view_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      events: {
        Row: {
          id: number
          title: string
          title_ne: string
          slug: string | null
          date: string | null
          time: string | null
          end_date: string | null
          end_time: string | null
          location: string | null
          location_ne: string | null
          venue_address: string | null
          venue_map_url: string | null
          description: string | null
          description_ne: string | null
          full_content: string | null
          full_content_ne: string | null
          max_attendees: number | null
          attendees: number
          registered_count: number
          status: string
          image_url: string | null
          is_registration_open: boolean
          registration_deadline: string | null
          registration_fee: number
          registration_fee_ne: string | null
          contact_email: string | null
          contact_phone: string | null
          category_id: number | null
          organizer: string
          organizer_ne: string
          author_id: string | null
          is_featured: boolean
          is_published: boolean
          view_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          title: string
          title_ne: string
          slug?: string | null
          date?: string | null
          time?: string | null
          end_date?: string | null
          end_time?: string | null
          location?: string | null
          location_ne?: string | null
          venue_address?: string | null
          venue_map_url?: string | null
          description?: string | null
          description_ne?: string | null
          full_content?: string | null
          full_content_ne?: string | null
          max_attendees?: number | null
          attendees?: number
          registered_count?: number
          status?: string
          image_url?: string | null
          is_registration_open?: boolean
          registration_deadline?: string | null
          registration_fee?: number
          registration_fee_ne?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          category_id?: number | null
          organizer?: string
          organizer_ne?: string
          author_id?: string | null
          is_featured?: boolean
          is_published?: boolean
          view_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          title?: string
          title_ne?: string
          slug?: string | null
          date?: string | null
          time?: string | null
          end_date?: string | null
          end_time?: string | null
          location?: string | null
          location_ne?: string | null
          venue_address?: string | null
          venue_map_url?: string | null
          description?: string | null
          description_ne?: string | null
          full_content?: string | null
          full_content_ne?: string | null
          max_attendees?: number | null
          attendees?: number
          registered_count?: number
          status?: string
          image_url?: string | null
          is_registration_open?: boolean
          registration_deadline?: string | null
          registration_fee?: number
          registration_fee_ne?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          category_id?: number | null
          organizer?: string
          organizer_ne?: string
          author_id?: string | null
          is_featured?: boolean
          is_published?: boolean
          view_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      event_registrations: {
        Row: {
          id: number
          event_id: number
          user_id: string | null
          full_name: string
          full_name_ne: string | null
          email: string
          phone: string | null
          organization: string | null
          designation: string | null
          registration_code: string
          qr_code_url: string | null
          qr_data: string | null
          is_attended: boolean
          checked_in_at: string | null
          checked_in_by: string | null
          check_in_method: string
          status: string
          payment_status: string
          payment_amount: number | null
          payment_receipt_url: string | null
          registration_source: string
          notes: string | null
          feedback_rating: number | null
          feedback_comment: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          event_id: number
          user_id?: string | null
          full_name: string
          full_name_ne?: string | null
          email: string
          phone?: string | null
          organization?: string | null
          designation?: string | null
          registration_code: string
          qr_code_url?: string | null
          qr_data?: string | null
          is_attended?: boolean
          checked_in_at?: string | null
          checked_in_by?: string | null
          check_in_method?: string
          status?: string
          payment_status?: string
          payment_amount?: number | null
          payment_receipt_url?: string | null
          registration_source?: string
          notes?: string | null
          feedback_rating?: number | null
          feedback_comment?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          event_id?: number
          user_id?: string | null
          full_name?: string
          full_name_ne?: string | null
          email?: string
          phone?: string | null
          organization?: string | null
          designation?: string | null
          registration_code?: string
          qr_code_url?: string | null
          qr_data?: string | null
          is_attended?: boolean
          checked_in_at?: string | null
          checked_in_by?: string | null
          check_in_method?: string
          status?: string
          payment_status?: string
          payment_amount?: number | null
          payment_receipt_url?: string | null
          registration_source?: string
          notes?: string | null
          feedback_rating?: number | null
          feedback_comment?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      gallery_images: {
        Row: {
          id: number
          src: string
          thumbnail: string | null
          title: string | null
          title_ne: string | null
          caption: string | null
          caption_ne: string | null
          event_id: number | null
          album: string | null
          width: number | null
          height: number | null
          file_size: string | null
          sort_order: number
          is_featured: boolean
          uploaded_by: string | null
          created_at: string
        }
        Insert: {
          id?: number
          src: string
          thumbnail?: string | null
          title?: string | null
          title_ne?: string | null
          caption?: string | null
          caption_ne?: string | null
          event_id?: number | null
          album?: string | null
          width?: number | null
          height?: number | null
          file_size?: string | null
          sort_order?: number
          is_featured?: boolean
          uploaded_by?: string | null
          created_at?: string
        }
        Update: {
          id?: number
          src?: string
          thumbnail?: string | null
          title?: string | null
          title_ne?: string | null
          caption?: string | null
          caption_ne?: string | null
          event_id?: number | null
          album?: string | null
          width?: number | null
          height?: number | null
          file_size?: string | null
          sort_order?: number
          is_featured?: boolean
          uploaded_by?: string | null
          created_at?: string
        }
      }
      press_releases: {
        Row: {
          id: number
          title: string
          title_ne: string
          slug: string | null
          excerpt: string | null
          excerpt_ne: string | null
          body: string | null
          body_ne: string | null
          date: string | null
          category_id: number | null
          link: string | null
          image_url: string | null
          author_id: string | null
          author_name: string | null
          is_featured: boolean
          is_published: boolean
          view_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          title: string
          title_ne: string
          slug?: string | null
          excerpt?: string | null
          excerpt_ne?: string | null
          body?: string | null
          body_ne?: string | null
          date?: string | null
          category_id?: number | null
          link?: string | null
          image_url?: string | null
          author_id?: string | null
          author_name?: string | null
          is_featured?: boolean
          is_published?: boolean
          view_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          title?: string
          title_ne?: string
          slug?: string | null
          excerpt?: string | null
          excerpt_ne?: string | null
          body?: string | null
          body_ne?: string | null
          date?: string | null
          category_id?: number | null
          link?: string | null
          image_url?: string | null
          author_id?: string | null
          author_name?: string | null
          is_featured?: boolean
          is_published?: boolean
          view_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      downloads: {
        Row: {
          id: number
          title: string
          title_ne: string
          description: string | null
          description_ne: string | null
          file_type: string
          file_size: string | null
          file_size_bytes: number | null
          date: string | null
          category_id: number | null
          download_url: string
          download_count: number
          version: string | null
          is_published: boolean
          uploaded_by: string | null
          created_at: string
        }
        Insert: {
          id?: number
          title: string
          title_ne: string
          description?: string | null
          description_ne?: string | null
          file_type?: string
          file_size?: string | null
          file_size_bytes?: number | null
          date?: string | null
          category_id?: number | null
          download_url: string
          download_count?: number
          version?: string | null
          is_published?: boolean
          uploaded_by?: string | null
          created_at?: string
        }
        Update: {
          id?: number
          title?: string
          title_ne?: string
          description?: string | null
          description_ne?: string | null
          file_type?: string
          file_size?: string | null
          file_size_bytes?: number | null
          date?: string | null
          category_id?: number | null
          download_url?: string
          download_count?: number
          version?: string | null
          is_published?: boolean
          uploaded_by?: string | null
          created_at?: string
        }
      }
      reports: {
        Row: {
          id: number
          title: string
          title_ne: string
          author: string | null
          author_ne: string | null
          date: string | null
          fiscal_year: string | null
          report_type: string
          file_type: string
          file_size: string | null
          download_url: string
          summary: string | null
          summary_ne: string | null
          download_count: number
          is_published: boolean
          uploaded_by: string | null
          created_at: string
        }
        Insert: {
          id?: number
          title: string
          title_ne: string
          author?: string | null
          author_ne?: string | null
          date?: string | null
          fiscal_year?: string | null
          report_type: string
          file_type?: string
          file_size?: string | null
          download_url: string
          summary?: string | null
          summary_ne?: string | null
          download_count?: number
          is_published?: boolean
          uploaded_by?: string | null
          created_at?: string
        }
        Update: {
          id?: number
          title?: string
          title_ne?: string
          author?: string | null
          author_ne?: string | null
          date?: string | null
          fiscal_year?: string | null
          report_type?: string
          file_type?: string
          file_size?: string | null
          download_url?: string
          summary?: string | null
          summary_ne?: string | null
          download_count?: number
          is_published?: boolean
          uploaded_by?: string | null
          created_at?: string
        }
      }
      programs: {
        Row: {
          id: number
          title: string
          title_ne: string
          slug: string | null
          description: string | null
          description_ne: string | null
          full_content: string | null
          full_content_ne: string | null
          icon: string | null
          color: string
          features: Json
          features_ne: Json
          image_url: string | null
          category: string | null
          target_audience: string | null
          target_audience_ne: string | null
          impact_stats: Json | null
          sort_order: number
          is_featured: boolean
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          title: string
          title_ne: string
          slug?: string | null
          description?: string | null
          description_ne?: string | null
          full_content?: string | null
          full_content_ne?: string | null
          icon?: string | null
          color?: string
          features?: Json
          features_ne?: Json
          image_url?: string | null
          category?: string | null
          target_audience?: string | null
          target_audience_ne?: string | null
          impact_stats?: Json | null
          sort_order?: number
          is_featured?: boolean
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          title?: string
          title_ne?: string
          slug?: string | null
          description?: string | null
          description_ne?: string | null
          full_content?: string | null
          full_content_ne?: string | null
          icon?: string | null
          color?: string
          features?: Json
          features_ne?: Json
          image_url?: string | null
          category?: string | null
          target_audience?: string | null
          target_audience_ne?: string | null
          impact_stats?: Json | null
          sort_order?: number
          is_featured?: boolean
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      upcoming_programs: {
        Row: {
          id: number
          title: string
          title_ne: string
          date: string | null
          start_date: string | null
          end_date: string | null
          deadline: string | null
          time: string | null
          location: string | null
          location_ne: string | null
          description: string | null
          description_ne: string | null
          spots: string | null
          spots_ne: string | null
          max_participants: number | null
          current_participants: number
          register_link: string | null
          program_id: number | null
          category: string | null
          registration_fee: number
          contact_email: string | null
          contact_phone: string | null
          is_registration_open: boolean
          is_active: boolean
          author_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          title: string
          title_ne: string
          date?: string | null
          start_date?: string | null
          end_date?: string | null
          deadline?: string | null
          time?: string | null
          location?: string | null
          location_ne?: string | null
          description?: string | null
          description_ne?: string | null
          spots?: string | null
          spots_ne?: string | null
          max_participants?: number | null
          current_participants?: number
          register_link?: string | null
          program_id?: number | null
          category?: string | null
          registration_fee?: number
          contact_email?: string | null
          contact_phone?: string | null
          is_registration_open?: boolean
          is_active?: boolean
          author_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          title?: string
          title_ne?: string
          date?: string | null
          start_date?: string | null
          end_date?: string | null
          deadline?: string | null
          time?: string | null
          location?: string | null
          location_ne?: string | null
          description?: string | null
          description_ne?: string | null
          spots?: string | null
          spots_ne?: string | null
          max_participants?: number | null
          current_participants?: number
          register_link?: string | null
          program_id?: number | null
          category?: string | null
          registration_fee?: number
          contact_email?: string | null
          contact_phone?: string | null
          is_registration_open?: boolean
          is_active?: boolean
          author_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      program_registrations: {
        Row: {
          id: number
          program_id: number
          user_id: string | null
          full_name: string
          full_name_ne: string | null
          email: string
          phone: string | null
          organization: string | null
          registration_code: string
          qr_code_url: string | null
          status: string
          is_attended: boolean
          checked_in_at: string | null
          checked_in_by: string | null
          payment_status: string
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          program_id: number
          user_id?: string | null
          full_name: string
          full_name_ne?: string | null
          email: string
          phone?: string | null
          organization?: string | null
          registration_code: string
          qr_code_url?: string | null
          status?: string
          is_attended?: boolean
          checked_in_at?: string | null
          checked_in_by?: string | null
          payment_status?: string
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          program_id?: number
          user_id?: string | null
          full_name?: string
          full_name_ne?: string | null
          email?: string
          phone?: string | null
          organization?: string | null
          registration_code?: string
          qr_code_url?: string | null
          status?: string
          is_attended?: boolean
          checked_in_at?: string | null
          checked_in_by?: string | null
          payment_status?: string
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      headlines: {
        Row: {
          id: number
          title: string
          title_ne: string
          date: string | null
          link: string | null
          sort_order: number
          is_active: boolean
          expires_at: string | null
          created_at: string
        }
        Insert: {
          id?: number
          title: string
          title_ne: string
          date?: string | null
          link?: string | null
          sort_order?: number
          is_active?: boolean
          expires_at?: string | null
          created_at?: string
        }
        Update: {
          id?: number
          title?: string
          title_ne?: string
          date?: string | null
          link?: string | null
          sort_order?: number
          is_active?: boolean
          expires_at?: string | null
          created_at?: string
        }
      }
      hero_slides: {
        Row: {
          id: number
          image_url: string
          title: string
          title_ne: string
          subtitle: string | null
          subtitle_ne: string | null
          cta_text: string | null
          cta_text_ne: string | null
          link: string | null
          sort_order: number
          is_active: boolean
          starts_at: string | null
          ends_at: string | null
          created_at: string
        }
        Insert: {
          id?: number
          image_url: string
          title: string
          title_ne: string
          subtitle?: string | null
          subtitle_ne?: string | null
          cta_text?: string | null
          cta_text_ne?: string | null
          link?: string | null
          sort_order?: number
          is_active?: boolean
          starts_at?: string | null
          ends_at?: string | null
          created_at?: string
        }
        Update: {
          id?: number
          image_url?: string
          title?: string
          title_ne?: string
          subtitle?: string | null
          subtitle_ne?: string | null
          cta_text?: string | null
          cta_text_ne?: string | null
          link?: string | null
          sort_order?: number
          is_active?: boolean
          starts_at?: string | null
          ends_at?: string | null
          created_at?: string
        }
      }
      pending_approvals: {
        Row: {
          id: number
          title: string
          content_type: string
          content_body: Json
          author_id: string
          reviewer_id: string | null
          status: string
          remarks: string | null
          target_table: string
          target_id: number | null
          priority: string
          created_at: string
          reviewed_at: string | null
        }
        Insert: {
          id?: number
          title: string
          content_type: string
          content_body: Json
          author_id: string
          reviewer_id?: string | null
          status?: string
          remarks?: string | null
          target_table: string
          target_id?: number | null
          priority?: string
          created_at?: string
          reviewed_at?: string | null
        }
        Update: {
          id?: number
          title?: string
          content_type?: string
          content_body?: Json
          author_id?: string
          reviewer_id?: string | null
          status?: string
          remarks?: string | null
          target_table?: string
          target_id?: number | null
          priority?: string
          created_at?: string
          reviewed_at?: string | null
        }
      }
      feedback: {
        Row: {
          id: number
          name: string
          email: string
          phone: string | null
          subject: string | null
          message: string
          page_url: string | null
          is_read: boolean
          is_starred: boolean
          replied_at: string | null
          replied_by: string | null
          reply_text: string | null
          ip_address: string | null
          created_at: string
        }
        Insert: {
          id?: number
          name: string
          email: string
          phone?: string | null
          subject?: string | null
          message: string
          page_url?: string | null
          is_read?: boolean
          is_starred?: boolean
          replied_at?: string | null
          replied_by?: string | null
          reply_text?: string | null
          ip_address?: string | null
          created_at?: string
        }
        Update: {
          id?: number
          name?: string
          email?: string
          phone?: string | null
          subject?: string | null
          message?: string
          page_url?: string | null
          is_read?: boolean
          is_starred?: boolean
          replied_at?: string | null
          replied_by?: string | null
          reply_text?: string | null
          ip_address?: string | null
          created_at?: string
        }
      }
      newsletter_subscribers: {
        Row: {
          id: number
          email: string
          full_name: string | null
          is_active: boolean
          source: string
          subscribed_at: string
          unsubscribed_at: string | null
          confirm_token: string | null
          is_confirmed: boolean
        }
        Insert: {
          id?: number
          email: string
          full_name?: string | null
          is_active?: boolean
          source?: string
          subscribed_at?: string
          unsubscribed_at?: string | null
          confirm_token?: string | null
          is_confirmed?: boolean
        }
        Update: {
          id?: number
          email?: string
          full_name?: string | null
          is_active?: boolean
          source?: string
          subscribed_at?: string
          unsubscribed_at?: string | null
          confirm_token?: string | null
          is_confirmed?: boolean
        }
      }
      settings: {
        Row: {
          key: string
          value: string | null
          value_ne: string | null
          category: string
          description: string | null
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          key: string
          value?: string | null
          value_ne?: string | null
          category?: string
          description?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          key?: string
          value?: string | null
          value_ne?: string | null
          category?: string
          description?: string | null
          updated_at?: string
          updated_by?: string | null
        }
      }
      audit_log: {
        Row: {
          id: number
          user_id: string | null
          user_email: string | null
          action: string
          table_name: string
          record_id: number | null
          old_data: Json | null
          new_data: Json | null
          description: string | null
          ip_address: string | null
          user_agent: string | null
          created_at: string
        }
        Insert: {
          id?: number
          user_id?: string | null
          user_email?: string | null
          action: string
          table_name: string
          record_id?: number | null
          old_data?: Json | null
          new_data?: Json | null
          description?: string | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
        Update: {
          id?: number
          user_id?: string | null
          user_email?: string | null
          action?: string
          table_name?: string
          record_id?: number | null
          old_data?: Json | null
          new_data?: Json | null
          description?: string | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
      }
      contact_messages: {
        Row: {
          id: number
          name: string
          email: string
          phone: string | null
          subject: string
          message: string
          category: string
          status: string
          assigned_to: string | null
          replied_at: string | null
          ip_address: string | null
          created_at: string
        }
        Insert: {
          id?: number
          name: string
          email: string
          phone?: string | null
          subject: string
          message: string
          category?: string
          status?: string
          assigned_to?: string | null
          replied_at?: string | null
          ip_address?: string | null
          created_at?: string
        }
        Update: {
          id?: number
          name?: string
          email?: string
          phone?: string | null
          subject?: string
          message?: string
          category?: string
          status?: string
          assigned_to?: string | null
          replied_at?: string | null
          ip_address?: string | null
          created_at?: string
        }
      }
      tags: {
        Row: {
          id: number
          name: string
          name_ne: string | null
          slug: string | null
        }
        Insert: {
          id?: number
          name: string
          name_ne?: string | null
          slug?: string | null
        }
        Update: {
          id?: number
          name?: string
          name_ne?: string | null
          slug?: string | null
        }
      }
      content_tags: {
        Row: {
          id: number
          tag_id: number
          content_type: string
          content_id: number
        }
        Insert: {
          id?: number
          tag_id: number
          content_type: string
          content_id: number
        }
        Update: {
          id?: number
          tag_id?: number
          content_type?: string
          content_id?: number
        }
      }
      page_views: {
        Row: {
          id: number
          page_path: string
          page_title: string | null
          referrer: string | null
          user_id: string | null
          session_id: string | null
          device_type: string | null
          browser: string | null
          country: string | null
          ip_address: string | null
          created_at: string
        }
        Insert: {
          id?: number
          page_path: string
          page_title?: string | null
          referrer?: string | null
          user_id?: string | null
          session_id?: string | null
          device_type?: string | null
          browser?: string | null
          country?: string | null
          ip_address?: string | null
          created_at?: string
        }
        Update: {
          id?: number
          page_path?: string
          page_title?: string | null
          referrer?: string | null
          user_id?: string | null
          session_id?: string | null
          device_type?: string | null
          browser?: string | null
          country?: string | null
          ip_address?: string | null
          created_at?: string
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

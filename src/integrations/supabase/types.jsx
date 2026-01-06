// supabaseDatabase.js
import { supabase, Constants, Tables, Functions, Enums } from './supabaseDatabase.js';

// Runtime constants
export const Constants = {
  public: {
    Enums: {
      app_role: ["traveler", "organizer", "admin"],
    },
  },
};

// Optional: database table references for runtime use
export const Tables = {
  blog_comments: "blog_comments",
  blog_likes: "blog_likes",
  blog_posts: "blog_posts",
  diary_entries: "diary_entries",
  emergency_contacts: "emergency_contacts",
  messages: "messages",
  notifications: "notifications",
  organizer_verifications: "organizer_verifications",
  private_messages: "private_messages",
  profiles: "profiles",
  trip_participants: "trip_participants",
  trips: "trips",
  user_roles: "user_roles",
};

// Optional: function names for runtime use
export const Functions = {
  has_role: "has_role",
  is_organizer_verified: "is_organizer_verified",
};

// Optional: enums for runtime
export const Enums = {
  app_role: ["traveler", "organizer", "admin"],
};

// Optional: Supabase client setup
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  },
});

"use client";

import { useEffect, useState } from "react";
import { mapEntry } from "./entry-search.js";
import { createClient } from "./supabase/client.js";

const LOAD_ERROR = "Unable to load archive entries. Please try again later. មិនអាចផ្ទុកការចូលរួមក្នុងបណ្ណសារបានទេ។ សូមព្យាយាមម្តងទៀតនៅពេលក្រោយ។";

// Loads every published entry once, oldest first. Row level security means
// a visitor only ever receives published rows here anyway.
export function usePublishedEntries() {
  const [state, setState] = useState({ entries: [], isLoading: true, error: "" });

  useEffect(() => {
    let isActive = true;
    createClient()
      .from("entries")
      .select("*")
      .eq("status", "published")
      .order("created_at", { ascending: true })
      .then(({ data, error }) => {
        if (!isActive) return;
        setState(error
          ? { entries: [], isLoading: false, error: LOAD_ERROR }
          : { entries: (data || []).map(mapEntry), isLoading: false, error: "" });
      });
    return () => { isActive = false; };
  }, []);

  return state;
}

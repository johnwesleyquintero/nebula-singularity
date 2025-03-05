import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://aybridyinsrebhibkgkh.supabase.co'; // Replace with your Supabase URL
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF5YnJpZHlpbnNyZWJoaWJrZ2toIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzcyNTQ3MDUsImV4cCI6MjA1MjgzMDcwNX0.sPGXhW_5PyZUrrmrJ36q1iCejppHkQrEfgcO2mSnQOE'; // Replace with your Supabase Anon Key

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

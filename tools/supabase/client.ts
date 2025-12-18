import { createClient } from '@supabase/supabase-js';
import { SUPABASE_CONFIG } from './config';

/**
 * Cliente Supabase Singleton.
 * Utiliza as configurações protegidas do arquivo config.ts.
 */
export const supabase = createClient(
  SUPABASE_CONFIG.url,
  SUPABASE_CONFIG.anonKey
);

export default supabase;

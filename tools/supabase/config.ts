/**
 * Configurações do Supabase
 * IMPORTANTE: Nunca coloque chaves privadas aqui.
 * Use variáveis de ambiente (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY).
 */

export const SUPABASE_CONFIG = {
  url:
    process.env.SUPABASE_URL ||
    process.env.VITE_SUPABASE_URL ||
    'https://amgdgkahcimfdrpgxvkx.supabase.co',
  anonKey:
    process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || '',
};

if (!SUPABASE_CONFIG.anonKey) {
  console.warn(
    '⚠️ Supabase Anon Key não detectada. Certifique-se de configurar o arquivo .env'
  );
}

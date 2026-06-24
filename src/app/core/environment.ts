// Environment variables configuration - usando getters para evaluación en runtime
export const environment = {
  production: false,
  get supabase() {
    return {
      get url() {
        return getEnvironmentVariable('SUPABASE_URL');
      },
      get anonKey() {
        return getEnvironmentVariable('SUPABASE_ANON_KEY');
      }
    };
  }
};

function getEnvironmentVariable(key: string): string {
  // Intenta obtener desde localStorage primero
  const fromStorage = localStorage.getItem(key);
  if (fromStorage) return fromStorage;

  // Luego desde window globals
  if (typeof window !== 'undefined' && (window as any)[key]) {
    return (window as any)[key];
  }

  // Si no está disponible, retorna string vacío
  console.warn(`⚠️ Environment variable ${key} not found`);
  return '';
}

export function setEnvironmentVariables(url: string, key: string) {
  localStorage.setItem('SUPABASE_URL', url);
  localStorage.setItem('SUPABASE_ANON_KEY', key);
  (window as any)['SUPABASE_URL'] = url;
  (window as any)['SUPABASE_ANON_KEY'] = key;
}

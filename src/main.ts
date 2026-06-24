import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

// Cargar variables de entorno desde localStorage
function loadEnvironmentVariables() {
  const supabaseUrl = localStorage.getItem('SUPABASE_URL');
  const supabaseKey = localStorage.getItem('SUPABASE_ANON_KEY');

  if (supabaseUrl) {
    (window as any)['SUPABASE_URL'] = supabaseUrl;
  }
  if (supabaseKey) {
    (window as any)['SUPABASE_ANON_KEY'] = supabaseKey;
  }
}

// Cargar variables antes de iniciar la app
loadEnvironmentVariables();

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));

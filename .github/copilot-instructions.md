# Sistema de Reservas de Espacios

Proyecto Angular completo para gestión de reservas de espacios o recursos con Supabase y PostgreSQL.

## Stack Tecnológico
- Angular 18 + TypeScript
- Supabase (PostgreSQL + Auth)
- SCSS
- Angular Router + Reactive Forms
- Vercel para deployment

## Estructura del Proyecto
```
src/
├── app/
│   ├── core/              # Servicios, guards, interceptores
│   ├── shared/            # Componentes, pipes, directivas compartidas
│   ├── features/
│   │   ├── auth/          # Autenticación
│   │   ├── resources/     # Gestión de recursos
│   │   ├── reservations/  # Gestión de reservas
│   │   └── admin/         # Panel de administración
│   ├── app.component.*
│   └── app.config.ts
├── assets/                # Imágenes y recursos estáticos
├── styles.scss            # Estilos globales
└── main.ts                # Punto de entrada
```

## Configuración Inicial
1. Instalar dependencias: `npm install`
2. Configurar variables de entorno (.env)
3. Crear tablas en Supabase (ver schema.sql)
4. Iniciar desarrollo: `npm start`

## Variables de Entorno
Crear archivo `.env`:
```
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key
```

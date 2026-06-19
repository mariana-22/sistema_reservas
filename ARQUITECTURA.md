# Documentación de Arquitectura

## 🏗️ Descripción General

El Sistema de Reservas de Espacios es una aplicación web full-stack que implementa un CRUD completo para gestionar reservas de recursos con validación de conflictos horarios, autenticación de usuarios y panel administrativo.

## 📊 Diagrama de Arquitectura

```
┌─────────────────────────────────────────────────────────────┐
│                   FRONTEND (Angular 18)                      │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │  Auth Layer  │  │  Dashboard   │  │  Admin Panel │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
│                                                               │
│  ┌──────────────┐  ┌──────────────┐                          │
│  │  Resources   │  │ Reservations │                          │
│  └──────────────┘  └──────────────┘                          │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐    │
│  │           Core Services Layer (RxJS)               │    │
│  │  - SupabaseService                                  │    │
│  │  - UsuarioService                                   │    │
│  │  - RecursoService                                   │    │
│  │  - ReservaService                                   │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐    │
│  │        Guards & Interceptors                        │    │
│  │  - AuthGuard                                        │    │
│  │  - AdminGuard                                       │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                           ↕
              SUPABASE CLIENT-SIDE SDK
                           ↕
┌─────────────────────────────────────────────────────────────┐
│            BACKEND (Supabase / PostgreSQL)                   │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         REST API (Auto-generated)                   │   │
│  │  - /usuarios                                         │   │
│  │  - /recursos                                         │   │
│  │  - /reservas                                         │   │
│  │  - /horarios                                         │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │       PostgreSQL Database                           │   │
│  │  - usuarios                                          │   │
│  │  - recursos                                          │   │
│  │  - reservas                                          │   │
│  │  - horarios                                          │   │
│  │  - Triggers & Constraints                            │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │      Authentication (Supabase Auth)                │   │
│  │  - Email/Password                                   │   │
│  │  - JWT Tokens                                       │   │
│  │  - RLS Policies                                     │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                           ↕
┌─────────────────────────────────────────────────────────────┐
│            DEPLOYMENT (Vercel)                               │
├─────────────────────────────────────────────────────────────┤
│  - Hosting estático                                          │
│  - CDN Global                                                │
│  - Auto-deployment desde GitHub                              │
└─────────────────────────────────────────────────────────────┘
```

## 🔄 Flujo de Datos

### Creación de Reserva
```
Usuario (UI)
    ↓
FormularioReserva (Component)
    ↓
ReservaService.crearReserva()
    ↓
Validar conflictos horarios (Service)
    ↓
Supabase API
    ↓
PostgreSQL Trigger (Validación adicional)
    ↓
Insertar en tabla reservas
    ↓
Retornar respuesta al UI
    ↓
Mostrar mensaje de éxito
    ↓
Actualizar lista de reservas
```

### Autenticación
```
Pantalla de Login
    ↓
SupabaseService.signIn()
    ↓
Supabase Auth API
    ↓
Validar credenciales
    ↓
Generar JWT Token
    ↓
Guardar sesión en localStorage
    ↓
AuthGuard verifica token
    ↓
Permitir acceso a rutas protegidas
```

## 📁 Estructura de Carpetas

```
sistema-reservas/
├── src/
│   ├── app/
│   │   ├── core/                    # Lógica compartida
│   │   │   ├── models/              # Interfaces TypeScript
│   │   │   │   └── index.ts         # Todas las interfaces
│   │   │   ├── services/            # Servicios
│   │   │   │   ├── supabase.service.ts
│   │   │   │   ├── usuario.service.ts
│   │   │   │   ├── recurso.service.ts
│   │   │   │   └── reserva.service.ts
│   │   │   └── guards/              # Route guards
│   │   │       └── auth.guard.ts
│   │   │
│   │   ├── shared/                  # Componentes reutilizables
│   │   │   └── README.md
│   │   │
│   │   ├── features/                # Módulos de negocio
│   │   │   ├── auth/
│   │   │   │   ├── login/
│   │   │   │   ├── registro/
│   │   │   │   └── perfil/
│   │   │   ├── resources/
│   │   │   │   ├── listado/
│   │   │   │   └── detalle/
│   │   │   ├── reservations/
│   │   │   │   └── listado/
│   │   │   ├── admin/
│   │   │   │   └── panel/
│   │   │   └── dashboard/
│   │   │
│   │   ├── app.component.*          # Componente raíz
│   │   ├── app.routes.ts            # Definición de rutas
│   │   └── app.config.ts            # Configuración
│   │
│   ├── styles.scss                  # Estilos globales
│   ├── index.html                   # HTML principal
│   ├── main.ts                      # Entry point
│   └── test.ts                      # Configuración de tests
│
├── angular.json                     # Configuración Angular
├── tsconfig.json                    # Configuración TypeScript
├── karma.conf.js                    # Configuración de tests
├── package.json                     # Dependencias
├── vercel.json                      # Configuración Vercel
├── .env                             # Variables de entorno
├── .gitignore                       # Archivos ignorados
├── schema.sql                       # Esquema de BD
├── README.md                        # Documentación
├── DESARROLLO.md                    # Guía de desarrollo
└── ARQUITECTURA.md                  # Este archivo
```

## 🔐 Seguridad

### Autenticación
- Supabase Auth maneja tokens JWT
- Sesiones almacenadas en localStorage
- Guards protegen rutas no autenticadas

### Autorización
- Roles: admin y usuario
- Guards verifican permisos
- RLS (Row Level Security) en Supabase protege datos

### Validación
- Frontend: Validaciones en formularios
- Backend: Constraints en BD + Triggers SQL
- Conflictos: Validación lógica en servicios

## 💾 Persistencia de Datos

### Modelos de Datos

#### Usuarios
```typescript
{
  id: UUID (PK)
  email: string (UNIQUE)
  nombre: string
  apellido: string
  telefono?: string
  rol: 'admin' | 'usuario'
  fecha_registro: timestamp
  fecha_actualizacion: timestamp
}
```

#### Recursos
```typescript
{
  id: UUID (PK)
  nombre: string
  descripcion: string
  ubicacion: string
  capacidad: number
  tipo: string
  estado: 'activo' | 'inactivo'
  horario_inicio: time
  horario_fin: time
  fecha_creacion: timestamp
  fecha_actualizacion: timestamp
}
```

#### Reservas
```typescript
{
  id: UUID (PK)
  usuario_id: UUID (FK -> usuarios)
  recurso_id: UUID (FK -> recursos)
  fecha_inicio: date
  fecha_fin: date
  hora_inicio: time
  hora_fin: time
  estado: 'confirmada' | 'cancelada' | 'pendiente'
  motivo?: string
  notas?: string
  fecha_creacion: timestamp
  fecha_cancelacion?: timestamp
}
```

#### Horarios
```typescript
{
  id: UUID (PK)
  recurso_id: UUID (FK -> recursos)
  dia_semana: 0-6 (0=lunes, 6=domingo)
  hora_inicio: time
  hora_fin: time
  disponible: boolean
}
```

## 🎯 Patrones de Desarrollo

### Componentes
- **Smart Components**: Contienen lógica, conectan servicios
- **Dumb Components**: Solo presentación, sin lógica de negocio

### Servicios
- Singleton pattern (providedIn: 'root')
- RxJS Observables para reactividad
- Manejo de errores centralizado

### Formularios
- Reactive Forms (FormBuilder)
- Validaciones custom
- Manejo de errores de validación

### Enrutamiento
- Lazy loading de módulos
- Guards para proteger rutas
- Resolvers para precarga de datos (si es necesario)

## 🚀 Despliegue

### Desarrollo
```bash
npm install
npm start
```

### Producción
```bash
npm run build
vercel deploy --prod
```

### Variables de Entorno
```
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_ANON_KEY=tu_clave_anonima
```

## 📈 Escalabilidad

### Consideraciones Futuras
- Paginación en listados
- Infinite scroll
- Caché con IndexedDB
- Service Workers para offline
- Push notifications
- Websockets en tiempo real
- GraphQL en lugar de REST

## 🧪 Testing

### Estrategia
- Unit tests para servicios
- Component tests para lógica
- E2E tests para flujos críticos
- Coverage target: 80%

## 📊 Monitoreo

### Herramientas Recomendadas
- Sentry para error tracking
- Google Analytics para user behavior
- Vercel Analytics para performance

## 🔧 Mantenimiento

### Backup de BD
- Supabase realiza backups automáticos
- Exportar regularmente en producción

### Actualizaciones
- Angular: Revisar breaking changes
- Supabase: Sincronizar SDKs
- Dependencias: Auditar regularmente

---

**Última actualización**: 2024
**Versión**: 1.0.0

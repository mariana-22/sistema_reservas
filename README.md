# Sistema de Reservas de Espacios o Recursos

Sistema web completo para gestión de reservas de espacios o recursos con Angular, TypeScript, Supabase y PostgreSQL.

## 📋 Características

- ✅ Autenticación segura con Supabase
- ✅ Gestión completa de CRUD (Crear, Leer, Actualizar, Eliminar)
- ✅ Sistema de roles (Admin y Usuario)
- ✅ Validación de conflictos de horario
- ✅ Calendario de disponibilidad
- ✅ Panel de administración con estadísticas
- ✅ Interfaz responsive
- ✅ Base de datos PostgreSQL

## 🛠️ Stack Tecnológico

- **Frontend**: Angular 18 + TypeScript
- **Estilos**: SCSS
- **Backend/Base de Datos**: Supabase (PostgreSQL)
- **Control de Versiones**: Git + GitHub
- **Deployment**: Vercel

## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── core/
│   │   ├── models/          # Interfaces TypeScript
│   │   ├── services/        # Servicios (Supabase, Usuario, Recurso, Reserva)
│   │   └── guards/          # Guards de autenticación
│   ├── shared/              # Componentes compartidos
│   ├── features/
│   │   ├── auth/            # Autenticación (Login, Registro, Perfil)
│   │   ├── resources/       # Gestión de Recursos
│   │   ├── reservations/    # Gestión de Reservas
│   │   ├── dashboard/       # Dashboard principal
│   │   └── admin/           # Panel de administración
│   ├── app.component.*      # Componente raíz
│   ├── app.routes.ts        # Definición de rutas
│   └── app.config.ts        # Configuración
├── styles.scss              # Estilos globales
├── index.html               # HTML principal
└── main.ts                  # Punto de entrada
```

## 🚀 Guía de Instalación Rápida

👉 **Ver: [QUICK_START.md](./QUICK_START.md)** para instrucciones paso a paso

### Resumen Rápido

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar variables de entorno
# - Opción A: Abre SETUP-CONFIGURATION.html en tu navegador
# - Opción B: Crea archivo .env con credenciales de Supabase

# 3. Crear tablas en Supabase
# Ejecuta schema.sql en Supabase SQL Editor

# 4. Iniciar desarrollo
npm start

# 5. Acceder a la aplicación
# http://localhost:4200
```

## 📋 Requisitos Previos
- Node.js 18+
- npm o yarn
- Cuenta de Supabase (gratis en [supabase.com](https://supabase.com))

### ⚡ Instalación Rápida

👉 **Para instrucciones detalladas, consulta [QUICK_START.md](./QUICK_START.md)**

## 📚 Documentación Importante

| Documento | Propósito |
|-----------|----------|
| [QUICK_START.md](./QUICK_START.md) | Guía paso a paso para comenzar |
| [POWERSHELL_DISABLED.md](./POWERSHELL_DISABLED.md) | Si PowerShell está deshabilitado (Windows) |
| [ERRORES_CORREGIDOS.md](./ERRORES_CORREGIDOS.md) | Resumen de problemas arreglados |
| [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) | Solución de errores comunes |
| [ARQUITECTURA.md](./ARQUITECTURA.md) | Arquitectura del proyecto |
| [DESARROLLO.md](./DESARROLLO.md) | Fases de desarrollo |

```bash
git clone <tu-repositorio>
cd sistema-reservas
npm install
# Configura SUPABASE_URL y SUPABASE_ANON_KEY (ver QUICK_START.md)
npm start
```

La aplicación estará disponible en `http://localhost:4200`

## 📚 Entidades Principales

### Usuarios
- Email
- Nombre y Apellido
- Teléfono (opcional)
- Rol (admin/usuario)
- Fechas de registro y actualización

### Recursos
- Nombre, Descripción, Ubicación
- Capacidad
- Tipo (sala, equipo, laboratorio, etc.)
- Estado (activo/inactivo)
- Horarios disponibles

### Reservas
- Usuario que reserva
- Recurso a reservar
- Fecha y hora de inicio/fin
- Estado (confirmada, cancelada, pendiente)
- Motivo y notas

### Horarios
- Día de la semana
- Hora de inicio y fin
- Disponibilidad

## 🔐 Roles y Permisos

### Usuario Regular
- Ver recursos disponibles
- Crear reservas
- Ver sus propias reservas
- Cancelar sus reservas
- Editar perfil

### Administrador
- Todas las funciones del usuario
- Crear/editar/eliminar recursos
- Ver todas las reservas
- Ver estadísticas del sistema
- Gestionar usuarios

## 🌐 Despliegue

### Desplegar en Vercel

1. **Conectar repositorio**
```bash
vercel link
```

2. **Configurar variables de entorno en Vercel**
- Copia `SUPABASE_URL` y `SUPABASE_ANON_KEY` desde tu `.env`

3. **Desplegar**
```bash
vercel --prod
```

O simplemente haz push a GitHub y Vercel desplegará automáticamente.

## 📝 Funcionalidades Principales

### Autenticación
- Registro de nuevo usuario
- Login con email y contraseña
- Logout
- Gestión de sesiones

### Gestión de Recursos (CRUD)
- Listar todos los recursos disponibles
- Ver detalles de un recurso
- Buscar recursos
- (Admin) Crear nuevo recurso
- (Admin) Editar recurso
- (Admin) Eliminar recurso

### Gestión de Reservas (CRUD)
- Crear nueva reserva
- Listar reservas personales
- Ver detalles de reserva
- Modificar reserva
- Cancelar reserva
- Validación automática de conflictos

### Dashboard
- Bienvenida
- Acceso rápido a funciones principales

### Panel Admin
- Estadísticas generales
- Recursos más reservados
- Últimas reservas
- Gestión de usuarios

## ⚙️ Configuración de Supabase

### Row Level Security (RLS)

Para mayor seguridad, activa RLS en Supabase:

1. **Tabla usuarios**: Solo el usuario y admin pueden leer/escribir
2. **Tabla recursos**: Todos pueden leer, solo admin puede modificar
3. **Tabla reservas**: Usuarios ven sus propias, admin ve todas
4. **Tabla horarios**: Solo admin puede modificar

## 🧪 Testing

```bash
npm test
```

## 🐛 Troubleshooting

### Variables de entorno no se cargan
- Verifica que `.env` esté en la raíz del proyecto
- Reinicia el servidor de desarrollo

### Error de conexión a Supabase
- Verifica que `SUPABASE_URL` y `SUPABASE_ANON_KEY` sean correctos
- Comprueba que tu proyecto de Supabase esté activo

### Conflictos de horario no se validan
- Asegúrate de ejecutar `schema.sql` completamente
- Verifica que los índices se crearon correctamente

## 📞 Soporte

Para reportar issues o sugerencias, abre un issue en el repositorio.

## 📄 Licencia

Este proyecto está bajo licencia MIT.

## 👤 Autor

Proyecto desarrollado como sistema de reservas de espacios.

# KUI Central

Sistema de gestión integral para instituciones educativas que utilizan un LMS.

## 🚀 Características

- ✅ Autenticación con JWT
- ✅ Dashboard con estadísticas en tiempo real
- ✅ CRUD completo de instituciones
- ✅ Gestión de estados (Activo, Suspendido, Vencido)
- ✅ Búsqueda y filtros
- ✅ Diseño corporativo moderno
- ✅ Totalmente responsive

## 🛠️ Stack Tecnológico

- **React** + **Vite**
- **TypeScript**
- **React Router** v7
- **TailwindCSS** v4
- **TanStack Query** (React Query)
- **React Hook Form** + **Zod**
- **Axios**
- **Sonner** (Toasts)
- **Lucide React** (Icons)

## 📦 Instalación

```bash
# Instalar dependencias
pnpm install

# Configurar variables de entorno
# Crear archivo .env y configurar:
VITE_CENTRAL_BACKEND_URL=http://localhost:8080
```

## 🎯 Uso

La aplicación está configurada para conectarse a un backend REST. Asegúrate de que tu backend esté corriendo en la URL configurada en `.env`.

### Endpoints esperados:

- `POST /api/auth/login` - Autenticación
- `GET /api/instituciones` - Listar instituciones
- `GET /api/instituciones/:id` - Obtener institución
- `POST /api/instituciones` - Crear institución
- `PUT /api/instituciones/:id` - Actualizar institución
- `DELETE /api/instituciones/:id` - Eliminar institución
- `PATCH /api/instituciones/:id/activar` - Activar institución
- `PATCH /api/instituciones/:id/suspender` - Suspender institución
- `PATCH /api/instituciones/:id/renovar` - Renovar institución con `{ fechaVencimiento }`
- `GET /api/licencia/validar/:apiKey` - Validar licencia sin auth
- `GET /api/licencia/validar/id/:institutionId` - Validar licencia por id sin auth

### Contrato de instituciones

- `tipo` usa valores `COLEGIO`, `INSTITUTO`, `ACADEMIA`
- Respuesta incluye `apiKey` y `fechaCreacion`
- `estado` usa valores `ACTIVO`, `SUSPENDIDO`, `VENCIDO`

### Login demo

- Email: `admin@backend.com`
- Password: `admin123`

## 🎨 Paleta de Colores

- Naranja Principal: `#F97316`
- Naranja Hover: `#EA580C`
- Verde Éxito: `#22C55E`
- Rojo Error: `#EF4444`
- Amarillo Advertencia: `#F59E0B`
- Gris Fondo: `#F8FAFC`
- Gris Texto: `#64748B`
- Gris Bordes: `#E2E8F0`

## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── App.tsx           # Componente principal
│   ├── routes.tsx        # Configuración de rutas
│   └── components/       # Componentes de Figma
├── components/           # Componentes reutilizables
│   ├── AppSidebar.tsx
│   ├── Topbar.tsx
│   ├── StatCard.tsx
│   ├── StatusBadge.tsx
│   ├── ConfirmModal.tsx
│   ├── Loader.tsx
│   └── EmptyState.tsx
├── pages/                # Páginas de la aplicación
│   ├── Login.tsx
│   ├── Dashboard.tsx
│   ├── Instituciones.tsx
│   ├── CrearInstitucion.tsx
│   └── EditarInstitucion.tsx
├── layouts/              # Layouts
│   ├── AuthLayout.tsx
│   └── MainLayout.tsx
├── services/             # Servicios API
│   ├── auth.service.ts
│   └── instituciones.service.ts
├── store/                # Estado global
│   └── AuthContext.tsx
├── lib/                  # Configuraciones
│   └── axios.ts
└── styles/               # Estilos
    ├── theme.css
    └── fonts.css
```

## 🔐 Autenticación

El sistema utiliza JWT almacenado en `localStorage`. Si el token expira (401), el usuario es redirigido automáticamente al login.

## 📱 Navegación

- **Dashboard** - Vista general con estadísticas
- **Instituciones** - Lista completa con búsqueda
- **Crear Institución** - Formulario de registro
- **Editar Institución** - Actualizar datos

---

Desarrollado con ❤️ para **KUI**

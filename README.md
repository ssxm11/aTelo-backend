# aTelo Backend

API REST para la gestión de usuarios y autenticación del proyecto aTelo.

## 🚀 Instalación

```bash
npm install
```

## 📁 Estructura del Proyecto

```
src/
├── server.ts              # Punto de entrada de la aplicación
├── config/
│   └── database.ts        # Configuración de MongoDB
├── models/
│   └── User.ts            # Modelo de usuario
├── controllers/
│   ├── authController.ts  # Controlador de autenticación (Login/Register)
│   └── userController.ts  # Controlador CRUD de usuarios
├── middleware/
│   ├── auth.ts            # Middleware de protección de rutas
│   ├── errorHandler.ts    # Middleware de manejo de errores
│   └── notFound.ts        # Middleware para rutas no encontradas
├── routes/
│   ├── authRoutes.ts      # Rutas de autenticación
│   └── userRoutes.ts      # Rutas de usuarios
└── utils/
    └── AppError.ts        # Clase de errores personalizada
```

## 🛠️ Tecnologías

- Node.js
- Express
- MongoDB
- TypeScript

## 📝 Scripts Disponibles

```bash
npm start        # Iniciar servidor en producción
npm run dev      # Iniciar servidor en modo desarrollo
npm run build    # Compilar TypeScript a JavaScript
```

## 🔐 Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
PORT=5000
MONGODB_URI=tu_uri_de_mongodb
JWT_SECRET=tu_secreto_jwt
```

## 📚 API Endpoints

### Autenticación
- `POST /api/auth/register` - Registrar nuevo usuario
- `POST /api/auth/login` - Iniciar sesión

### Usuarios
- `GET /api/users` - Obtener todos los usuarios (protegido)
- `GET /api/users/:id` - Obtener usuario por ID (protegido)
- `PUT /api/users/:id` - Actualizar usuario (protegido)
- `DELETE /api/users/:id` - Eliminar usuario (protegido)

## 📄 Licencia

Este proyecto es privado y confidencial.
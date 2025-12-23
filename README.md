# aTelo-backend
 - npm i
 
## estructura del proyecto
src/
├── server.ts              # Punto de entrada
├── config/
│   └── database.ts        # Configuración de MongoDB
├── models/
│   └── User.ts            # Modelo de usuario
├── controllers/
│   ├── authController.ts  # Login/Register
│   └── userController.ts  # CRUD de usuarios
├── middleware/
│   ├── auth.ts            # Protección de rutas
│   ├── errorHandler.ts    # Manejo de errores
│   └── notFound.ts        # Rutas no encontradas
├── routes/
│   ├── authRoutes.ts      # Rutas de autenticación
│   └── userRoutes.ts      # Rutas de usuarios
└── utils/
    └── AppError.ts        # Clase de errores personalizada

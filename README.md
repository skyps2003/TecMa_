<<<<<<< HEAD
# 🛠️ Sistema de Inventario TECMA | Enterprise Edition

![TECMA Banner](https://via.placeholder.com/1200x400/0f172a/38bdf8?text=TECMA+INVENTARIO+v2.0)

> **Gestión profesional de activos, repuestos y logística para talleres modernos.**  
> Desarrollado con el Stack MERN (MongoDB, Express, React, Node) y diseño UI de alto impacto.

---

## ✨ Características "God Tier"

### 📦 1. Inventario 2.0 (Nueva Generación)
- **⚡ Edición Rápida**: Control de stock (`+` / `-`) directamente desde las tarjetas. Sin recargas.
- **✏️ Edición Completa**: Modal avanzado para modificar precios, imágenes, categorías y proveedores.
- **🏷️ Clasificación Inteligente**: Separación visual y lógica entre *Herramientas* (Activos fijos) y *Repuestos* (Consumibles con precio).
- **👁️ UI Glassmorphism**: Tarjetas con efectos de desenfoque, estados hover y modo oscuro nativo.

### 📊 2. Reportes Ejecutivos & PDF
- **📄 Motor PDF Nativo**: Generación de "Reportes Oficiales" con membrete, logo y paginación automática.
- **💰 Valoración en Tiempo Real**: Gráficos de área (Emerald Gradient) que muestran la evolución financiera del inventario.
- **📉 Análisis de Categorías**: Distribución visual de recursos por tipo.

### 🏢 3. Gestión de Proveedores (SUNAT API)
- **🔍 Búsqueda RUC**: Integración con APIs de Perú para autocompletar datos de empresas.
- **🔗 Vinculación**: Asigna proveedores a productos específicos para trazabilidad de compras.

### 🎨 4. Experiencia de Usuario (UX)
- **🌙 Dark Mode**: Sistema completo de colores adaptativos para fatiga visual reducida.
- **🔔 Notificaciones**: Feedback instantáneo (Toast) para cada acción (Creación, Edición, Error).
- **📱 Responsive**: Diseño fluido adaptable a tablets y monitores de escritorio.

---

## 🛠️ Stack Tecnológico

| Área | Tecnología | Uso |
|------|------------|-----|
| **Frontend** | React 18 + Vite | SPA ultrarrápida |
| **Estilos** | Tailwind CSS 3 | Diseño atómico y responsivo |
| **Gráficos** | Recharts | Visualización de datos interactiva |
| **Reportes** | jsPDF + AutoTable | Generación de documentos oficiales |
| **Backend** | Node.js + Express | API RESTful escalable |
| **Bases de Datos** | MongoDB Atlas | Persistencia de datos NoSQL |
| **Imágenes** | Multer | Gestión de cargas de archivos locales |

---

## 🚀 Instalación y Despliegue

Sigue estos pasos para levantar el proyecto en local:

### 1. Clonar el repositorio
```bash
git clone https://github.com/tu-usuario/tecma-inventario.git
cd tecma-inventario
```

### 2. Backend (Servidor API)
```bash
cd backend
npm install
```
Configura tus variables de entorno en `backend/.env`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/Inventario
JWT_SECRET=tu_secreto_super_seguro
```
Iniciar servidor:
```bash
npm run dev
# Server running on port 5000
```

### 3. Frontend (Interfaz de Usuario)
```bash
cd frontend
npm install
npm run dev
# Local: http://localhost:5174
```

---

## 📂 Estructura del Proyecto

```
tecma-inventario/
├── backend/
│   ├── controllers/   # Lógica de negocio (Inventario, Usuarios, Dashboard)
│   ├── models/        # Esquemas Mongoose
│   ├── routes/        # Endpoints API
│   └── uploads/       # Almacenamiento de imágenes
│
└── frontend/
    ├── src/
    │   ├── api/       # Configuración Axios
    │   ├── components/# UI Reutilizable (Layout, Modales, Tarjetas)
    │   ├── pages/     # Vistas principales (Inventario, Reportes, Login)
    │   └── context/   # Estado global (Auth, Theme)
```

---

## 🔒 Seguridad
- **JWT (JSON Web Tokens)**: Protección de rutas privadas.
- **Bcrypt**: Hashing de contraseñas.
- **Middleware**: Validación de roles (Admin/User).

---

### © 2026 TECMA S.A.C.
*Eficiencia que impulsa tu negocio.*
=======
# TecMa_
>>>>>>> 6db6c67900b86ad4cdec887df6f4993a6f924296

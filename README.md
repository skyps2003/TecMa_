# Sistema de Inventario TEFMA MOTORS S.A.C.
### Enterprise Edition 2.0

<div align="center">
  <img src="https://via.placeholder.com/1200x400/0f172a/38bdf8?text=TEFMA+INVENTARIO+v2.0" alt="TEFMA Banner" width="100%" />

  <br />
  
  > **Gestión profesional de activos, repuestos y logística para talleres modernos.**  
  > *Desarrollado con el Stack MERN y diseño UI premium.*

  <br />

  ![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
  ![NodeJS](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
  ![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
  ![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
  
</div>

---

## ✨ Características

### 1. Inventario 2.0 (Nueva Generación)
- **Edición Rápida**: Control de stock (`+` / `-`) directamente desde las tarjetas. Sin recargas.
- **Edición Completa**: Modal avanzado para modificar precios, imágenes, categorías y proveedores.
- **Clasificación Inteligente**: Separación visual y lógica entre *Herramientas* (Activos fijos) y *Repuestos* (Consumibles con precio).
- **UI Glassmorphism**: Tarjetas con efectos de desenfoque, estados hover y modo oscuro nativo.
- **Notificaciones Reales**: Sistema de alertas en tiempo real para cambios de stock, nuevos productos y eliminaciones.

### 2. Reportes Ejecutivos & PDF
- **Reportes Oficiales**: Generación de PDFs con membrete de TEFMA MOTORS, RUC y dirección fiscal.
- **Tendencia de Inversión**: Gráfico financiero dinámico que muestra la inversión mensual de los últimos 6 meses.
- **Análisis de Categorías**: Distribución visual de recursos por tipo.

### 3. Gestión de Proveedores
- **Gestión Centralizada**: Registro y administración de proveedores con RUC y Razón Social.
- **Vinculación**: Asigna proveedores a productos específicos para trazabilidad de compras.

### 4. Experiencia de Usuario (UX) Premium
- **Dark Mode**: Sistema completo de colores adaptativos para fatiga visual reducida.
- **Responsive**: Diseño fluido adaptable a tablets y monitores de escritorio.
- **Performance**: Transiciones suaves y cargas optimizadas.

---

## 🔒 Seguridad
- **JWT (JSON Web Tokens)**: Protección de rutas privadas.
- **Bcrypt**: Hashing de contraseñas.
- **Middleware**: Validación de roles (Admin/User).

---

## Manual de Usuario

### 1. Panel Principal (Dashboard)
El centro de control de tu negocio. Aquí encontrarás:
- **KPIs en Tiempo Real**: Valor total del inventario, stock bajo, y conteo de proveedores.
- **Gráficos Dinámicos**: 
  - *Estado de Herramientas*: Visualiza cuántas herramientas están operativas, en mantenimiento o extraviadas.
  - *Tendencia de Inversión*: Monitorea tus gastos en inventario mes a mes.
  - *Distribución*: Entiende qué categorías ocupan más espacio en tu almacén.

### 2. Gestión de Inventario
- **Agregar Producto**: Usa el botón "Nuevo Producto". Selecciona si es *Repuesto* o *Herramienta*.
  - *Repuestos*: Requieren precio de compra/venta y stock mínimo.
  - *Herramientas*: Requieren marca y estado (Operativo/Mantenimiento).
- **Control de Stock**: Usa los botones `+` y `-` en cada tarjeta para ajustes rápidos. Ojo con las notificaciones de stock bajo.
- **Búsqueda y Filtros**: Encuentra ítems por nombre o fíltralos por tipo ("Repuestos" vs "Herramientas").

### 3. Reportes
- Ve a la sección **Reportes** para un análisis profundo.
- **Exportar PDF**: Haz clic en "Exportar PDF Oficial" para generar un documento listo para imprimir con toda la data actual.
- **Exportar Excel**: Descarga la data cruda para procesarla externamente.

### 4. Notificaciones
- Mantente al día con el icono de campana en la barra superior.
- Recibirás alertas cuando:
  - Se agregue un nuevo producto.
  - El stock cambie.
  - Se elimine un ítem.
- Puedes marcar todas como leídas o borrarlas individualmente.

---

## Instalación y Configuración

Sigue estos pasos para desplegar el proyecto en tu entorno local:

### 1. Clonar el Repositorio
```bash
git clone https://github.com/skyps2003/TecMa_
cd TecMa_
```

### 2. Configurar el Backend (Servidor)
```bash
cd backend
npm install
```
 Crea un archivo `.env` en la carpeta `backend` con las siguientes credenciales:
```env
PORT=5000
MONGO_URI=mongodb+srv://<usuario>:<password>@cluster.mongodb.net/Inventario
JWT_SECRET=tu_secreto_super_seguro
```
*Nota: Asegúrate de tener acceso a tu cluster de MongoDB Atlas.*

Iniciar servidor:
```bash
npm run dev
# Deberías ver: Server running on port 5000
```

### 3. Configurar el Frontend (Interfaz)
Abre una nueva terminal:
```bash
cd frontend
npm install
npm run dev
```
El sistema estará disponible en: `http://localhost:5173`

---

## Estructura del Proyecto

```
TecMa_/
├── backend/
│   ├── controllers/   # Lógica de negocio (Inventario, Notificaciones, etc.)
│   ├── models/        # Esquemas de Base de Datos (Mongoose)
│   ├── routes/        # Rutas de la API (Endpoints)
│   └── seeder.js      # Script para generar datos de prueba
│
└── frontend/
    ├── src/
    │   ├── api/       # Conexión con Backend (Axios)
    │   ├── components/# Componentes UI (Layout, Dashboard, Gráficos)
    │   ├── pages/     # Páginas principales (Inventario, Reportes)
    │   └── context/   # Manejo de sesión y temas
```

---

### © 2026 TEFMA MOTORS S.A.C.
*Eficiencia que impulsa tu negocio.*

# 🪞 ESMAE - E-commerce Full Stack

![Esmae Banner](https://i.imgur.com/g1L6ey0.png)

## 📋 Descripción

**Esmae** es una plataforma de comercio electrónico moderna diseñada para la venta de artículos de decoración, espejos y bazar. Este proyecto fue desarrollado desde cero para simular un entorno de producción real, enfocándose en la experiencia de usuario (UX), el rendimiento y una administración de datos eficiente.

El objetivo principal fue construir una solución **Full Stack** escalable utilizando las últimas tecnologías del ecosistema React y Next.js.

🔗 **[esmae.vercel.app](https://esmae.vercel.app/)**

---

## 🚀 Tecnologías Utilizadas

### Frontend
- **Next.js 15 (App Router):** Framework principal para renderizado híbrido (SSR/CSR).
- **React & TypeScript:** Para una UI robusta y tipada.
- **Tailwind CSS:** Diseño 100% responsive y estilizado moderno.
- **Lucide React:** Iconografía optimizada.

### Backend & Base de Datos
- **Next.js API Routes:** API RESTful integrada.
- **Prisma ORM:** Manejo de base de datos y migraciones.
- **MySQL (Railway):** Base de datos relacional en la nube.
- **NextAuth.js:** Autenticación segura y gestión de sesiones.

### Infraestructura
- **Vercel:** Despliegue continuo (CI/CD).
- **Cloudinary:** (Si usaste para imágenes) Gestión de medios en la nube.

---

## ✨ Funcionalidades Clave

### 👤 Para el Cliente:
- **Catálogo Dinámico:** Filtrado de productos por categorías y búsqueda en tiempo real.
- **Carrito de Compras:** Persistencia de estado y gestión de cantidades (Context API).
- **Diseño Responsive:** Adaptado perfectamente a móviles, tablets y escritorio.
- **Contacto Directo:** Integración con WhatsApp para consultas rápidas.

### 🛡️ Para el Administrador:
- **Panel de Control (Dashboard):** Acceso protegido por roles.
- **Gestión de Productos:** Crear, editar y eliminar productos (CRUD completo).
- **Vista de Órdenes:** (Si lo implementaste) Seguimiento de pedidos.

---

## 🛠️ Instalación y Configuración Local

Si deseas correr este proyecto en tu máquina local:

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/nicopazz/esmae.git
   cd esmae
2. **Instalar dependencias:**
   ```bash
   npm install
3. **Configurar Variables de Entorno: Crea un archivo .env en la raíz y agrega:**
   ```bash
    DATABASE_URL= "mysql://usuario:password@localhost:3306/esmae_db"
    RESEND_API_KEY="re_VLZ9239n_565EEht3HgspTAiCNiUTCv6Z"
    EXT_PUBLIC_CLOUDINARY_CLOUD_NAME="Tuclave"
    NEXT_PUBLIC_CLOUDINARY_PRESET="Tuclave"
    NEXTAUTH_URL="http://localhost:3000"
    NEXTAUTH_SECRET="tu_secreto_super_seguro"
4. **Configurar la Base de Datos:**
   ```bash
    npx prisma generate
    npx prisma db push
5. **Configurar la Base de Datos:**
   ```bash
    npm run dev


## 🧠 Aprendizajes del Proyecto:
Durante el desarrollo de Esmae, profundicé en:

- **Manejo de Caché en Next.js:**  Aprendí a controlar el Static Site Generation y forzar el renderizado dinámico (force-dynamic) para datos en tiempo real.

- **Gestión de Estado:** Uso de Context API para manejar el carrito de compras globalmente.

- **Despliegue en Producción:** Configuración de bases de datos remotas en Railway y variables de entorno en Vercel.

## 📬 Contacto

**Nicolás Paz - Full Stack Developer**

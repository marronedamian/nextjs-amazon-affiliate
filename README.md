# 🛍️ BestPickr - Amazon Affiliate + Social Platform

**BestPickr** es una plataforma moderna desarrollada en Next.js que combina lo mejor de dos mundos:

1. 📝 Un blog de reseñas de productos con enlaces de afiliado de Amazon
2. 📸 Una red social donde los usuarios pueden compartir publicaciones, historias, reseñas y recomendaciones personales

---

## 🌐 Demo en producción

👉 Probalo en: [https://bestpickr.store](https://bestpickr.store)

Este proyecto es **open source** y está abierto a la comunidad. ¡Cualquier aporte que mejore la plataforma es bienvenido!

---

## 🚀 Tecnologías principales

- **Next.js (App Router)** + **TypeScript**
- **Tailwind CSS**
- **Prisma ORM + PostgreSQL**
- **Docker + Docker Compose**
- **Jest + Testing Library**
- **Internacionalización (`[lang]`)**
- **Sistema de rutas SEO-friendly (`sitemap.xml`, `robots.txt`)**
- **Soporte para usuarios, historias, publicaciones y perfiles**

---

## 🧠 Funcionalidades destacadas

- 📚 Blog con reseñas de productos y enlaces de afiliado
- 🧑‍🤝‍🧑 Red social: perfiles, publicaciones, historias (tipo "stories")
- 🔒 Sistema de autenticación con rutas protegidas
- 🌍 Soporte multilenguaje
- 🔗 Sistema de afiliados con seguimiento
- 📦 Estructura escalable y modular

---

## 📁 Estructura del proyecto

```
📦 app/
 ┣ 📂[lang]/[username]        # Rutas por idioma y perfil
 ┣ 📂auth, blog, landing, messages, notifications, onboarding, post/
 ┣ 📜 layout.tsx, page.tsx

📦 components/
 ┣ Blog/, Category/, Feed/, Follow/, Home/, Messages/
 ┣ Navigation/, Notifications/, Onboarding/, Posts/
 ┣ Profile/, Reels/, Shared/, Story/...

📂 context/, data/, hooks/, lib/, mocks/, utils/, tests/
📂 prisma/, providers/, pages/, public/, styles/, types/
📜 .env, .env.example, Dockerfile, docker-compose.yml, tailwind.config.js, etc.
```

---

## 🛠️ Instalación

```bash
git clone https://github.com/marronedamian/nextjs-amazon-affiliate.git
cd nextjs-amazon-affiliate

npm install
cp .env.example .env

# Usando Docker
docker-compose up --build

# O localmente
npx prisma generate
npx prisma migrate dev
npm run dev
```

---

## ✅ Pruebas

```bash
npm run test
```

---

## 🤝 Contribuir

Este proyecto está abierto a la comunidad. Si querés ayudar:

1. Fork del repo
2. Creá una rama: `feature/nueva-funcionalidad`
3. Hacé tus cambios + tests
4. Pull Request con descripción clara

---

## 🧭 Roadmap (ideas futuras)

- Feed personalizado basado en intereses
- Reacciones y comentarios en publicaciones
- Integración con más programas de afiliados
- Paginación y filtrado avanzado de productos
- Dashboard para usuarios creadores

---

## 📄 Licencia

MIT © [Damian Marrone](https://github.com/marronedamian)
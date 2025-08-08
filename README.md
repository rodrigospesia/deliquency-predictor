# Frontend – Delinquency Predictor

Este repositorio contiene la **interfaz de usuario** (frontend) del prototipo de predicción de morosidad. Está construida con **Next.js** y desplegada en **Vercel**.

---

## 📋 Proyecto

La aplicación permite ingresar datos de un cliente y mostrar el resultado de una predicción de riesgo crediticio (morosidad), generada por la API de Flask con modelo Random Forest.

---

## 🛠 Tecnologías utilizadas

- **Next.js** (React-based framework)
- **React**
- **Fetch API** para comunicarse con el backend (Predictor API)
- **CSS Modules / Styled JSX** (según la configuración del proyecto)
- **Vercel** como plataforma de despliegue

---

## 📂 Estructura del proyecto

```
deliquency-predictor/
│
├── pages/
│   ├── index.js        # Página principal con formulario para capturar datos del cliente
│   └── _app.js         # Override del App de Next.js (para estilos o providers globales)
├── components/         # Componentes reutilizables (p. ej. inputs, botones, layout)
├── public/             # Assets estáticos (logo, favicon, etc.)
├── styles/             # Estilos globales o por módulos
├── package.json        # Dependencias y scripts
├── next.config.js      # Configuración personalizada de Next.js (si aplica)
└── README.md           # Este archivo
```

---

## ⚙️ Instalación y desarrollo local

1. Clona el repositorio:
   ```bash
   git clone https://github.com/rodrigospesia/deliquency-predictor.git
   cd deliquency-predictor
   ```

2. Instala dependencias con pnpm:
   ```bash
   pnpm install
   ```

3. Inicia el entorno de desarrollo:
   ```bash
   pnpm dev
   ```

   La app estará disponible en `http://localhost:3000`.

4. Asegúrate de que tu instancia del backend (Predictor API) esté en ejecución, ya sea local o en Fly.io, para que el frontend se comunique correctamente.

---

## 🚀 Uso

1. Navega a `http://localhost:3000`.
2. Llena el formulario con los datos del cliente.
3. Pulsa "Evaluar" (o el botón equivalente).
4. La interfaz mostrará los resultados: `mal_pagador` (sí/no) y la `probabilidad` de morosidad.

---

## ☁️ Despliegue

El frontend está desplegado automáticamente en Vercel. Al hacer push a la rama principal (normalmente `main` o `master`), Vercel genera una nueva versión en producción.

Para configurar tu propio despliegue en Vercel:

1. Entra a [Vercel](https://vercel.com/) y conecta tu cuenta de GitHub.
2. Importa el proyecto `deliquency-predictor`.
3. Usa los ajustes por defecto (`pnpm build` + `pnpm start` o `next start`).
4. Asegúrate de configurar correctamente la variable de entorno con la URL del backend si aplica.

---

## 🎨 Diseño

- UI clara y minimalista para enfocar al usuario en capturar datos y obtener los resultados rápidamente.
- Feedback visual sencillo (como carga, errores o éxito) para mejorar la experiencia.
- Responsiva y optimizada para dispositivos móviles.

---

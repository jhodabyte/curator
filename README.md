# Curator — tienda y checkout (monorepo)

SPA React + API NestJS: catálogo con stock, checkout con tarjeta (sandbox del proveedor de pagos), transacciones, clientes y envíos. Backend con arquitectura hexagonal y casos de uso con patrón tipo railway (`Result`).

## Stack

| Área | Tecnologías |
|------|-------------|
| Frontend | React 19, Vite, TypeScript, Redux Toolkit, React Router, Tailwind CSS |
| Backend | NestJS 11, TypeScript, TypeORM, PostgreSQL |
| Contrato HTTP | OpenAPI 3 vía Swagger (`/api/docs`) |
| Tests | Jest (API), Vitest + Testing Library (frontend) |

## Estructura del repositorio

| Carpeta | Contenido |
|---------|-----------|
| `curator/` | Aplicación Vite + React |
| `curator-api/` | API NestJS |

## Requisitos previos

- **Node.js** 20 o superior
- **PostgreSQL** accesible localmente o en red
- Base de datos creada, por ejemplo: `CREATE DATABASE curator;`

## Puesta en marcha (local)

**1. API**

```bash
cd curator-api
cp .env.example .env
```

Edita `.env` con tus credenciales de Postgres y las llaves del sandbox del proveedor de pagos (documentación oficial del entorno de pruebas).

```bash
npm install
npm run start:dev
```

Por defecto escucha en `http://localhost:3000`.

**2. Frontend**

```bash
cd curator
cp .env.example .env
```

Ajusta `VITE_API_BASE_URL` si el API no está en `http://localhost:3000`. Opcional: `VITE_WOMPI_API_URL` y `VITE_WOMPI_PUBLIC_KEY` (si no las defines, el proyecto usa valores por defecto pensados solo para desarrollo).

```bash
npm install
npm run dev
```

Vite suele servir en `http://localhost:5173`.

Orden recomendado: levantar primero el API y luego el front.

## Variables de entorno

### Backend (`curator-api/.env`)

| Variable | Descripción |
|----------|-------------|
| `PORT` | Puerto HTTP (por defecto `3000`) |
| `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` | Conexión PostgreSQL |
| `WOMPI_API_URL` | URL base del API del proveedor (sandbox) |
| `WOMPI_PUBLIC_KEY` | Llave pública del comercio (sandbox) |
| `WOMPI_PRIVATE_KEY` | Llave privada del comercio (sandbox) |
| `WOMPI_INTEGRITY_SECRET` | Secreto para firma de integridad en transacciones |

No subas `.env` al repositorio.

### Frontend (`curator/.env`)

| Variable | Descripción |
|----------|-------------|
| `VITE_API_BASE_URL` | URL del backend (ej. `http://localhost:3000`) |
| `VITE_WOMPI_API_URL` | URL del API del proveedor para tokenizar tarjeta en el navegador |
| `VITE_WOMPI_PUBLIC_KEY` | Misma llave pública sandbox (solo expuesta al cliente para tokenización) |

## Documentación HTTP y Postman

Con el API en ejecución:

| Recurso | URL local |
|---------|-----------|
| Swagger UI | `http://localhost:3000/api/docs` |
| OpenAPI JSON | `http://localhost:3000/api/docs-json` |

**Postman:** *Import* → *Link* → pega `http://localhost:3000/api/docs-json` (con el servidor arrancado). Tras desplegar el API, sustituye el host por la URL pública.

## Modelo de datos (resumen)

- **Product:** identificador, nombre, descripción, precio, stock, imágenes. Se siembra al arranque; no hay endpoint de alta de productos.
- **Customer:** nombre, email, teléfono; se crea en el flujo al registrar una transacción.
- **Transaction:** vínculo a cliente y producto, cantidades, montos (producto, tarifa base, envío, total), estado (`pending` / `completed` / `failed`), id externo del cobro.
- **Delivery:** vínculo a transacción, dirección, ciudad, cantidad, estado logístico.

Una transacción genera un cliente (si aplica el flujo), descuenta stock al completar el pago y crea un registro de envío.

## Endpoints principales

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/products` | Listado de productos y stock |
| POST | `/transactions` | Crear transacción pendiente |
| GET | `/transactions/:id` | Consultar transacción |
| POST | `/transactions/:id/pay` | Enviar token de tarjeta y procesar pago |
| GET | `/customers/:id` | Cliente por id |
| GET | `/deliveries/:id` | Envío por id |
| GET | `/deliveries/by-transaction/:transactionId` | Envío asociado a una transacción |

## Pruebas y cobertura

Generar informes localmente:

```bash
cd curator-api && npm run test:cov
cd curator && npm run test:cov
```

**Última medición en este repositorio** (ejecutar de nuevo antes de una entrega formal):

| Proyecto | Herramienta | Statements | Branches |
|----------|-------------|------------|----------|
| `curator-api` | Jest | ~99.6 % | ~83.5 % |
| `curator` | Vitest | ~85.2 % | ~80.6 % |

El enunciado original del reto pedía Jest en frontend; aquí se usa **Vitest** (misma familia de aserciones y mocks, integrado con Vite). La cobertura supera el umbral del 80 % en statements y, en el front, en branches.

## Despliegue (checklist)

Sustituye las URLs de ejemplo por las reales y actualiza esta sección o el README de cada paquete cuando las tengas.

1. **Base de datos:** PostgreSQL gestionado (RDS, Neon, Supabase, etc.). Crea la base y usuario; copia la cadena de conexión a las variables `DB_*` del API.
2. **API:** `cd curator-api && npm run build` → ejecutar `node dist/main.js` (o el comando de tu plataforma: ECS, Railway, Render, etc.). Define todas las variables de `curator-api/.env.example` en el panel del hosting.
3. **CORS:** El código actual llama a `enableCors()` sin restricción de origen (cómodo para desarrollo). En producción conviene limitar orígenes al dominio del front (configuración en Nest o en el proxy / API Gateway delante del servicio).
4. **HTTPS:** Termina TLS en el balanceador, CDN o plataforma (obligatorio para tráfico real).
5. **Frontend:** `cd curator && npm run build` → publica la carpeta `dist/` en S3 + CloudFront, Vercel, Netlify u otro hosting estático. Define `VITE_API_BASE_URL` (y llaves públicas del sandbox si no usas build por defecto) **en tiempo de build** (`vite` inyecta solo variables con prefijo `VITE_`).
6. **Swagger público:** Tras desplegar, la documentación quedará en `https://<tu-api>/api/docs` y el JSON en `https://<tu-api>/api/docs-json`.

**Enlaces de entrega (rellenar):**

- **Frontend en producción:** _pendiente_
- **API en producción:** _pendiente_

## Problemas frecuentes

- **Postgres / `status` con null en `transactions`:** ver `curator-api/README.md` (script `scripts/fix-transactions-status-nulls.sql` o `DROP TABLE transactions`).
- **Front no llama al API:** revisa `VITE_API_BASE_URL`, firewall y CORS.
- **Pagos en sandbox:** usa siempre llaves y URL del entorno de pruebas del proveedor; no uses datos de tarjeta reales.

## Licencia

Uso educativo / prueba técnica. Revisa dependencias de terceros en cada `package.json`.

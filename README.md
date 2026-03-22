# Curator — tienda y checkout (monorepo)

SPA React + API NestJS: catálogo con stock, checkout con tarjeta (sandbox del proveedor de pagos), transacciones, clientes y envíos. Backend con arquitectura hexagonal y casos de uso con patrón tipo railway (`Result`).

## Stack

| Área          | Tecnologías                                                           |
| ------------- | --------------------------------------------------------------------- |
| Frontend      | React 19, Vite, TypeScript, Redux Toolkit, React Router, Tailwind CSS |
| Backend       | NestJS 11, TypeScript, TypeORM, PostgreSQL                            |
| Contrato HTTP | OpenAPI 3 vía Swagger (`/api/docs`)                                   |
| Tests         | Jest (API y frontend)                                                 |
| Infra         | AWS CDK (TypeScript)                                                  |

## Estructura del repositorio

| Carpeta   | Contenido               |
| --------- | ----------------------- |
| `web/`    | Aplicación Vite + React |
| `server/` | API NestJS              |
| `infra/`  | Infraestructura AWS CDK |

## Requisitos previos

- **Node.js** 20 o superior
- **PostgreSQL** accesible localmente o en red
- Base de datos creada, por ejemplo: `CREATE DATABASE curator;`

## Puesta en marcha (local)

**1. API**

```bash
cd server
cp .env.example .env
```

Edita `.env` con tus credenciales de Postgres y las llaves del sandbox del proveedor de pagos.

```bash
npm install
npm run start:dev
```

Por defecto escucha en `http://localhost:3000`.

**2. Frontend**

```bash
cd web
cp .env.example .env
```

Ajusta `VITE_API_BASE_URL` si el API no está en `http://localhost:3000`.

```bash
npm install
npm run dev
```

Vite suele servir en `http://localhost:5173`.

Orden recomendado: levantar primero el API y luego el front.

## Variables de entorno

### Backend (`server/.env`)

| Variable                                                  | Descripción                                       |
| --------------------------------------------------------- | ------------------------------------------------- |
| `PORT`                                                    | Puerto HTTP (por defecto `3000`)                  |
| `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` | Conexión PostgreSQL                               |
| `WOMPI_API_URL`                                           | URL base del API del proveedor de pagos (sandbox) |
| `WOMPI_PUBLIC_KEY`                                        | Llave pública del comercio (sandbox)              |
| `WOMPI_PRIVATE_KEY`                                       | Llave privada del comercio (sandbox)              |
| `WOMPI_INTEGRITY_SECRET`                                  | Secreto para firma de integridad en transacciones |

No subas `.env` al repositorio.

### Frontend (`web/.env`)

| Variable                | Descripción                                                        |
| ----------------------- | ------------------------------------------------------------------ |
| `VITE_API_BASE_URL`     | URL del backend (ej. `http://localhost:3000`)                      |
| `VITE_WOMPI_API_URL`    | URL del API del proveedor para tokenizar tarjeta en el navegador   |
| `VITE_WOMPI_PUBLIC_KEY` | Llave pública sandbox (solo expuesta al cliente para tokenización) |

## Documentación HTTP y Postman

Con el API en ejecución:

| Recurso      | URL local                             |
| ------------ | ------------------------------------- |
| Swagger UI   | `http://localhost:3000/api/docs`      |
| OpenAPI JSON | `http://localhost:3000/api/docs-json` |

**Postman:** _Import_ → _Link_ → pega `http://localhost:3000/api/docs-json` (con el servidor arrancado).

## Modelo de datos

```
┌──────────────────────┐       ┌──────────────────────┐
│      products        │       │   product_images     │
├──────────────────────┤       ├──────────────────────┤
│ id          UUID  PK │──┐    │ id          UUID  PK │
│ name        VARCHAR  │  └───<│ product_id  UUID  FK │
│ description TEXT     │       │ url         VARCHAR  │
│ price       DECIMAL  │       └──────────────────────┘
│ stock       INT      │
└──────────────────────┘

┌──────────────────────┐
│     customers        │
├──────────────────────┤
│ id          UUID  PK │
│ name        VARCHAR  │
│ email       VARCHAR  │ UNIQUE
│ phone       VARCHAR  │
└──────────────────────┘

┌──────────────────────────┐       ┌──────────────────────────┐
│      transactions        │       │       deliveries         │
├──────────────────────────┤       ├──────────────────────────┤
│ id              UUID  PK │──┐    │ id              UUID  PK │
│ customerId      UUID  FK │  └───<│ transactionId   UUID  FK │
│ productId       UUID  FK │       │ customerId      UUID  FK │
│ quantity        INT      │       │ productId       UUID  FK │
│ productAmount   DECIMAL  │       │ quantity        INT      │
│ baseFee         INT      │       │ address         VARCHAR  │
│ deliveryFee     INT      │       │ city            VARCHAR  │
│ totalAmount     INT      │       │ status          VARCHAR  │
│ status          VARCHAR  │       │ createdAt       TIMESTAMP│
│ wompiTransactionId VARCHAR│       └──────────────────────────┘
│ createdAt       TIMESTAMP│
└──────────────────────────┘
```

**Relaciones:**

- `Product` 1 ──< N `ProductImage` (cascade, eager)
- `Transaction` N >── 1 `Customer` (via customerId)
- `Transaction` N >── 1 `Product` (via productId)
- `Delivery` N >── 1 `Transaction` (via transactionId)

La base se siembra con productos al arranque. Una transacción crea un cliente (si no existe), descuenta stock al completar el pago y genera un registro de envío.

## Endpoints principales

| Método | Ruta                                        | Descripción                             |
| ------ | ------------------------------------------- | --------------------------------------- |
| GET    | `/products`                                 | Listado de productos y stock            |
| POST   | `/transactions`                             | Crear transacción pendiente             |
| GET    | `/transactions/:id`                         | Consultar transacción                   |
| POST   | `/transactions/:id/pay`                     | Enviar token de tarjeta y procesar pago |
| GET    | `/customers/:id`                            | Cliente por id                          |
| GET    | `/deliveries/:id`                           | Envío por id                            |
| GET    | `/deliveries/by-transaction/:transactionId` | Envío asociado a una transacción        |

## Pruebas

```bash
cd server && npm run test:cov
cd web && npm run test:cov
```

### Resultados de cobertura

**Backend (`server/`)** — Jest

| Statements | Branches | Functions | Lines |
|------------|----------|-----------|-------|
| 99.24 %    | 83.52 %  | 97.72 %   | 99.36 % |

- Test Suites: 26 passed
- Tests: 102 passed

**Frontend (`web/`)** — Jest

| Statements | Branches | Functions | Lines |
|------------|----------|-----------|-------|
| 86.90 %    | 80.61 %  | 84.61 %   | 86.80 % |

- Test Suites: 14 passed
- Tests: 106 passed

## Deploy

| Recurso | URL |
|---------|-----|
| Frontend (CloudFront) | https://d3ekvok01q9z8.cloudfront.net |
| API (ALB) | http://Curato-Curat-jxKrHIXUjwIa-1272609790.us-east-1.elb.amazonaws.com |
| Swagger UI | http://Curato-Curat-jxKrHIXUjwIa-1272609790.us-east-1.elb.amazonaws.com/api/docs |

Infraestructura desplegada en AWS con CDK: ECS Fargate, ALB, RDS PostgreSQL, S3 + CloudFront.

## Licencia

MIT

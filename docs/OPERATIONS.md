# Operación mínima (SLO + tablero)

Este documento define un **SLO inicial** y un “tablero” mínimo basado en el endpoint `GET /api/metrics`.

## SLO inicial (propuesto)

> Objetivo: tener un baseline operativo simple y accionable, sin prometer números “de producción” sin contexto.

### Latencia (p95)

- `GET /api/indicadores`: **p95 <= 200 ms**
- `GET /api/indicadores/:id`: **p95 <= 150 ms**
- `GET /api/categorias`: **p95 <= 200 ms**
- `GET /api/reportes-agrupados`: **p95 <= 200 ms**

**Condiciones de medición**

- Entorno: máquina local de desarrollo, dataset actual del repo.
- Carga: ráfaga simple (por ejemplo 50–200 requests) antes de evaluar p95.
- Repositorio: evaluar por separado `INDICATOR_REPOSITORY=memory` y `INDICATOR_REPOSITORY=sqlite`.

### Errores (tasa 5xx)

- Error rate 5xx por endpoint: **< 1%** (idealmente 0%).

## Tablero operativo mínimo (`/api/metrics`)

`GET /api/metrics` devuelve un arreglo ordenado por `p95Ms` con métricas por endpoint:

- `endpoint`: etiqueta `METHOD /path`
- `count`: total de requests observadas
- `avgMs`, `p50Ms`, `p95Ms`, `p99Ms`, `maxMs`: latencia en ms (muestra acotada)
- `status2xx`, `status4xx`, `status5xx`: conteos por clase de status
- `errorRate5xx`: `status5xx / count`

### Cómo usarlo rápido

1. Arrancar el server (`pnpm run dev`).
2. Generar tráfico (navegar UI o hacer requests con curl/postman).
3. Revisar `GET /api/metrics` y comparar `p95Ms` + `errorRate5xx` contra el SLO.

## Notas

- Las métricas de percentiles usan un **buffer acotado** por endpoint (muestra), pensado para baseline de dev/operación mínima, no como reemplazo de Prometheus/OTel.
- En `NODE_ENV=test` el middleware de métricas no se registra, por lo que los tests no dependen de estas métricas.


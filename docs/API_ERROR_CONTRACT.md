# Contrato de errores (API)

El backend responde errores con un payload consistente para facilitar manejo uniforme en el cliente y en tests.

## Shape

```json
{
  "error": "string",
  "code": "VALIDATION_ERROR | NOT_FOUND | INTERNAL_ERROR",
  "message": "string",
  "details": "optional"
}
```

### Campos

- `error`: string “corta” (back-compat; algunos flujos del cliente esperan `error`).
- `code`: código estable para lógica (por ejemplo: `VALIDATION_ERROR`).
- `message`: mensaje legible (generalmente igual a `error`).
- `details` (opcional):
  - Para validación (zod): `flatten()` del error.
  - Para otros casos: metadata útil para debugging (evitar PII).

## Ejemplos

### 400 - Parámetros inválidos

```json
{
  "error": "Invalid request parameters",
  "code": "VALIDATION_ERROR",
  "message": "Invalid request parameters",
  "details": {
    "formErrors": [],
    "fieldErrors": {
      "categoryId": ["Invalid categoryId"]
    }
  }
}
```

### 404 - Recurso no encontrado

```json
{
  "error": "Indicator not found",
  "code": "NOT_FOUND",
  "message": "Indicator not found"
}
```

### 500 - Error interno

```json
{
  "error": "Internal server error",
  "code": "INTERNAL_ERROR",
  "message": "Internal server error"
}
```

## Implementación

- Middleware: `server/src/middleware/error.middleware.ts`
- Errores “de dominio”: `server/src/errors/AppError.ts`


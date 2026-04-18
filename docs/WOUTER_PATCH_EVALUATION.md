# Evaluación del parche `wouter@3.7.1`

## Qué hace el parche

El repo aplica un parche a `wouter@3.7.1` (vía `pnpm.patchedDependencies`) que modifica `esm/index.js` para que, dentro de `Switch`, se recolecten los `path` de las rutas hijas y se publiquen en un arreglo global:

- Global: `window.__WOUTER_ROUTES__`
- Contenido: lista única de strings `path` definidos en los elementos de ruta renderizados bajo `Switch`.

El código está protegido por `typeof window !== "undefined"` (no corre en SSR), pero **sí corre en browser** para cualquier build donde el parche esté activo.

## Motivación esperada

Exponer el mapa de rutas de la app en tiempo de ejecución para tooling/diagnóstico (por ejemplo, runtimes externos o debug tooling que necesita descubrir rutas disponibles sin inspeccionar el bundle).

## Matriz de riesgos (resumen)

| Riesgo | Prob. | Impacto | Mitigación |
| --- | --- | --- | --- |
| Colisión con otros globals / `__WOUTER_ROUTES__` ya usado | Baja | Media | Mantener nombre estable; evitar usar este global desde app productiva; documentar y reservar el prefijo. |
| Fuga de información (exponer rutas internas en el cliente) | Media | Baja–Media | Asumir que las rutas del SPA no son secretas; si existieran rutas “ocultas”, no depender de obscuridad; reforzar auth del backend. |
| Efecto colateral/perf al renderizar `Switch` (flatten + includes) | Baja | Baja | El costo es pequeño; mantener lista única; revisar si `Switch` re-renderiza mucho. |
| Diferencia al actualizar `wouter` (parche no aplica / cambia internals) | Alta | Media–Alta | Pin de versión; checklist de upgrade: re-aplicar/reevaluar parche y validar smoke tests. |
| Incompatibilidad con futuros cambios de bundling/minificación | Baja | Media | Re-validar en builds de producción; preferir hook público si `wouter` lo soporta a futuro. |

## Alternativas (si se quiere eliminar el parche)

1. **Recolectar rutas en la app**: mantener una lista/registry explícito en el código de rutas (sin tocar `wouter`).
2. **Plugin interno**: exponer un endpoint o archivo JSON generado en build con la lista de rutas.
3. **Upstream**: proponer una API pública en `wouter` (si el caso de uso lo justifica).

## Criterio de decisión

Mantener el parche es razonable si:

- el consumidor del global es necesario para el flujo de operación/debug, y
- el equipo acepta que es una modificación de dependencia con costo de mantenimiento en upgrades.

Si el global no es consumido activamente, conviene migrar a una alternativa “app-level” para eliminar deuda.

## Checklist al actualizar `wouter`

- Confirmar si `Switch` sigue existiendo y si la ubicación del código no cambió.
- Confirmar que `window.__WOUTER_ROUTES__` sigue poblándose correctamente en dev/prod.
- Correr `pnpm run test` y un smoke test manual del enrutamiento (navegación entre rutas principales).


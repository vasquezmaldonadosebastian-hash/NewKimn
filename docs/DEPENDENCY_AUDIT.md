# Dependency audit (focus: Radix UI)

## Objetivo

Reducir peso y superficie de dependencias manteniendo el set mínimo necesario para la UI actual.

## Hallazgos (Radix)

En `client/src/components/ui/*` existen wrappers (estilo shadcn) que importan directamente estos paquetes:

- `@radix-ui/react-accordion`
- `@radix-ui/react-alert-dialog`
- `@radix-ui/react-aspect-ratio`
- `@radix-ui/react-avatar`
- `@radix-ui/react-checkbox`
- `@radix-ui/react-collapsible`
- `@radix-ui/react-context-menu`
- `@radix-ui/react-dialog` (también usado por `sheet.tsx`)
- `@radix-ui/react-dropdown-menu`
- `@radix-ui/react-hover-card`
- `@radix-ui/react-label`
- `@radix-ui/react-menubar`
- `@radix-ui/react-navigation-menu`
- `@radix-ui/react-popover`
- `@radix-ui/react-progress`
- `@radix-ui/react-radio-group`
- `@radix-ui/react-scroll-area`
- `@radix-ui/react-select`
- `@radix-ui/react-separator`
- `@radix-ui/react-slider`
- `@radix-ui/react-slot`
- `@radix-ui/react-switch`
- `@radix-ui/react-tabs`
- `@radix-ui/react-toggle`
- `@radix-ui/react-toggle-group`
- `@radix-ui/react-tooltip`

Esto confirma que los paquetes están **referenciados por código**, pero no necesariamente que todos estén **en uso real** en pantallas/rutas actuales (depende de qué componentes UI se importan finalmente).

## Proceso recomendado para eliminación segura

1. Inventariar componentes UI realmente usados:
   - buscar imports desde `client/src/components/ui/*` en `client/src/**`.
2. Eliminar wrappers no usados:
   - borrar archivos `client/src/components/ui/<componente>.tsx` que no se importan.
3. Eliminar dependencias:
   - remover los paquetes Radix que quedaron sin referencias.
4. Validar:
   - `pnpm run test`
   - `pnpm run build`
   - revisar `dist/bundle-report.md` (ver `pnpm run build:analyze`) para medir impacto.

## Nota

Si el objetivo es reducir bundle, eliminar dependencias sin eliminar el código que las importa no tendrá efecto: Vite no puede tree-shake paquetes que siguen siendo importados.


# Dependency audit (focus: Radix UI)

## Objetivo

Reducir peso y superficie de dependencias manteniendo el set mínimo necesario para la UI actual.

## Hallazgos (Radix)

En `client/src/components/ui/*` existían wrappers (estilo shadcn) que importaban directamente estos paquetes.

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

Tras auditar imports reales desde el resto del código (fuera de `components/ui`), la app actualmente usa solo:

- `@radix-ui/react-dialog`
- `@radix-ui/react-slot`
- `@radix-ui/react-tooltip`

El resto de wrappers UI no estaba referenciado por la app y además impedía podar dependencias porque `tsc` incluye todo `client/src/**/*`.

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

## Cambios aplicados

- Se eliminaron wrappers no usados en `client/src/components/ui/*` para permitir podar dependencias Radix sin romper `tsc`.
- Se removieron de `package.json` las dependencias Radix no usadas por el código actual.

## Nota

Si el objetivo es reducir bundle, eliminar dependencias sin eliminar el código que las importa no tendrá efecto: Vite no puede tree-shake paquetes que siguen siendo importados.


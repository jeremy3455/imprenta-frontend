# Estilos compartidos — Imprenta Front

Sistema de diseño global con **3 colores principales** en tonos pastel y acentos llamativos.

## Personalizar colores

Edita **un solo archivo**:

```
src/styles/theme/_custom.scss
```

```scss
:root {
  --brand-primary:   #e07a5f;   /* Terracota — botones, activos */
  --brand-secondary: #8b7ec8;   /* Lavanda — fondos, sidebar */
  --brand-accent:    #5bbfa3;   /* Menta — badges, éxito */

  --brand-primary-pastel:   #faeae5;
  --brand-secondary-pastel: #eeeaf9;
  --brand-accent-pastel:    #e0f5f0;
}
```

Guarda y recarga la app. Los cambios se aplican en toda la interfaz.

## Estructura de carpetas

```
src/styles/
├── index.scss              ← entrada (importada por styles.scss)
├── theme/
│   ├── _custom.scss        ← ★ TUS COLORES AQUÍ
│   └── _tokens.scss        ← tokens semánticos (texto, sombras, estados)
├── base/
│   └── _reset.scss         ← reset y tipografía base
├── layout/
│   ├── _page.scss          ← .page-section, .page-header, .page-loading
│   └── _sidebar.scss       ← sidebar y navegación
└── components/
    ├── _buttons.scss       ← .btn, .btn--primary, etc.
    ├── _forms.scss         ← .form-field, .form-grid
    ├── _cards.scss         ← .card, .stat-card, .login-card
    ├── _tables.scss        ← .table, .table-wrapper
    ├── _badges.scss        ← .badge
    ├── _empty-state.scss
    └── _notifications.scss
```

## Clases reutilizables

| Clase | Uso |
|-------|-----|
| `.btn .btn--primary` | Botón principal con gradiente |
| `.btn .btn--secondary` | Botón secundario pastel |
| `.btn .btn--accent` | Botón acento menta |
| `.card` | Tarjeta con sombra suave |
| `.stat-card` | Tarjeta de estadística del dashboard |
| `.form-field` | Campo de formulario |
| `.table` / `.table-wrapper` | Tablas de datos |
| `.badge` / `.badge--active` | Etiquetas de estado |
| `.page-section` | Padding estándar de página |
| `.page-header` | Encabezado de sección |

## Paleta por defecto

| Rol | Color | Uso |
|-----|-------|-----|
| Primary | Terracota `#e07a5f` | Botones, valores destacados |
| Secondary | Lavanda `#8b7ec8` | Fondos, gradientes, info |
| Accent | Menta `#5bbfa3` | Éxito, badges activos |

## En componentes nuevos

Usa las clases globales en el HTML. Solo agrega SCSS local si necesitas layout específico de esa página.

```html
<div class="mi-feature page-section">
  <header class="page-header">
    <h1>Mi módulo</h1>
  </header>
  <div class="card">
    <button class="btn btn--primary">Guardar</button>
  </div>
</div>
```

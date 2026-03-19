# Client (Frontend)

## Stack

- **Framework:** React 19 with JSX
- **Build tool:** Vite 8
- **Styling:** Tailwind CSS v4 (via `@tailwindcss/vite` plugin)
- **Linting:** ESLint 9 with React hooks and React Refresh plugins
- **Cache:** @tanstack/react-query

## Scripts

- `npm run dev` — start dev server
- `npm run build` — production build
- `npm run lint` — run ESLint

## Conventions

- Use `.jsx` extension for React components
- Pages go in `src/pages/`
- Reusable UI components go in `src/components/`
- Layout components (Navbar, MainLayout) go in `src/layouts/`
- Custom hooks go in `src/hooks/`
- API functions go in `src/api/`

## Design Tokens (Color Palette)

Dark theme. All colors are defined as semantic tokens via `@theme` in `src/index.css`. Use token class names (e.g. `bg-base`, `text-body`) — never hardcode gray/indigo/red values.

### Neutrals (60%)

| Token       | Hex       | Tailwind class   | Usage                                  |
|-------------|-----------|------------------|----------------------------------------|
| `base`      | `#030712` | `bg-base`        | Page backgrounds, navbar, prompt area  |
| `surface`   | `#111827` | `bg-surface`     | Cards, inputs, table rows              |
| `elevated`  | `#1f2937` | `bg-elevated`    | Hover, table headers, elevated surfaces|
| `border`    | `#374151` | `border-border`  | All borders, dividers, scrollbar thumb |
| `muted`     | `#6b7280` | `text-muted`     | Placeholder, disabled, scrollbar hover |
| `subtle`    | `#9ca3af` | `text-subtle`    | Secondary text, labels, nav links      |
| `body`      | `#f3f4f6` | `text-body`      | Primary body text                      |
| `heading`   | `#ffffff` | `text-heading`   | Headings, button labels, emphasis      |

### Accent (30%)

| Token          | Hex       | Tailwind class        | Usage                                |
|----------------|-----------|-----------------------|--------------------------------------|
| `accent`       | `#4f46e5` | `bg-accent`           | Primary button background            |
| `accent-hover` | `#6366f1` | `hover:bg-accent-hover` | Hover, focus rings, active borders |

### Semantic (10%)

| Token     | Hex       | Tailwind class  | Usage                          |
|-----------|-----------|-----------------|--------------------------------|
| `error`   | `#f87171` | `text-error`    | Error text, borders, badges    |
| `success` | `#4ade80` | `text-success`  | Active status                  |
| `warning` | `#facc15` | `text-warning`  | Paused status                  |
| `info`    | `#60a5fa` | `text-info`     | Completed status               |

### Opacity modifiers

- `/10` — semantic badge & error card backgrounds (e.g. `bg-error/10`, `bg-success/10`)
- `/30` — semantic borders (e.g. `border-error/30`)
- `/40` — focus rings (e.g. `ring-accent-hover/40`)
- `/50` — subtle hover backgrounds (e.g. `bg-elevated/50`)
- `/60` — selected state backgrounds (e.g. `bg-elevated/60`)

### Scrollbar

Defined via CSS custom properties in `src/index.css` using `var(--color-border)` and `var(--color-muted)`.

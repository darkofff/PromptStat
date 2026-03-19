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

## Color Palette

Dark theme. Use only these colors for consistency:

### Base / Neutrals (gray)

| Token      | Usage                                      |
|------------|--------------------------------------------|
| gray-950   | Page backgrounds, navbar background        |
| gray-900   | Card/input backgrounds                     |
| gray-800   | Response card backgrounds, borders, hover  |
| gray-700   | Default borders                            |
| gray-500   | Placeholder text, muted icons              |
| gray-400   | Secondary text, labels                     |
| gray-300   | Nav link text                              |
| gray-200   | Hover text (subtle elements)               |
| gray-100   | Primary body text                          |
| white      | Headings, emphasized text, button labels   |

### Accent (indigo)

| Token      | Usage                                  |
|------------|----------------------------------------|
| indigo-600 | Primary button background              |
| indigo-500 | Button hover, focus rings, active borders |

### Semantic — Error (red)

| Token      | Usage                        |
|------------|------------------------------|
| red-950    | Error card background        |
| red-800    | Error card border            |
| red-400    | Error text                   |
| red-300    | Error hover text             |

### Semantic — Status badges

| Status    | Background       | Text         |
|-----------|------------------|--------------|
| Active    | green-900/50     | green-400    |
| Completed | blue-900/50      | blue-400     |
| Paused    | yellow-900/50    | yellow-400   |

### Opacity modifiers

- `/40` — focus rings (e.g. `ring-indigo-500/40`)
- `/50` — subtle backgrounds (e.g. `bg-gray-800/50`, status badges)
- `/60` — selected state backgrounds (e.g. `bg-gray-800/60`)

### Scrollbar (CSS custom properties in `index.css`)

- Thumb: `#4b5563` (gray-600 equivalent)
- Thumb hover: `#6b7280` (gray-500 equivalent)
- Track: transparent

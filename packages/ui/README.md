# @ethanel/ui

Design tokens (`theme.css`) and shadcn-style components on the Ethanel theme. Shared by
`apps/web` now and by every storefront and the dashboard later.

- `theme.css` — the only place colours, fonts, radii and type scale are defined. Tailwind v4
  `@theme` tokens plus `eyebrow`, `kes`, `card`, `card-hover`, `dot-8` utilities.
- `components/button` — Server-safe. Variants primary / accent / secondary / ghost / link.
- `components/sheet`, `components/select`, `components/accordion` — Client (Radix state).
- `lib/cn` — `clsx` + `tailwind-merge`.

Rules: Fraunces (`font-display`) only on marketing headings. `mpesa` and `whatsapp` greens are for
8px dots and icons only. Never `#000`. Never a violet→pink gradient on text or buttons.

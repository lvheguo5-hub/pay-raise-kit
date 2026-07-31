# Pay Raise Kit Favicon Design

Date: 2026-07-31  
Status: Approved design, pending implementation

## Goal

Give Pay Raise Kit a complete favicon and installable web-app icon set that
reuses the brand mark already shown in the Header and Footer.

## Visual design

- Background: rounded square using the existing action teal `#0d766e`.
- Foreground: a thick white upward arrow, drawn as an SVG path rather than a
  font glyph so it renders consistently on every platform.
- Safe area: keep the arrow comfortably inside the shape so it remains legible
  at 16×16.
- No Pokéball, yellow-orange-pink gradient, or imagery from the unrelated
  Pokémon site.

The Header and Footer keep their current appearance. The new vector source
formalizes the existing mark; it does not introduce a new logo concept.

## Generated assets

Create these files:

- `public/favicon-source.svg`
- `public/favicon.ico`
- `public/favicon-16x16.png`
- `public/favicon-32x32.png`
- `public/apple-touch-icon.png` at 180×180
- `public/android-chrome-192x192.png`
- `public/android-chrome-512x512.png`
- `public/site.webmanifest`

The manifest uses:

- name: `Pay Raise Kit`
- short name: `Pay Raise Kit`
- theme color: `#0d766e`
- background color: `#f5f7f2`
- display mode: `standalone`

## Generation and integration

- Generate the raster files locally from the SVG source using Sharp.
- Generate the ICO locally from the 16×16 and 32×32 outputs.
- Keep a reusable generation script in the repository so future brand changes
  do not require a manual third-party upload.
- Register the favicon, PNG icons, Apple touch icon, and manifest through
  Next.js metadata in the root layout.
- Do not add a runtime image dependency; generation is a development task only.

## Verification

Implementation is complete only when:

- every required asset exists at the expected dimensions;
- the ICO contains the intended small favicon sizes;
- `site.webmanifest` is valid JSON and references both Android icons;
- the static export contains the icon and manifest links;
- typecheck, lint, tests, production build, and static verification pass;
- the deployed production site returns the new files successfully;
- the production HTML references the production icon and manifest paths.

## Rollback

Revert the favicon implementation commit and redeploy the previous verified
static export. No calculator, URL, DNS, or content behavior changes are part of
this work.

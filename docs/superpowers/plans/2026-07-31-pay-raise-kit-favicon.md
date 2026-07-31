# Pay Raise Kit Favicon Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Generate, integrate, deploy, and verify a complete favicon and web-app icon set based on Pay Raise Kit's existing teal upward-arrow brand mark.

**Architecture:** Keep one hand-authored SVG as the visual source of truth. A development-only Node script uses Sharp to generate each PNG and writes a two-size ICO container directly from the 16×16 and 32×32 PNG buffers. Next.js root metadata publishes the icon and manifest links, while the existing static verifier checks the generated files, dimensions, manifest, and exported HTML.

**Tech Stack:** Next.js 14 metadata, SVG, Sharp, Node.js buffers, Vitest, Cloudflare Pages

---

## File map

**Create:**

- `public/favicon-source.svg` — reusable vector source of the brand mark
- `public/favicon.ico` — legacy/multi-size browser favicon
- `public/favicon-16x16.png` — small browser favicon
- `public/favicon-32x32.png` — standard browser favicon
- `public/apple-touch-icon.png` — 180×180 Apple touch icon
- `public/android-chrome-192x192.png` — manifest icon
- `public/android-chrome-512x512.png` — manifest icon
- `public/site.webmanifest` — installable-site metadata
- `scripts/generate-favicons.mjs` — deterministic asset generator

**Modify:**

- `package.json` and `package-lock.json` — development-only Sharp dependency and generation command
- `app/layout.tsx` — Next.js icon and manifest metadata
- `tests/site-contract.test.ts` — repository-level favicon contract
- `scripts/verify-static.mjs` — exported asset, dimension, ICO, manifest, and HTML checks
- `docs/launch-checklist.md` — deployed favicon evidence

## Task 1: Add the failing favicon contract

**Files:**

- Modify: `tests/site-contract.test.ts`

- [ ] **Step 1: Write the failing repository contract**

Add `access` to the existing Node imports:

```ts
import { access, readFile } from "node:fs/promises";
```

Add this test inside the existing `describe` block:

```ts
it("ships a complete Pay Raise Kit favicon contract", async () => {
  const requiredAssets = [
    "public/favicon-source.svg",
    "public/favicon.ico",
    "public/favicon-16x16.png",
    "public/favicon-32x32.png",
    "public/apple-touch-icon.png",
    "public/android-chrome-192x192.png",
    "public/android-chrome-512x512.png",
    "public/site.webmanifest",
  ];

  for (const asset of requiredAssets) {
    await expect(access(asset)).resolves.toBeUndefined();
  }

  const layout = await readFile("app/layout.tsx", "utf8");
  expect(layout).toContain('manifest: "/site.webmanifest"');
  expect(layout).toContain('url: "/favicon.ico"');
  expect(layout).toContain('url: "/apple-touch-icon.png"');

  const manifest = JSON.parse(
    await readFile("public/site.webmanifest", "utf8"),
  ) as {
    name: string;
    short_name: string;
    icons: Array<{ src: string; sizes: string; type: string }>;
    theme_color: string;
    background_color: string;
    display: string;
  };

  expect(manifest).toMatchObject({
    name: "Pay Raise Kit",
    short_name: "Pay Raise Kit",
    theme_color: "#0d766e",
    background_color: "#f5f7f2",
    display: "standalone",
  });
  expect(manifest.icons).toEqual([
    {
      src: "/android-chrome-192x192.png",
      sizes: "192x192",
      type: "image/png",
    },
    {
      src: "/android-chrome-512x512.png",
      sizes: "512x512",
      type: "image/png",
    },
  ]);
});
```

- [ ] **Step 2: Run the focused test and verify RED**

Run:

```bash
npm test -- --run tests/site-contract.test.ts
```

Expected: FAIL in `ships a complete Pay Raise Kit favicon contract` because
`public/favicon-source.svg` and the other favicon files do not exist.

## Task 2: Create the vector source and deterministic generator

**Files:**

- Create: `public/favicon-source.svg`
- Create: `scripts/generate-favicons.mjs`
- Modify: `package.json`
- Modify: `package-lock.json`

- [ ] **Step 1: Create the SVG source**

Create `public/favicon-source.svg`:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" role="img" aria-labelledby="title">
  <title id="title">Pay Raise Kit upward arrow</title>
  <rect width="512" height="512" rx="112" fill="#0d766e"/>
  <path
    d="M256 360V152M160 248l96-96 96 96"
    fill="none"
    stroke="#ffffff"
    stroke-width="56"
    stroke-linecap="round"
    stroke-linejoin="round"
  />
</svg>
```

- [ ] **Step 2: Install Sharp as a development dependency**

Run:

```bash
npm install --save-dev sharp
```

Expected: `sharp` appears only in `devDependencies`, and `package-lock.json`
records the resolved package.

- [ ] **Step 3: Add the generation command**

Add this entry to `package.json` scripts:

```json
"generate:favicons": "node scripts/generate-favicons.mjs"
```

- [ ] **Step 4: Create the generator**

Create `scripts/generate-favicons.mjs`:

```js
import { readFile, writeFile } from "node:fs/promises";

import sharp from "sharp";

const source = "public/favicon-source.svg";
const outputs = [
  ["public/favicon-16x16.png", 16],
  ["public/favicon-32x32.png", 32],
  ["public/apple-touch-icon.png", 180],
  ["public/android-chrome-192x192.png", 192],
  ["public/android-chrome-512x512.png", 512],
];

for (const [file, size] of outputs) {
  await sharp(source)
    .resize(size, size, { fit: "contain" })
    .png()
    .toFile(file);
}

const favicon16 = await readFile("public/favicon-16x16.png");
const favicon32 = await readFile("public/favicon-32x32.png");
await writeFile(
  "public/favicon.ico",
  createIco([
    { size: 16, png: favicon16 },
    { size: 32, png: favicon32 },
  ]),
);

console.log(`Generated ${outputs.length} PNG icons and public/favicon.ico.`);

function createIco(images) {
  const headerSize = 6;
  const entrySize = 16;
  const header = Buffer.alloc(headerSize);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);

  const entries = Buffer.alloc(entrySize * images.length);
  let offset = headerSize + entrySize * images.length;

  images.forEach(({ size, png }, index) => {
    const entryOffset = index * entrySize;
    entries.writeUInt8(size, entryOffset);
    entries.writeUInt8(size, entryOffset + 1);
    entries.writeUInt8(0, entryOffset + 2);
    entries.writeUInt8(0, entryOffset + 3);
    entries.writeUInt16LE(1, entryOffset + 4);
    entries.writeUInt16LE(32, entryOffset + 6);
    entries.writeUInt32LE(png.length, entryOffset + 8);
    entries.writeUInt32LE(offset, entryOffset + 12);
    offset += png.length;
  });

  return Buffer.concat([header, entries, ...images.map(({ png }) => png)]);
}
```

- [ ] **Step 5: Generate the raster and ICO files**

Run:

```bash
npm run generate:favicons
```

Expected:

```text
Generated 5 PNG icons and public/favicon.ico.
```

## Task 3: Add the manifest and Next.js metadata

**Files:**

- Create: `public/site.webmanifest`
- Modify: `app/layout.tsx`

- [ ] **Step 1: Create the web manifest**

Create `public/site.webmanifest`:

```json
{
  "name": "Pay Raise Kit",
  "short_name": "Pay Raise Kit",
  "start_url": "/",
  "scope": "/",
  "icons": [
    {
      "src": "/android-chrome-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/android-chrome-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ],
  "theme_color": "#0d766e",
  "background_color": "#f5f7f2",
  "display": "standalone"
}
```

- [ ] **Step 2: Register the files through root metadata**

Add these fields to the existing `metadata` object in `app/layout.tsx`:

```ts
manifest: "/site.webmanifest",
icons: {
  icon: [
    { url: "/favicon.ico", sizes: "16x16 32x32", type: "image/x-icon" },
    { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
  ],
  apple: [
    {
      url: "/apple-touch-icon.png",
      sizes: "180x180",
      type: "image/png",
    },
  ],
  shortcut: ["/favicon.ico"],
},
```

- [ ] **Step 3: Run the focused test and verify GREEN**

Run:

```bash
npm test -- --run tests/site-contract.test.ts
```

Expected: all site-contract tests pass.

## Task 4: Strengthen exported-asset verification

**Files:**

- Modify: `scripts/verify-static.mjs`

- [ ] **Step 1: Add favicon files to the required static-output list**

Add these paths to the existing required-file array:

```js
"out/favicon-source.svg",
"out/favicon.ico",
"out/favicon-16x16.png",
"out/favicon-32x32.png",
"out/apple-touch-icon.png",
"out/android-chrome-192x192.png",
"out/android-chrome-512x512.png",
"out/site.webmanifest",
```

- [ ] **Step 2: Verify PNG dimensions, ICO entries, manifest contents, and HTML links**

Add this verification block before the tracked-secret scan:

```js
for (const [file, expectedSize] of [
  ["out/favicon-16x16.png", 16],
  ["out/favicon-32x32.png", 32],
  ["out/apple-touch-icon.png", 180],
  ["out/android-chrome-192x192.png", 192],
  ["out/android-chrome-512x512.png", 512],
]) {
  if (!(await exists(file))) continue;
  const png = await readFile(file);
  if (
    png.toString("hex", 0, 8) !== "89504e470d0a1a0a" ||
    png.readUInt32BE(16) !== expectedSize ||
    png.readUInt32BE(20) !== expectedSize
  ) {
    failures.push(`Invalid PNG dimensions in ${file}: expected ${expectedSize}x${expectedSize}`);
  }
}

if (await exists("out/favicon.ico")) {
  const ico = await readFile("out/favicon.ico");
  const iconType = ico.readUInt16LE(2);
  const iconCount = ico.readUInt16LE(4);
  const sizes = Array.from({ length: iconCount }, (_, index) =>
    ico.readUInt8(6 + index * 16),
  );
  if (iconType !== 1 || iconCount !== 2 || sizes.join(",") !== "16,32") {
    failures.push("favicon.ico must contain 16x16 and 32x32 icon entries");
  }
}

if (await exists("out/site.webmanifest")) {
  const manifest = JSON.parse(await readFile("out/site.webmanifest", "utf8"));
  if (
    manifest.name !== "Pay Raise Kit" ||
    manifest.theme_color !== "#0d766e" ||
    manifest.icons?.length !== 2
  ) {
    failures.push("site.webmanifest does not match the Pay Raise Kit icon contract");
  }
}

if (await exists("out/index.html")) {
  const homepage = await readFile("out/index.html", "utf8");
  for (const asset of [
    "/favicon.ico",
    "/favicon-16x16.png",
    "/favicon-32x32.png",
    "/apple-touch-icon.png",
    "/site.webmanifest",
  ]) {
    if (!homepage.includes(asset)) {
      failures.push(`Homepage metadata does not reference ${asset}`);
    }
  }
}
```

- [ ] **Step 3: Run the complete release verification**

Run:

```bash
npm run verify
git diff --check
```

Expected: typecheck, lint, 34 tests, production build, static verifier, and
whitespace checks all pass.

- [ ] **Step 4: Inspect representative generated icons**

Open and inspect:

- `public/favicon-32x32.png`
- `public/apple-touch-icon.png`
- `public/android-chrome-512x512.png`

Expected: teal rounded square, centered white upward arrow, no clipping, and
clear recognition at both favicon and touch-icon sizes.

- [ ] **Step 5: Commit the implementation**

```bash
git add app/layout.tsx package.json package-lock.json public/favicon-source.svg public/favicon.ico public/favicon-16x16.png public/favicon-32x32.png public/apple-touch-icon.png public/android-chrome-192x192.png public/android-chrome-512x512.png public/site.webmanifest scripts/generate-favicons.mjs scripts/verify-static.mjs tests/site-contract.test.ts
git commit -m "feat: add Pay Raise Kit favicon set"
git push
```

## Task 5: Deploy and verify production

**Files:**

- Modify: `docs/launch-checklist.md`

- [ ] **Step 1: Wait for the pushed GitHub verification**

Run:

```bash
run_id=$(gh run list --limit 1 --json databaseId --jq '.[0].databaseId')
gh run view "$run_id" --json headSha,status,conclusion,url
gh run watch "$run_id" --exit-status
```

Expected: the run for the favicon implementation commit finishes with
`conclusion: success`.

- [ ] **Step 2: Deploy the exact verified export**

Run:

```bash
npx wrangler whoami
npx wrangler pages deploy out --project-name=pay-raise-kit --branch=main
```

Expected: authenticated account `Lvheguo5@gmail.com's Account` and a new
production deployment URL under `pay-raise-kit.pages.dev`.

- [ ] **Step 3: Verify every production asset and HTML reference**

Run:

```bash
for asset in \
  favicon.ico \
  favicon-16x16.png \
  favicon-32x32.png \
  apple-touch-icon.png \
  android-chrome-192x192.png \
  android-chrome-512x512.png \
  site.webmanifest; do
  curl -fsS -o /dev/null -w "%{http_code} /$asset\n" \
    "https://payraisekit.com/$asset"
done

curl -fsS https://payraisekit.com/ |
  rg -o '<link[^>]+(favicon|apple-touch-icon|site.webmanifest)[^>]*>'
```

Expected: every asset returns HTTP 200, and production HTML references the ICO,
both small PNG favicons, Apple touch icon, and manifest.

- [ ] **Step 4: Record the production evidence**

Update `docs/launch-checklist.md` with:

- deployed source commit;
- Cloudflare deployment URL and full identifier;
- successful production icon responses;
- production HTML metadata verification.

- [ ] **Step 5: Run final verification and commit the handoff**

```bash
npm run verify
git diff --check
git add docs/launch-checklist.md
git commit -m "docs: record favicon deployment"
git push
```

Expected: verification passes, the documentation commit is pushed, and the
worktree is clean.

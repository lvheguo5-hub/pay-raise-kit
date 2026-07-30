import { execFileSync } from "node:child_process";
import { readFile, stat } from "node:fs/promises";

const productionUrl = "https://payraisekit.com";

const expectedPages = [
  { route: "/", file: "out/index.html" },
  {
    route: "/raise-percentage-calculator/",
    file: "out/raise-percentage-calculator/index.html",
  },
  {
    route: "/salary-growth-calculator/",
    file: "out/salary-growth-calculator/index.html",
  },
  { route: "/about/", file: "out/about/index.html" },
  { route: "/contact/", file: "out/contact/index.html" },
  { route: "/privacy/", file: "out/privacy/index.html" },
  { route: "/terms/", file: "out/terms/index.html" },
];

const failures = [];

for (const page of expectedPages) {
  if (!(await exists(page.file))) {
    failures.push(`Missing exported page: ${page.file}`);
    continue;
  }

  const html = await readFile(page.file, "utf8");
  const canonical = `${productionUrl}${page.route}`;

  if (!html.includes(canonical)) {
    failures.push(`Missing production canonical in ${page.file}: ${canonical}`);
  }
  if (!/<title>[^<]+<\/title>/.test(html)) {
    failures.push(`Missing title in ${page.file}`);
  }
  if (!/<h1[^>]*>/.test(html)) {
    failures.push(`Missing H1 in ${page.file}`);
  }
  if (/example\.com|freecouplegames|randompokemonteamgenerator/i.test(html)) {
    failures.push(`Wrong domain or brand in ${page.file}`);
  }
}

for (const requiredFile of [
  "out/404.html",
  "out/robots.txt",
  "out/sitemap.xml",
  "out/_headers",
]) {
  if (!(await exists(requiredFile))) {
    failures.push(`Missing static output: ${requiredFile}`);
  }
}

if (await exists("out/robots.txt")) {
  const robots = await readFile("out/robots.txt", "utf8");
  if (!robots.includes(`${productionUrl}/sitemap.xml`)) {
    failures.push("robots.txt does not reference the production sitemap");
  }
}

if (await exists("out/sitemap.xml")) {
  const sitemap = await readFile("out/sitemap.xml", "utf8");
  const locations = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
    (match) => match[1],
  );
  const expectedLocations = expectedPages.map(
    (page) => `${productionUrl}${page.route}`,
  );

  if (locations.length !== expectedLocations.length) {
    failures.push(
      `Expected ${expectedLocations.length} sitemap URLs, found ${locations.length}`,
    );
  }

  for (const location of expectedLocations) {
    if (!locations.includes(location)) {
      failures.push(`Missing sitemap URL: ${location}`);
    }
  }
}

if (await exists("out/_headers")) {
  const headers = await readFile("out/_headers", "utf8");
  for (const header of [
    "X-Content-Type-Options: nosniff",
    "Referrer-Policy: strict-origin-when-cross-origin",
    "Permissions-Policy: camera=(), microphone=(), geolocation=()",
    "X-Frame-Options: SAMEORIGIN",
  ]) {
    if (!headers.includes(header)) {
      failures.push(`Missing Cloudflare header: ${header}`);
    }
  }
}

const trackedFiles = execFileSync("git", ["ls-files"], {
  encoding: "utf8",
})
  .split("\n")
  .filter(Boolean);

const secretPatterns = [
  { name: "GitHub token", pattern: /gh[pousr]_[A-Za-z0-9]{20,}/ },
  { name: "OpenAI-style token", pattern: /sk-[A-Za-z0-9_-]{20,}/ },
  {
    name: "PRIVATE KEY",
    pattern: /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
  },
];

for (const file of trackedFiles) {
  if (!/\.(?:js|mjs|ts|tsx|json|md|ya?ml|txt)$/.test(file)) {
    continue;
  }

  const content = await readFile(file, "utf8");
  for (const secret of secretPatterns) {
    if (secret.pattern.test(content)) {
      failures.push(`${secret.name} signature found in ${file}`);
    }
  }
}

if (failures.length > 0) {
  console.error(failures.map((failure) => `- ${failure}`).join("\n"));
  process.exitCode = 1;
} else {
  console.log(
    `Verified ${expectedPages.length} pages, crawl files, production metadata, headers, and tracked source.`,
  );
}

async function exists(path) {
  try {
    await stat(path);
    return true;
  } catch {
    return false;
  }
}

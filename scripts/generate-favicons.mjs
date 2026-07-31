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

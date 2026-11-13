// Downloads the Pokémon sprites listed in src/pokes.json into public/, so the
// game serves them itself instead of loading them from GitHub. Files that are
// already there are skipped, so after adding Pokémon to pokes.json (with
// sprite paths like "/sprites/pokemon/25.png") run:
//
//   node scripts/fetch-sprites.mjs
//
// Sprites come from the PokeAPI sprites repository, pinned to one commit so
// every run gets the same images.
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const SPRITES_COMMIT = "1b3b7c0a538dd2226ae08d0d2f8955125075bbd4";
const SOURCE = `https://cdn.jsdelivr.net/gh/PokeAPI/sprites@${SPRITES_COMMIT}`;
const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const pokes = JSON.parse(
  await fs.readFile(path.join(root, "src", "pokes.json"), "utf8")
);

const sprites = new Set();
for (const pokemon of pokes) {
  for (const sprite of [pokemon.sprites.front_default, pokemon.sprites.front_shiny]) {
    if (!sprite) continue;
    if (!/^\/sprites\/pokemon\/(shiny\/)?[\w-]+\.png$/.test(sprite)) {
      throw new Error(`${pokemon.name}: unexpected sprite path ${sprite}`);
    }
    sprites.add(sprite);
  }
}

const exists = (file) =>
  fs.access(file).then(
    () => true,
    () => false
  );

async function fetchSprite(sprite) {
  const file = path.join(root, "public", sprite);
  if (await exists(file)) return false;
  const response = await fetch(SOURCE + sprite);
  if (!response.ok) {
    throw new Error(`${sprite}: ${response.status} ${response.statusText}`);
  }
  const body = Buffer.from(await response.arrayBuffer());
  if (!body.subarray(0, 8).equals(PNG_SIGNATURE)) {
    throw new Error(`${sprite}: not a PNG`);
  }
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, body);
  return true;
}

// A few downloads at a time, to be gentle on the CDN.
const queue = [...sprites];
let downloaded = 0;
await Promise.all(
  Array.from({ length: 8 }, async () => {
    while (queue.length) {
      if (await fetchSprite(queue.shift())) downloaded++;
    }
  })
);
console.log(
  `${sprites.size} sprites listed, ${downloaded} downloaded, ${sprites.size - downloaded} already present.`
);

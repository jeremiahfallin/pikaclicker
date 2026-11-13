// How game data is shown to players. The data uses lowercase slugs like
// "raichu-alola"; players should see "Alolan Raichu".

const capitalize = (word) => word.charAt(0).toUpperCase() + word.slice(1);

// "thunder-stone" -> "Thunder Stone"
export const formatSlug = (slug = "") =>
  slug.split("-").filter(Boolean).map(capitalize).join(" ");

// Regional forms read "Alolan Raichu", with the region first.
const regions = {
  alola: "Alolan",
  galar: "Galarian",
  hisui: "Hisuian",
  paldea: "Paldean",
};

// The usual form of a Pokémon that has others, shown without a label.
const usualForms = new Set([
  "deoxys-normal",
  "shaymin-land",
  "meloetta-aria",
  "mimikyu-disguised",
]);

// Names whose hyphen is part of the name, or that are spelled differently.
const specialNames = {
  "nidoran-f": "Nidoran ♀",
  "nidoran-m": "Nidoran ♂",
  "ho-oh": "Ho-Oh",
  "porygon-z": "Porygon-Z",
  "type-null": "Type: Null",
  "jangmo-o": "Jangmo-o",
  "hakamo-o": "Hakamo-o",
  "kommo-o": "Kommo-o",
  "chi-yu": "Chi-Yu",
  "chien-pao": "Chien-Pao",
  "iron-moth": "Iron Moth",
  "iron-hands": "Iron Hands",
  "walking-wake": "Walking Wake",
};

/**
 * The name to show for a Pokémon.
 * @param {string} name - The name from the game data, e.g. "deoxys-attack".
 * @returns {string} e.g. "Deoxys (Attack)".
 */
export function formatName(name) {
  if (!name) return "";
  if (specialNames[name]) return specialNames[name];

  const [species, ...form] = name.split("-");
  const base = capitalize(species);
  if (form.length === 0 || usualForms.has(name)) return base;
  if (form.length === 1 && regions[form[0]]) {
    return `${regions[form[0]]} ${base}`;
  }
  return `${base} (${formatSlug(form.join("-"))})`;
}

/**
 * What the map says about an area: a town's name, or an area's name and the
 * levels of its wild Pokémon. Spawns never reach an area's maxLevel, so the
 * top level shown is one below it.
 * @param {Object|undefined} area - An entry from areas.json.
 */
export function areaLabel(area) {
  if (!area) return "Uncharted";
  if (area.isTown) return area.name;
  return `${area.name} · Lv ${area.minLevel}–${area.maxLevel - 1}`;
}

/**
 * Damage as shown in battle. Early clicks do well under 1 damage, so small
 * hits keep one decimal place ("0.4"); bigger ones are whole numbers.
 * @param {number} damage
 */
export function formatDamage(damage) {
  if (damage < 10) return String(Math.round(damage * 10) / 10);
  return String(Math.round(damage));
}

/**
 * Chakra color scheme for an HP bar: green while healthy, yellow from half
 * health, red at a fifth or less.
 * @param {number} percent - Current HP as a percentage of max HP.
 */
export function hpColorScheme(percent) {
  if (percent > 50) return "green";
  if (percent > 20) return "yellow";
  return "red";
}

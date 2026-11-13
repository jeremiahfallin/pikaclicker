import { describe, expect, it } from "vitest";
import pokes from "../pokes.json";
import { formatName, formatSlug, hpColorScheme } from "./display";

describe("formatName", () => {
  it("capitalizes plain names", () => {
    expect(formatName("bulbasaur")).toBe("Bulbasaur");
    expect(formatName("porygon2")).toBe("Porygon2");
  });

  it("puts the region first for regional forms", () => {
    expect(formatName("raichu-alola")).toBe("Alolan Raichu");
    expect(formatName("slowpoke-galar")).toBe("Galarian Slowpoke");
    expect(formatName("growlithe-hisui")).toBe("Hisuian Growlithe");
    expect(formatName("wooper-paldea")).toBe("Paldean Wooper");
  });

  it("labels other forms in brackets", () => {
    expect(formatName("deoxys-attack")).toBe("Deoxys (Attack)");
    expect(formatName("toxtricity-low-key")).toBe("Toxtricity (Low Key)");
    expect(formatName("lycanroc-midnight")).toBe("Lycanroc (Midnight)");
  });

  it("leaves the usual form unlabeled", () => {
    expect(formatName("deoxys-normal")).toBe("Deoxys");
    expect(formatName("shaymin-land")).toBe("Shaymin");
    expect(formatName("meloetta-aria")).toBe("Meloetta");
    expect(formatName("mimikyu-disguised")).toBe("Mimikyu");
  });

  it("spells out names that don't follow the rules", () => {
    expect(formatName("nidoran-f")).toBe("Nidoran ♀");
    expect(formatName("nidoran-m")).toBe("Nidoran ♂");
    expect(formatName("ho-oh")).toBe("Ho-Oh");
    expect(formatName("porygon-z")).toBe("Porygon-Z");
    expect(formatName("type-null")).toBe("Type: Null");
    expect(formatName("kommo-o")).toBe("Kommo-o");
    expect(formatName("chi-yu")).toBe("Chi-Yu");
    expect(formatName("iron-moth")).toBe("Iron Moth");
    expect(formatName("walking-wake")).toBe("Walking Wake");
  });

  it("handles a missing name", () => {
    expect(formatName(undefined)).toBe("");
  });

  it("gives every Pokémon in the game a tidy name", () => {
    for (const { name } of pokes) {
      const shown = formatName(name);
      // Starts with a capital, and no slug hyphens left except in the
      // names that really have one (Ho-Oh, Porygon-Z, Kommo-o...).
      expect(shown, name).toMatch(/^[A-Z]/);
      expect(shown.includes("-"), name).toBe(
        ["ho-oh", "porygon-z", "jangmo-o", "hakamo-o", "kommo-o", "chi-yu", "chien-pao"].includes(name)
      );
    }
  });
});

describe("formatSlug", () => {
  it("turns an item slug into words", () => {
    expect(formatSlug("thunder-stone")).toBe("Thunder Stone");
    expect(formatSlug("kings-rock")).toBe("Kings Rock");
    expect(formatSlug("up-grade")).toBe("Up Grade");
  });
});

describe("hpColorScheme", () => {
  it("is green above half health", () => {
    expect(hpColorScheme(100)).toBe("green");
    expect(hpColorScheme(51)).toBe("green");
  });

  it("is yellow from half down to a fifth", () => {
    expect(hpColorScheme(50)).toBe("yellow");
    expect(hpColorScheme(21)).toBe("yellow");
  });

  it("is red at a fifth or less", () => {
    expect(hpColorScheme(20)).toBe("red");
    expect(hpColorScheme(0)).toBe("red");
  });
});

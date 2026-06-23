import { describe, expect, it } from "vitest";
import { games } from "./games";

describe("games config", () => {
  it("defines exactly the five MVP games", () => {
    expect(games).toHaveLength(5);
  });

  it("has unique ids", () => {
    const ids = games.map((g) => g.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("ships every game disabled in this slice", () => {
    expect(games.every((g) => g.enabled === false)).toBe(true);
  });

  it("gives every game a label, description, and icon", () => {
    for (const g of games) {
      expect(g.label.length).toBeGreaterThan(0);
      expect(g.description.length).toBeGreaterThan(0);
      expect(g.icon).toBeDefined();
    }
  });
});

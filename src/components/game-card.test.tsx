import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { GameCard } from "./game-card";
import { games } from "@/lib/games";

describe("GameCard", () => {
  it("renders the game's label and description", () => {
    render(<GameCard game={games[0]} />);
    expect(screen.getByText(games[0].label)).toBeInTheDocument();
    expect(screen.getByText(games[0].description)).toBeInTheDocument();
  });

  it("marks disabled games as aria-disabled", () => {
    render(<GameCard game={games[0]} />);
    expect(screen.getByTestId("game-card")).toHaveAttribute(
      "aria-disabled",
      "true",
    );
  });
});

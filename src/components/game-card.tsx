import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Game } from "@/lib/games";

export function GameCard({ game }: { game: Game }) {
  const Icon = game.icon;
  return (
    <Card
      data-testid="game-card"
      aria-disabled={!game.enabled}
      className="transition-colors aria-disabled:opacity-60"
    >
      <CardHeader>
        <Icon className="mb-2 size-8 text-muted-foreground" aria-hidden />
        <CardTitle>{game.label}</CardTitle>
        <CardDescription>{game.description}</CardDescription>
      </CardHeader>
    </Card>
  );
}

import { GameCard } from "@/components/game-card";
import { games } from "@/lib/games";

export default function Home() {
  return (
    <main className="mx-auto min-h-screen max-w-5xl px-4 py-12">
      <header className="mb-10 text-center">
        <h1 className="text-3xl font-bold tracking-tight">FrontalLobe</h1>
        <p className="mt-2 text-muted-foreground">
          Measure your mind. Five quick cognitive tests.
        </p>
      </header>
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {games.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </section>
    </main>
  );
}

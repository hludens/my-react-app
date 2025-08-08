import type { Game } from "./Types";
interface GameGridProps {
  games: Game[]|undefined
}

function GameGrid( {games}: GameGridProps) {
  if(!games) return null;
  return (
    <section className="game-grid">
      {games.map((game, idx) => (
        <a
          key={idx}
          href={game.url}
          className="game-card"
        >
          <img src={game.screenshot} alt={game.title} />
          <div className="overlay">
            <span>{game.title}</span>
          </div>
        </a>
      ))}
    </section>
  );
}

export default GameGrid; 
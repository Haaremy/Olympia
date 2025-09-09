import Image from "next/image";

// Definiere die Typen der Props für eine klarere Struktur
interface Game {
  name: string;
  id: string;
  top: number;
  left: number;
  color: string;
}

interface MapSectionProps {
  title: string;
  games: Game[];
  searchQuery: string;
}

function MapSection({ title, games, searchQuery }: MapSectionProps) {
  // Filtere Spiele basierend auf der Suchanfrage
  const filteredGames = games.filter((game) =>
    game.id.toLowerCase().includes(searchQuery.toLowerCase()) // Case-insensitive Suche
  );

  return (
    <section
      className={`bg-white dark:bg-gray-800 p-1 sm:max-w-[1080px] sm:p-6 rounded-lg shadow-lg w-full text-center mb-10 ${filteredGames.length !== 0 ? "visible" : "hidden"}`}
    >
      <div className="text-3xl font-bold text-pink-600 dark:text-pink-400 mb-4">{title}</div>

      <div className="relative flex flex-col bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden group cursor-pointer transition-transform transform">
        {/* Basisbild */}
        <Image
          src={"/images/map.jpg"}
          alt={`Map of ${title}`}
          className="w-full h-auto object-cover bg-gray-300"
          width={1600}
          height={1131}
        />

        {/* Markiere die Spiele auf der Karte */}
        {filteredGames.map((game) => (
          <span
            key={game.id}
            className={`absolute text-white font-bold text-sm ${game.color} rounded-full min-w-6 h-6 flex items-center justify-center`}
            style={{
              top: `${game.top}%`,
              left: `${game.left}%`,
            }}
          >
            {game.name}
          </span>
        ))}
      </div>
    </section>
  );
}

export default MapSection;

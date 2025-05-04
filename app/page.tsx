import { Language as PrismaLanguage } from '@prisma/client';
import Games from './games'; // Deine Client-Komponente
import { prisma } from "../lib/db";  // Dein Prisma Client


// Definiere den TransformedLanguage-Typ, der alle Felder von Language enthält
type TransformedLanguage = Omit<PrismaLanguage, 'descriptionGame' | 'descriptionPoints'> & {
  content: string; // Ersetze 'descriptionGame' mit 'content'
  points: string;  // Ersetze 'descriptionPoints' mit 'points'
};

export default async function Page() {
  // Hole alle Spiele mit ihren Sprachversionen aus der Datenbank
  const games = await prisma.game.findMany({
    include: {
      languages: true, // Lade die Sprachversionen mit
    },
  });

  // Umwandlung der Sprachversionen von Array zu Record<string, TransformedLanguage>
  const transformedGames = games.map(game => {
    const languages = game.languages.reduce((acc, language) => {
      acc[language.language] = {
        ...language, // Behalte alle Felder von PrismaLanguage bei
        content: language.descriptionGame, // Ersetze 'descriptionGame' mit 'content'
        points: language.descriptionPoints, // Ersetze 'descriptionPoints' mit 'points'
      };
      return acc;
    }, {} as Record<string, TransformedLanguage>);

    return {
      ...game,
      languages, // Ersetze das 'languages' Array durch das Record
    };
  });

  return (
    <div>
      <Games games={transformedGames} /> {/* Gib die transformierten Daten an die Client-Komponente weiter */}
    </div>
  );
}

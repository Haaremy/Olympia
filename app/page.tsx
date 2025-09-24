import Games from './games'; // Deine Client-Komponente
import { prisma } from "../lib/db";  // Dein Prisma Client
import { Language } from '@prisma/client';  // Importing Language type directly from Prisma

// Define the TransformedLanguage type based on the structure of the Language model
type TransformedLanguage = Omit<Language, 'descriptionGame' | 'descriptionPoints'> & {
  content: string;  // Replace 'descriptionGame' with 'content'
  points: string;   // Replace 'descriptionPoints' with 'points'
};

export default async function Page() {
  
  // Fetch all games with their language versions from the database
  const games = await prisma.game.findMany({
    include: {
      languages: true, // Include the language versions with the game
    },
  });


  // Transform the language versions from an array to a record
  const transformedGames = games.map(game => {
    const languages = game.languages.reduce((acc, language) => {
      acc[language.language] = {
        ...language, // Keep all fields from the Language model
        content: language.descriptionGame, // Replace 'descriptionGame' with 'content'
        points: language.descriptionPoints, // Replace 'descriptionPoints' with 'points'
      };
      return acc;
    }, {} as Record<string, TransformedLanguage>);

    return {
      ...game,
      languages, // Replace the 'languages' array with the transformed record
    };
  });

  return (
    <div>
      <Games games={transformedGames} searchQueryRef='' /> {/* Pass transformed data to the client component */}
    </div>
  );
}

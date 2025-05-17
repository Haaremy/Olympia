import { prisma } from '../lib/db'
import { gameEntries } from './gamesEntries'
import { teamEntries } from './teamEntries'
import { gameSettings} from './gameSettings'

//const prisma = new PrismaClient()

async function cleanDB() {
  await prisma.entries.deleteMany({});
  await prisma.$executeRaw`DELETE FROM sqlite_sequence WHERE name='Entries'`;
  await prisma.points.deleteMany({});
  await prisma.$executeRaw`DELETE FROM sqlite_sequence WHERE name='Points'`;
  await prisma.language.deleteMany({});
  await prisma.$executeRaw`DELETE FROM sqlite_sequence WHERE name='Language'`;
  await prisma.team.deleteMany({});
  await prisma.$executeRaw`DELETE FROM sqlite_sequence WHERE name='Team'`;
  await prisma.game.deleteMany({});
  await prisma.$executeRaw`DELETE FROM sqlite_sequence WHERE name='Game'`;
  await prisma.gameSettings.deleteMany({});
  await prisma.$executeRaw`DELETE FROM sqlite_sequence WHERE name='GameSettings'`;
  
  console.log('✅ Alle Datensätze wurden erfolgreich gelöscht!')
}



async function seedDB() {

  await gameEntries();
  console.log('✅ Seeded game with languages.')

  await teamEntries();
  console.log('✅ Seeded empty Teams.')

  await gameSettings();
  console.log('✅ Seeded Settings.')
  
}

async function main() {
  await cleanDB()  // Bereinige die Datenbank
  await seedDB()   // Füge neue Seed-Daten hinzu
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e)
    prisma.$disconnect()
    process.exit(1)
  })

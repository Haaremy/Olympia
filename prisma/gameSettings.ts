import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function gameSettings() {
  try {
    // Create gameSettings with the required properties
    const gameSettings = await prisma.gameSettings.create({
      data: {
        started: false,    // Initially, the game hasn't started
        ending: new Date("2025-12-05T21:00:00.000Z"),  // Set an ending time for the game
      },
    });


  } catch (error) {
    console.error("Error creating game settings:", error);
  } finally {
    await prisma.$disconnect();  // Disconnect the Prisma client when done
  }
}

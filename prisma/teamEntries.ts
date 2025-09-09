import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Extract type from the prisma client method itself




export async function teamEntries() {
  await prisma.team.create({
    data: {
      uname: 'FBINS',
      name: "FSR Admin",
      password: 'FSR5',
      role: 'ADMIN',
      user1: "Jeremy",
      user2: "Santa Clause",
      pointsTotal: 0,
      
    },
  })

  await prisma.team.create({
    data: {
      uname: 'DUMMY',
      password: 'TEST',
      role: 'USER',
      name: 'DummyTeam#1',
      user1: 'Testi',
      user2: 'Bruder von Testi',
      pointsTotal: 0,
    },
  })



  
}

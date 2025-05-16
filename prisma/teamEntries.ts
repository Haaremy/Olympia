import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

type TeamCreateInput = Parameters<typeof prisma.team.create>[0]['data']

type SafeTeamCreateInput = Omit<TeamCreateInput, 'id'>;

function getEmptyTeam(overrides: Partial<SafeTeamCreateInput>): SafeTeamCreateInput {
  return {
    credentials: '',
    password: '',
    name: '',
    user1: '',
    user2: '',
    user3: '',
    user4: '',
    role: 'USER',
    pointsTotal: 0,
    language: 'de',
    ...overrides,
  };
}


export async function teamEntries() {
    const fsrTeam = await prisma.team.create({
        data: getEmptyTeam({
          credentials: 'FBINS',
          password: 'FSR5',
          role: 'ADMIN'
        })
      });

      const dummyTeam = await prisma.team.create({
        data: getEmptyTeam({
          credentials: 'DUMMY',
          password: 'TEST',
          role: 'USER',
          name: 'DummyTeam#1',
          user1: 'Testi',
          user2: 'Bruder von Testi'
        })
      });

      const dummyTeam2 = await prisma.team.create({
        data: getEmptyTeam({
          credentials: 'DUMMY2',
          password: 'TEST',
          role: 'USER'
        })
      });

      const userTeam1 = await prisma.team.create({
        data: getEmptyTeam({
          credentials: 'GSIA7',
          password: 'X1HJ',
          role: 'USER'
        })
      });
}
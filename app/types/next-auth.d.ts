import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: Team & DefaultSession["user"];
  }

  interface Session {
    id: string;
    uname: string;
    name: string;
    role: string;
    language: string;
    player1: string;
    player2: string;
    player3: string;
    player4: string;
    pointsTotal: number;
  }

interface User {
    id: string;
    uname: string;
    name: string;
    role: string;
    player1: string;
    player2: string;
    player3: string;
    player4: string;
    language: string;
    pointsTotal: number;
  }
}
  declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    uname: string;
    name: string;
    role: string;
    player1: string;
    player2: string;
    player3: string;
    player4: string;
    language: string;
    pointsTotal: number;
  }
}

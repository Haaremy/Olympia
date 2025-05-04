import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: Team & DefaultSession["user"];
  }

  interface User {
    id: string;
    credentials: string;
    name: string;
    role: string;
    language: string;
    user1: string;
    user2: string;
    user3: string;
    user4: string;
    pointsTotal: number;
  }


}

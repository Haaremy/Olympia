// /lib/authOptions.ts
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "./db";  // Dein Prisma Client

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const username = credentials?.username;
        const password = credentials?.password;

        // Überprüfe, ob sowohl der Benutzername als auch das Passwort vorhanden sind
        if (!username || !password) {
          console.error("Fehlende Anmeldeinformationen.");
          return null;
        }

        try {
          // Suche nach dem Team in der Datenbank anhand des Benutzernamens
          const team = await prisma.team.findUnique({
            where: { credentials: username },
          });

          // Überprüfe, ob das Team existiert und das Passwort übereinstimmt
          if (!team || team.password !== password) {
            console.error("Ungültiger Benutzername oder Passwort.");
            return null;
          }

          // Falls alles in Ordnung ist, gibt die Nutzerinformationen zurück
          return {
            id: String(team.id),
            name: team.name,
            credentials: team.credentials,
            role: team.role,
            language: team.language,
            user1: team.user1,
            user2: team.user2,
            user3: team.user3 || "",
            user4: team.user4 || "",
            pointsTotal: team.pointsTotal,
          };
        } catch (error) {
          // Fehlerbehandlung für den Fall, dass die Prisma-Abfrage fehlschlägt
          console.error("Fehler beim Abrufen des Teams:", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt", // JWT-basierte Sitzungen
    maxAge: 43200, // 12 Stunden
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.credentials = user.credentials;
        token.role = user.role;
        token.language = user.language;
        token.user1 = user.user1;
        token.user2 = user.user2;
        token.user3 = user.user3;
        token.user4 = user.user4;
        token.pointsTotal = user.pointsTotal;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          id: token.id as string,
          name: token.name as string,
          credentials: token.credentials as string,
          role: token.role as string,
          language: token.language as string,
          user1: token.user1 as string,
          user2: token.user2 as string,
          user3: token.user3 as string,
          user4: token.user4 as string,
          pointsTotal: token.pointsTotal as number,
        };
      }
      return session;
    },
  },
};

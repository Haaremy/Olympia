import { NextAuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "./db";  // Prisma Client
import bcrypt from "bcrypt";

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

        // Check if both username and password are provided
        if (!username || !password) {
          console.error("Missing login credentials.");
          return null;
        }

        try {
          // Search for the team in the database using the username
          const team = await prisma.team.findUnique({
            where: { uname: username },
          });

          // Check if team exists and password matches
          if (!team || !await bcrypt.compare(credentials!.password, team.password)) {

            console.error("Invalid username or password.");
            return null;
          }
          const user: User = {
            //id: '2',
            id: String(team.id),
            //credentials: "DUMMY",
            uname: team.uname,
            //role: 'USER',
            role: team.role,
            //language: 'de',
            language: team.language,
            //name: 'Dummyteam#1',
            name: team.name,
            //pointsTotal: 0
            pointsTotal: team.pointsTotal,
            player1: team.user1,
            player2: team.user2,
            player3: team.user3 || "",
            player4: team.user4 || "",

          };
          return user;
        } catch (error) {
          // Handle errors, e.g., Prisma query errors
          console.error("Error fetching team:", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt", // JWT-based sessions
    maxAge: 43200, // 12 hours
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // Store user data in the token
        token.id = user.id;
        token.uname = user.uname;
        token.role = user.role;
        token.language = user.language;
        token.name = user.name;
        token.pointsTotal = user.pointsTotal;
      }

      return token;
    },
    async session({ session, token }) {
      if (token) {
        // Attach the token data to the session object
        session.user = {
          id: token.id as string,
          uname: token.uname as string,
          role: token.role as string,
          language: token.language as string,
          name: token.name as string,
          pointsTotal: token.pointsTotal as number,
        };
      }
      return session;
    },
  },
};

import { NextAuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "./db";  // Prisma Client

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {

        const user: User = {
          id: '2',
          name: 'DummyTeam#1',
          role: 'USER',
          language: 'de',
          user1: 'Testi',
          user2: 'Bruder von Testi',
          pointsTotal: 0,
          credentials: "DUMMY",
          user3: "",
          user4: ""
        };

       

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
            where: { credentials: username },
          });

          // Check if team exists and password matches
          if (!team || team.password !== password) {
            console.error("Invalid username or password.");
            return null;
          }
          return user;
          // If everything is correct, return user information
          /*return {
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
          };*/
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
      console.log("JWT Callback", { token, user });  // Log token and user to debug
      if (user) {
        // Store user data in the token
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
      console.log("Session Callback", { session, token });  // Log session and token
      if (token) {
        // Attach the token data to the session object
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

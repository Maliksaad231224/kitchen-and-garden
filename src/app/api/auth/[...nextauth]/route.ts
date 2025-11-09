import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { verifyAdminPassword, verifyUserPassword, findOrCreateOAuthUser } from "@/lib/db";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "admin" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        try {
          // First try admin
          const admin = await verifyAdminPassword(
            credentials.username,
            credentials.password
          );

          if (admin) {
            return {
              id: admin.id.toString(),
              name: admin.username,
              email: `${admin.username}@admin.local`,
              role: "admin",
            };
          }

          // Then try regular user
          const user = await verifyUserPassword(
            credentials.username,
            credentials.password
          );

          if (user) {
            return {
              id: user.id.toString(),
              name: user.username,
              email: `${user.username}@user.local`,
              role: "user",
            };
          }

          return null;
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
    // Google OAuth
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },
  callbacks: {
  async signIn({ user, account }) {
      try {
        // If signed in with Google, ensure we have a corresponding user record
        if (account?.provider === "google") {
          const username = (user?.email as string) || (user?.name as string);
          if (!username) return false;
          const dbUser = await findOrCreateOAuthUser(username);
          if (!dbUser) return false;
          // attach id and role to the NextAuth user object so jwt callback sees it
          (user as any).id = dbUser.id.toString();
          (user as any).role = "user";
        }

        return true;
      } catch (err) {
        console.error("signIn callback error:", err);
        return false;
      }
    },

    async jwt({ token, user }) {
      if (user) {
        // For credentials provider, authorize already populated id/role
        token.id = (user as any).id || token.id;
        if ((user as any).role) token.role = (user as any).role;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        (session.user as any).role = token.role as string | undefined;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

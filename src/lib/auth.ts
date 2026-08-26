import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

// Initialize Prisma
const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        role: { label: "Role", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.error("Auth error: Missing credentials");
          throw new Error("Invalid credentials");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) {
          console.error(`Auth error: User not found or has no password for email: ${credentials.email}`);
          throw new Error("Invalid credentials");
        }

        if (credentials.role && credentials.role !== "ADMIN" && user.role !== credentials.role && user.role !== "ADMIN") {
          console.error(`Auth error: Role mismatch for email: ${credentials.email}`);
          const displayRole = user.role.charAt(0).toUpperCase() + user.role.slice(1).toLowerCase();
          throw new Error(`This email is already registered as a ${displayRole} account. Please select the ${displayRole} tab to log in.`);
        }

        const isCorrectPassword = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isCorrectPassword) {
          console.error(`Auth error: Incorrect password for email: ${credentials.email}`);
          throw new Error("Invalid credentials");
        }

        console.log(`Auth success for email: ${credentials.email}`);
        
        // Return a serializable object (avoids Next.js Date/BigInt errors)
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          isApproved: user.isApproved,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async signIn({ user, account, profile, email, credentials }: any) {
      if (account?.provider === 'google') {
        // We can check if the user exists and their role matches the intended one
        // To do this, we need to read a cookie set by the frontend before redirecting
        try {
          const { cookies } = require('next/headers');
          const cookieStore = await cookies();
          const intendedRole = cookieStore.get('intendedRole')?.value;

          if (intendedRole && user.email) {
            const dbUser = await prisma.user.findUnique({
              where: { email: user.email }
            });

            if (dbUser && dbUser.role !== 'ADMIN' && dbUser.role !== intendedRole) {
              const displayRole = dbUser.role.charAt(0).toUpperCase() + dbUser.role.slice(1).toLowerCase();
              return `/login?error=This email is already registered as a ${displayRole} account. Please select the ${displayRole} tab to log in.`;
            }
          }
        } catch (e) {
          // ignore cookie errors
        }
      }
      return true;
    },
    async session({ session, token }: any) {
      if (token && session.user) {
        session.user.id = token.sub;
        session.user.role = token.role;
        session.user.isApproved = token.isApproved;
        if (token.picture) session.user.image = token.picture;
      }
      return session;
    },
    async jwt({ token, user, trigger }: any) {
      if (trigger === "update" && token.sub) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.sub }
        });
        if (dbUser) {
          token.name = dbUser.name;
          token.picture = dbUser.image;
        }
        return token;
      }

      if (user) {
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email }
        });
        if (dbUser) {
          token.role = dbUser.role;
          token.isApproved = dbUser.isApproved;
          token.sub = dbUser.id;
          token.picture = dbUser.image;
        } else {
          // If the user doesn't exist (new signup via Google), use the intended role from cookie if available
          let defaultRole = 'STUDENT';
          try {
            const { cookies } = require('next/headers');
            const cookieStore = await cookies();
            const intendedRole = cookieStore.get('intendedRole')?.value;
            if (intendedRole && ['STUDENT', 'TUTOR'].includes(intendedRole)) {
              defaultRole = intendedRole;
            }
          } catch (e) {}

          token.role = (user as any).role || defaultRole;
          token.isApproved = (user as any).isApproved || false;
        }
      }
      return token;
    },
  },
  events: {
    async createUser({ user }) {
      // Intercept new user creation and assign the intended role from cookie
      try {
        const { cookies } = require('next/headers');
        const cookieStore = await cookies();
        const intendedRole = cookieStore.get('intendedRole')?.value;
        
        if (intendedRole && ['STUDENT', 'TUTOR'].includes(intendedRole)) {
          await prisma.user.update({
            where: { id: user.id },
            data: { role: intendedRole as any },
          });
          console.log(`Successfully updated newly created Google user ${user.email} to role: ${intendedRole}`);
        }
      } catch (error) {
        console.error("Error setting role in createUser event:", error);
      }
    }
  },
  secret: process.env.NEXTAUTH_SECRET || "fallback_secret_key",
};

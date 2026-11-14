import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";

// Initialize Prisma
const prisma = new PrismaClient();

function cleanString(str?: string | null): string {
  if (!str) return "";
  let cleaned = str.trim();
  if (
    (cleaned.startsWith('"') && cleaned.endsWith('"')) ||
    (cleaned.startsWith("'") && cleaned.endsWith("'"))
  ) {
    cleaned = cleaned.substring(1, cleaned.length - 1).trim();
  }
  return cleaned;
}

function getAdminEnvCredentials() {
  let email = cleanString(process.env.ADMIN_EMAIL);
  let username = cleanString(process.env.ADMIN_USERNAME);
  let password = cleanString(process.env.ADMIN_PASSWORD);
  let jwtExpiresIn = cleanString(process.env.JWT_EXPIRES_IN);

  try {
    const envPaths = [
      path.join(process.cwd(), ".env"),
      path.join(process.cwd(), ".env.local"),
      path.resolve(__dirname, "../../.env"),
      path.resolve(__dirname, "../../../.env"),
      "d:\\hdclarityspeech\\.env",
    ];

    for (const p of envPaths) {
      if (fs.existsSync(p)) {
        const content = fs.readFileSync(p, "utf8");
        const lines = content.split("\n");
        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || trimmed.startsWith("#")) continue;
          const eqIdx = trimmed.indexOf("=");
          if (eqIdx !== -1) {
            const key = trimmed.slice(0, eqIdx).trim();
            const val = trimmed.slice(eqIdx + 1).trim();
            if (key === "ADMIN_EMAIL") email = cleanString(val);
            if (key === "ADMIN_USERNAME") username = cleanString(val);
            if (key === "ADMIN_PASSWORD") password = cleanString(val);
            if (key === "JWT_EXPIRES_IN") jwtExpiresIn = cleanString(val);
          }
        }
        if (password) break;
      }
    }
  } catch (err) {
    console.error("Error reading admin credentials from .env:", err);
  }

  return {
    email: email || "admin@hdclarityspeech.com",
    username: username || "admin",
    password: password || "admin@123",
    jwtExpiresIn: jwtExpiresIn || "24h",
  };
}

function parseDurationToSeconds(durationStr?: string | null): number {
  if (!durationStr) return 24 * 60 * 60; // 24h default
  const str = String(durationStr).trim().toLowerCase();
  const match = str.match(/^(\d+)([smhdwy]?)$/);
  if (!match) return 24 * 60 * 60;
  const val = parseInt(match[1], 10);
  const unit = match[2];
  switch (unit) {
    case "s": return val;
    case "m": return val * 60;
    case "h": return val * 3600;
    case "d": return val * 86400;
    case "w": return val * 7 * 86400;
    case "y": return val * 365 * 86400;
    default: return val;
  }
}

function getSessionMaxAge(): number {
  const creds = getAdminEnvCredentials();
  return parseDurationToSeconds(creds.jwtExpiresIn || process.env.JWT_EXPIRES_IN || "24h");
}

async function syncAdminUser(targetEmail: string, newPlainPass: string) {
  try {
    const passwordHash = await bcrypt.hash(newPlainPass, 10);

    // 1. Check if user exists by target email
    let user = await prisma.user.findUnique({
      where: { email: targetEmail },
    });

    // 2. If not found by email, check if any existing admin user exists
    if (!user) {
      user = await prisma.user.findFirst({
        where: { role: "ADMIN" },
      });
    }

    if (user) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          email: targetEmail,
          password: passwordHash,
          role: "ADMIN",
          isActive: true,
        },
      });
      console.log(`Synced admin credentials in DB for user: ${targetEmail}`);
    } else {
      user = await prisma.user.create({
        data: {
          email: targetEmail,
          password: passwordHash,
          name: "System Admin",
          role: "ADMIN",
          isActive: true,
          isApproved: true,
        },
      });
      console.log(`Created new admin account in DB with email: ${targetEmail}`);
    }

    return user;
  } catch (error) {
    console.error("Failed to sync admin user in DB:", error);
    return {
      id: "admin-env",
      email: targetEmail,
      name: "System Admin",
      role: "ADMIN" as const,
      isActive: true,
      isApproved: true,
    };
  }
}

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

        const inputEmail = cleanString(credentials.email).toLowerCase();
        const inputPass = cleanString(credentials.password);
        const reqRole = cleanString(credentials.role).toUpperCase();

        const adminCreds = getAdminEnvCredentials();
        const adminEmailClean = adminCreds.email.toLowerCase();
        const adminUserClean = adminCreds.username.toLowerCase();

        const isAdminAttempt =
          reqRole === "ADMIN" ||
          inputEmail === adminEmailClean ||
          inputEmail === adminUserClean ||
          inputEmail === "admin" ||
          inputEmail === "admin@hdclarityspeech.com" ||
          inputEmail === "admin@hdclarity.com";

        if (isAdminAttempt) {
          if (inputPass !== adminCreds.password) {
            console.error("Auth error: Invalid admin password against active .env authority");
            throw new Error("Invalid credentials");
          }

          const targetEmail = adminCreds.email || "admin@hdclarityspeech.com";
          const adminUser = await syncAdminUser(targetEmail, adminCreds.password);

          console.log(`Admin authentication successful via .env authority for: ${targetEmail}`);
          return {
            id: adminUser.id,
            email: adminUser.email,
            name: adminUser.name || "System Admin",
            role: "ADMIN",
            isApproved: true,
          };
        }

        // Standard user/student/tutor authentication
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
    maxAge: getSessionMaxAge(),
  },
  jwt: {
    maxAge: getSessionMaxAge(),
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
      const now = Math.floor(Date.now() / 1000);
      if (!token || token.error === "TokenExpiredError" || (token.expiresAt && now > token.expiresAt)) {
        return null;
      }

      if (token && session.user) {
        session.user.id = token.sub;
        session.user.role = token.role;
        session.user.isApproved = token.isApproved;
        if (token.picture) session.user.image = token.picture;
      }
      return session;
    },
    async jwt({ token, user, trigger }: any) {
      const now = Math.floor(Date.now() / 1000);
      const activeMaxAge = getSessionMaxAge();

      if (user) {
        token.issuedAt = now;
        token.expiresAt = now + activeMaxAge;

        if ((user as any).role === "ADMIN") {
          token.role = "ADMIN";
          token.isApproved = true;
          token.sub = user.id;
          token.name = user.name || "System Admin";
          token.email = user.email;
          return token;
        }

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
        return token;
      }

      // Check if session has expired on subsequent requests
      if (token.expiresAt && now > token.expiresAt) {
        console.warn(`[NextAuth] Token expired for user: ${token.email || token.sub}. Exp: ${token.expiresAt}, Now: ${now}`);
        token.error = "TokenExpiredError";
        return token;
      }

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

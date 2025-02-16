import { PrismaAdapter } from "@auth/prisma-adapter";
import { Account, type DefaultSession, type NextAuthConfig } from "next-auth";

import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

import DiscordProvider from "next-auth/providers/discord";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

import { db } from "~/server/db";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authConfig = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      async authorize(credentials, req) {
        const { email, password } = credentials;

        try {
          const user = await db.user.findUnique({
            where: {
              email: email as string,
            },
          });

          if (!user || !user.passwordHash) {
            console.log(
              "No credentials user found in database for email:",
              email,
            );
            return null; // No user found in database
          }

          const passwordMatch = await bcrypt.compare(
            password as string,
            user.passwordHash,
          );

          if (passwordMatch) {
            return {
              id: user.id.toString(),
              name: user.name,
              email: user.email,
              image: user.image,
            };
          } else {
            console.log("Password mismatch for user:", email);
            return null; // Passwords do not match
          }
        } catch (err) {
          console.error("Error during authorize:", err);
          return null; // Handle any errors during database lookup
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
    }),

    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
  ],
  adapter: PrismaAdapter(db),
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: "/auth/signin", // Custom sign-in page'
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      const { email } = user;
      account = account as Account;
      const { providerAccountId, provider } = account;

      try {
        // Add a try...catch block to handle potential errors
        // 1. Check if a user already exists with this email
        const existingUser = await db.user.findUnique({
          where: { email: email as string },
        });

        if (existingUser) {
          // 2. Check if this provider account is already linked to this user
          const existingAccountLink = await db.account.findFirst({
            where: {
              userId: existingUser.id,
              provider,
              providerAccountId,
            },
          });

          if (!existingAccountLink) {
            // 3. Link the new provider account to the existing user
            await db.account.create({
              data: {
                userId: existingUser.id,
                provider: provider,
                providerAccountId: providerAccountId,
                type: account.type, // Usually "oauth"
                access_token: account.access_token, // Store tokens if needed
                expires_at: account.expires_at,
                id_token: account.id_token,
                refresh_token: account.refresh_token,
                scope: account.scope,
                session_state: account.session_state as string,
                token_type: account.token_type,
              },
            });
          }
          return true; // Sign in successful (or account already linked)
        } else {
          // If no user with this email exists, let NextAuth handle account creation as usual.
          // The Prisma adapter will handle user creation on first login.
          return true;
        }
      } catch (error) {
        console.error("Error in signIn callback:", error);
        // Handle the error appropriately.
        // For signIn callback, returning false usually means "prevent sign-in".
        // Or you could redirect to an error page if needed.
        return false; // Or potentially a redirect URL string if you want custom error handling page
      }
    },
    async session({ session, token, user }) {
      console.log("Session Callback - Token:", token); // Log token in session callback
      console.log("Session Callback - User:", user); // Log user in session callback
      if (token?.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
    async jwt({ token, user, account, profile, trigger }) {
      console.log("JWT Callback - User:", user); // Log user in jwt callback
      console.log("JWT Callback - Token (before):", token); // Log token before modification
      if (user) {
        token.sub = user.id?.toString();
      }
      console.log("JWT Callback - Token (after):", token); // Log token after modification
      return token;
    },
  },
} satisfies NextAuthConfig;

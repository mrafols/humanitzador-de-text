import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

const providers: NextAuthOptions["providers"] = [];

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  );
}

// Proveïdor de credencials per a accés ràpid / desenvolupament
providers.push(
  CredentialsProvider({
    id: "credentials",
    name: "Accés directe",
    credentials: {
      name: { label: "Nom", type: "text", placeholder: "El teu nom" },
      email: { label: "Email", type: "email", placeholder: "usuari@exemple.cat" },
    },
    async authorize(credentials) {
      const email = credentials?.email?.trim() || "usuari@humanitzador.local";
      const name = credentials?.name?.trim() || email.split("@")[0] || "Usuari";

      return {
        id: email,
        name,
        email,
      };
    },
  })
);

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers,
  pages: {
    signIn: "/login",
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = (token.id as string) || (token.sub as string) || "user";
        if (token.name) session.user.name = token.name as string;
        if (token.email) session.user.email = token.email as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || "humanitzador-de-text-secret-key-123456789",
};

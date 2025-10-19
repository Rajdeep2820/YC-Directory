import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import { client } from "./sanity/lib/client";
import { AUTHOR_GOOGLE_ID_QUERY} from "./sanity/lib/queries";
import { writeClient } from "./sanity/lib/write-client";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [GitHub , Google],

  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        const googleId = profile.sub.toString();
        const existingUser = await client.withConfig({ useCdn: false }).fetch(
          AUTHOR_GOOGLE_ID_QUERY,
          { id: googleId }
        );

        if (!existingUser) {
          await writeClient.create({
            _type: "author",
            _id: googleId,
            id: googleId,
            name: user.name,
            username: user.email.split("@")[0],
            email: user.email,
            image: user.image,
            bio: "",
          });
        }
      }

      if (account?.provider === "github") {
        const gitId = profile.id.toString();
        const existingUser = await client.withConfig({ useCdn: false }).fetch(
          AUTHOR_GOOGLE_ID_QUERY,
          { id: gitId }
        );

        if (!existingUser) {
          await writeClient.create({
            _type: "author",
            _id: gitId,
            id: gitId,
            name: user.name,
            username: profile.login,
            email: user.email,
            image: user.image,
            bio: profile.bio || "",
          });
        }
      }

      return true;
    },

    async JWT({ token, account, profile }) {
      if (account.provider === "google") {
        const user = await client.withConfig({ useCdn: false }).fetch(AUTHOR_GOOGLE_ID_QUERY, { id: profile.sub });
        if (!user) token.id = user?.id;
      }

      if (account?.provider === "github") {
        const user = await client.withConfig({ useCdn: false }).fetch(AUTHOR_GOOGLE_ID_QUERY, { id: profile.id });
        if (!user) token.id = user?.id;
      }
      return token;
    },

    async session({ token , session}) {
      session.id = token.id;
      session.provider = token.provider;
      return session;
    },
  },
});

/* | Key            | Description                                                                       |
| -------------- | --------------------------------------------------------------------------------- |
| `user`         | Contains the user info fetched from Google (`name`, `email`, `image`, `id`).      |
| `accessToken`  | (Sometimes present) — allows your app to make authorized requests to Google APIs. |
| `refreshToken` | (Server-side only) — used to get a new access token when it expires.              |
| `idToken`      | The OpenID Connect token that contains identity claims about the user.            |
| `expires`      | A timestamp of when the session expires.                                          |
| `provider`     | Tells which OAuth provider was used (e.g., `google`).                             |



DIFFERENCE BETWEEN client and writeClient : 
| Term                       | Meaning                                          |                              |
| -------------------------- | ------------------------------------------------ | ---------------------------- |
| **`client`**               | Read-only, cached via CDN, public-safe           |                              |
| **`writeClient`**          | Write-enabled, uses API token, private to server |                              |
| **When to use**            | UI components, page queries                      | Server/API mutations         |
| **Configured differently** | `useCdn: true`                                   | `useCdn: false`, `token` set |




*/
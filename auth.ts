import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { client } from "./sanity/lib/client";
import { AUTHOR_GOOGLE_ID_QUERY } from "./sanity/lib/queries";
import { writeClient } from "./sanity/lib/write-client";
 
export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [Google],
  callbacks : {

    async signIn({ user , profile }) {
      const googleId = profile.sub; // ✅ correct Google unique ID
    
      const existingUser = await client.withConfig({useCdn : false}).fetch(
        AUTHOR_GOOGLE_ID_QUERY,
        { id: googleId }  // pass correct ID
      );
    
      if (!existingUser) {
        await writeClient.create({
          _type: "author",
          id: googleId,
          name: user.name,
          username: user.email.split('@')[0], // Google has no login field
          email: user.email,
          image: user.image,
          bio: "", // optional
        });
      }
    
      return true;
    },
    
    // async jwt({token , account , profile}){
    //   if(account && profile){
    //     const user = await client.withConfig({useCdn : false}).fetch(AUTHOR_GOOGLE_ID_QUERY , {id : profile.sub});
    //     if(!user){
    //       token.id = user?._id;
    //     }
    //   }
    //   return token;
    // },
    async jwt({ token, account, profile }) {
      // Only run on login
      if (account && profile) {
        const user = await client.withConfig({useCdn : false}).fetch(AUTHOR_GOOGLE_ID_QUERY, { id: profile.sub });
        if (user) {
          token.id = user?.id; // ✅ assign user._id to token
        }
      }
      return token;
    },
    
    // async session({session , token}){
    //   Object.assign(session , {id : token.id});
    //   return session;
    // },
    async session({ session, token }) {
      // Copy the id from JWT to session
      session.id = token.id;
      return session;
    }, 
  },
})


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
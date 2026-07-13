import { unstable_cache } from "next/cache";
import { client } from "@/sanity/lib/client";
import {
  AUTHOR_BY_ID_QUERY,
  STARTUP_BY_ID_QUERY,
  STARTUP_QUERY,
  STARTUPS_BY_AUTHOR_QUERY,
} from "@/sanity/lib/queries";

// Fix #3: Each cache call uses a unique key that embeds the dynamic parameter,
// preventing different arguments from sharing the same cache slot.
// Tags are also scoped (e.g. "startup-<id>") so on-demand revalidation
// only purges the specific document instead of the entire collection.

export const getStartups = (search: string | null) =>
  unstable_cache(
    () => client.fetch(STARTUP_QUERY, { search }),
    [`startups-${search ?? "all"}`],
    { revalidate: 300, tags: ["startups"] },
  )();

export const getStartupById = (id: string) =>
  unstable_cache(
    () => client.fetch(STARTUP_BY_ID_QUERY, { id }),
    [`startup-by-id-${id}`],
    { revalidate: 300, tags: ["startups", `startup-${id}`] },
  )();

export const getAuthorById = (id: string) =>
  unstable_cache(
    () => client.fetch(AUTHOR_BY_ID_QUERY, { id }),
    [`author-${id}`],
    { revalidate: 300, tags: ["authors", `author-${id}`] },
  )();

export const getStartupsByAuthor = (id: string) =>
  unstable_cache(
    () => client.fetch(STARTUPS_BY_AUTHOR_QUERY, { id }),
    [`startups-by-author-${id}`],
    { revalidate: 300, tags: ["startups", `author-startups-${id}`] },
  )();

import { NextRequest, NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";
import { STARTUP_VIEWS_BY_IDS_QUERY } from "@/sanity/lib/queries";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const ids = request.nextUrl.searchParams
    .get("ids")
    ?.split(",")
    .filter(Boolean)
    .slice(0, 100);

  if (!ids?.length) {
    return NextResponse.json({});
  }

  // Use the CDN client (useCdn: true) for this read-only query.
  // Previously this used useCdn: false, which bypassed Sanity's global CDN and
  // hit the origin server on every page load — adding 150–300ms of unnecessary
  // latency (especially from regions far from Sanity's origin).
  // View counts can tolerate a few seconds of CDN staleness; the View component
  // in the detail page calls the write API directly and returns the fresh count
  // to the client in real time anyway.
  const startups = await client.fetch(
    STARTUP_VIEWS_BY_IDS_QUERY,
    { ids },
    { next: { revalidate: 60 } }, // allow CDN to cache for up to 60 seconds
  );

  const views = Object.fromEntries(
    startups.map(({ _id, views }: { _id: string; views: number | null }) => [
      _id,
      views ?? 0,
    ]),
  );

  return NextResponse.json(views, {
    headers: {
      // Let the browser / edge cache this for 30 seconds before re-fetching
      "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60",
    },
  });
}

import { NextResponse } from "next/server";
import { createHash } from "node:crypto";
import { writeClient } from "@/sanity/lib/write-client";
import { STARTUP_VIEWS_QUERY } from "@/sanity/lib/queries";

export const dynamic = "force-dynamic";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const viewId = request.headers.get("X-View-Id");

  if (!viewId || !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(viewId)) {
    return NextResponse.json({ error: "A valid view identifier is required." }, { status: 400 });
  }

  const eventId = `view-event-${createHash("sha256")
    .update(`${id}:${viewId}`)
    .digest("hex")}`;

  let incremented = false;

  try {
    await writeClient.create({
      _id: eventId,
      _type: "viewEvent",
      startup: { _type: "reference", _ref: id },
    });
    incremented = true;
  } catch (error) {
    if (!(typeof error === "object" && error !== null && "statusCode" in error && error.statusCode === 409)) {
      throw error;
    }
  }

  const startup = incremented
    ? await writeClient
        .patch(id)
        .setIfMissing({ views: 0 })
        .inc({ views: 1 })
        .commit({ returnDocuments: true })
    : await writeClient.fetch(STARTUP_VIEWS_QUERY, { id });

  return NextResponse.json(
    { views: startup.views ?? 0 },
    { headers: { "Cache-Control": "no-store" } },
  );
}

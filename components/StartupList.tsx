"use client";

import { useEffect, useMemo, useState } from "react";
import StartupCard, { type StartupTypeCard } from "./StartupCard";

type ViewCounts = Record<string, number>;

export default function StartupList({ posts }: { posts: StartupTypeCard[] }) {
  const startupIds = useMemo(() => posts.map(({ _id }) => _id), [posts]);
  const [viewCounts, setViewCounts] = useState<ViewCounts>({});

  useEffect(() => {
    if (startupIds.length === 0) return;

    const controller = new AbortController();

    const loadViewCounts = async () => {
      try {
        const params = new URLSearchParams({ ids: startupIds.join(",") });
        const response = await fetch(`/api/startups/views?${params}`, {
          cache: "no-store",
          signal: controller.signal,
        });

        if (!response.ok) return;
        setViewCounts(await response.json());
      } catch (error) {
        if (!controller.signal.aborted) throw error;
      }
    };

    void loadViewCounts();
    return () => controller.abort("Startup list unmounted");
  }, [startupIds]);

  return (
    <ul className="mt-7 card_grid">
      {posts.map((post) => (
        <StartupCard
          key={post._id}
          post={{ ...post, views: viewCounts[post._id] ?? post.views }}
        />
      ))}
    </ul>
  );
}

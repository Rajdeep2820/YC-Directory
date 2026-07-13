"use client";

import React, { useEffect, useRef, useState } from "react";
import Ping from "./Ping";

const View = ({ id, initialViews }: { id: string; initialViews: number }) => {
    const [views, setViews] = useState(initialViews);
    const viewId = useRef<string>(crypto.randomUUID());

    useEffect(() => {
        const incrementViews = async () => {
            const response = await fetch(`/api/startups/${encodeURIComponent(id)}/view`, {
                method: "POST",
                cache: "no-store",
                headers: { "X-View-Id": viewId.current },
            });

            if (!response.ok) return;

            const { views } = await response.json();
            setViews(views);
        };

        void incrementViews();
    }, [id]);

    return ( <div className="view-container">
        <div className="absolute -top-2 -right-2">
            <Ping/>
        </div>

        <p className="view-text">
                       {views === 1 ? <span className="font-black">{views} View</span>
            :  <span className="font-black">{views} Views</span>}
        </p>
    </div>
    );
}

export default View;

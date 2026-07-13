"use client";

import { useEffect } from "react";

const feedbackPositionStyles = `
  .widget__actor {
    left: 50% !important;
    right: auto !important;
    bottom: 16px !important;
    margin: 0 !important;
  }

  .widget__actor[aria-hidden="false"] {
    transform: translateX(-50%) scale(1) !important;
  }

  .widget__actor[aria-hidden="true"] {
    transform: translate(-50%, 16px) scale(0.98) !important;
  }
`;

export default function SentryFeedbackPositioner() {
  useEffect(() => {
    const positionFeedbackButton = () => {
      const host = document.getElementById("sentry-feedback");
      const shadowRoot = host?.shadowRoot;

      if (!shadowRoot || shadowRoot.querySelector("style[data-positioner]")) {
        return Boolean(shadowRoot);
      }

      const style = document.createElement("style");
      style.dataset.positioner = "true";
      style.textContent = feedbackPositionStyles;
      shadowRoot.appendChild(style);
      return true;
    };

    if (positionFeedbackButton()) return;

    const observer = new MutationObserver(() => {
      if (positionFeedbackButton()) observer.disconnect();
    });

    observer.observe(document.body, { childList: true });
    return () => observer.disconnect();
  }, []);

  return null;
}

"use client";

import { useEffect } from "react";

export default function FloatingAIChat() {
  useEffect(() => {
    // 1. Check if the script is already there so it never double-loads!
    if (document.getElementById("botpress-script")) return;

    // 2. Inject the official Botpress script
    const script = document.createElement("script");
    script.id = "botpress-script";
    script.src = "https://cdn.botpress.cloud/webchat/v2.2/inject.js";
    script.async = true;
    document.body.appendChild(script);

    // 3. Start the bot ONLY after it finishes downloading
    script.onload = () => {
      if (window.botpress) {
        window.botpress.init({
          botId: "9c45df8f-bcea-4fdd-b5cb-94acb26a1e64",
          clientId: "9c45df8f-bcea-4fdd-b5cb-94acb26a1e64",
          theme: "prism",
          themeColor: "#1e3a8a", // Navy Blue
        });
      }
    };
  }, []);

  return null; // Botpress creates the bubble automatically!
}

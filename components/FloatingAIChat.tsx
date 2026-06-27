"use client";

import { useEffect } from "react";

export default function FloatingAIChat() {
  useEffect(() => {
    // 1. Create the Botpress script
    const script = document.createElement("script");
    script.src = "https://cdn.botpress.cloud/webchat/v2.2/inject.js";
    script.async = true;
    document.body.appendChild(script);

    // 2. Initialize Botpress once the script loads
    script.onload = () => {
      if (window.botpress) {
        window.botpress.init({
          botId: "9c45df8f-bcea-4fdd-b5cb-94acb26a1e64",
          clientId: "9c45df8f-bcea-4fdd-b5cb-94acb26a1e64",
          
          // Theming the native Botpress button!
          theme: "prism",
          themeColor: "#1e3a8a", // Navy Blue
          
          // We remove 'hideWidget' so Botpress uses its own ultra-reliable button
          hideWidget: false, 
        });
      }
    };

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  // We don't need a custom React button anymore, Botpress creates a perfect one automatically!
  return null; 
}

declare global {
  interface Window {
    botpress: any;
  }
}
// chatCheck.ts
'use Client'
import { useEffect, useState } from "react";

export function useChatMessages() {
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch("/api/chat/receive");
        if (res.ok) {
          const data: string[] = await res.json();
          setMessages(data);
        }
      } catch (e) {
        console.error("Error fetching chat messages:", e);
      }
    };

    fetchMessages(); // Sofort beim Mount laden
    const interval = setInterval(fetchMessages, 1000); // Jede Sekunde neu laden

    return () => clearInterval(interval);
  }, []);

  return messages;
}

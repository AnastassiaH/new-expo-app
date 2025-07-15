import { useEffect, useRef, useState } from 'react';

interface Message {
  senderId: string;
  content: string;
  timestamp: string;
}

interface UseWebSocketOptions {
  url: string;
  userToken?: string;
  onMessage?: (msg: Message) => void;
}

export function useWebSocket({ url, userToken, onMessage }: UseWebSocketOptions) {
  const ws = useRef<WebSocket | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!url) return;

    const fullUrl = userToken ? `${url}?token=${userToken}` : url;
    ws.current = new WebSocket(fullUrl);

    ws.current.onopen = () => {
      setConnected(true);
      console.log('WebSocket connected');
    };

    ws.current.onmessage = (event) => {
      const data: Message = JSON.parse(event.data);
      onMessage?.(data);
    };

    ws.current.onerror = (e) => {
      console.error('WebSocket error:', e);
    };

    ws.current.onclose = () => {
      setConnected(false);
      console.log('WebSocket disconnected');
    };

    return () => {
      ws.current?.close();
    };
  }, [url, userToken]);

  const sendMessage = (msg: Omit<Message, 'timestamp'>) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      const messageToSend = JSON.stringify({ ...msg, timestamp: new Date().toISOString() });
      ws.current.send(messageToSend);
    }
  };

  return { sendMessage, connected };
}
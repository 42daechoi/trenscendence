import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';

const SocketContext = createContext();

export function SocketProvider({ children }) {
  const socket = useSocketConnection();

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
}

export function useSocket() {
  return useContext(SocketContext);
}

function useSocketConnection() {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io('localhost:3004');
    setSocket(newSocket);
    
    return () => {
      newSocket.disconnect();
    };
  }, []);

  return socket;
}
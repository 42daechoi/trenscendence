import React, { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";

const SocketContext = createContext();
const GameSocketContext = createContext();
export function GameSocketProvider({ children }) {
  const gameSocket = useGameSocketConnection();
  
  return (
    <GameSocketContext.Provider value={gameSocket}>{children}</GameSocketContext.Provider>
  );
}
export function SocketProvider({ children }) {
  const socket = useSocketConnection();

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
}
export function useGameSocket() {
  return useContext(GameSocketContext);
}
export function useSocket() {
  return useContext(SocketContext);
}

function useGameSocketConnection() {
  const [gameSocket, setGameSocket] = useState(null);

  useEffect(() => {
    const newGameSocket = io('localhost:3001/game', {withCredentials : true});
    setGameSocket(newGameSocket);
    
    return () => {
      newGameSocket.disconnect();
    };
  }, []);
  return gameSocket;
}

function useSocketConnection() {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io("localhost:3001");

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  return socket;
}

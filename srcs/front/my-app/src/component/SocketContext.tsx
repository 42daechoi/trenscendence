import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

interface ProviderProps {
  children: React.ReactNode;
}

const SocketContext = createContext<Socket | null>(null);
const GameSocketContext = createContext<Socket | null>(null);
export const CurPageContext = createContext<{match: string, set: React.Dispatch<React.SetStateAction<string>>}>({match:"", set:()=>{}});

export function CurPageProvider({ children }: ProviderProps) {
  const [curPage,setCurPage] = useState<string>("");
  const value = {match:curPage, set : setCurPage };
  
  return (
    <CurPageContext.Provider value={value} >
      {children}
    </CurPageContext.Provider>
  );
}

export function GameSocketProvider({ children }: ProviderProps) {
  const gameSocket = useGameSocketConnection();

  return (
    <GameSocketContext.Provider value={gameSocket}>
      {children}
    </GameSocketContext.Provider>
  );
}

export function SocketProvider({ children }: ProviderProps) {
  const socket = useSocketConnection();

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
}

export function useCurPage() {
  return useContext(CurPageContext);
}

export function useGameSocket() {
  return useContext(GameSocketContext);
}

export function useSocket() {
  return useContext(SocketContext);
}

// export function setCurPage() {
//   return useContext()
// }



function useGameSocketConnection() {
  const [gameSocket, setGameSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const newGameSocket = io("localhost:3001/game", { withCredentials: true });
    setGameSocket(newGameSocket);

    return () => {
      newGameSocket.disconnect();
    };
  }, []);

  return gameSocket;
}

function useSocketConnection() {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const newSocket = io("localhost:3001/chat", { withCredentials: true });
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  return socket;
}

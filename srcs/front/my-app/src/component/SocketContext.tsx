import React, { createContext, useContext, useEffect, useState } from "react";
import { useCurPage, CurPageContext} from "./CurPageContext";
import { io, Socket } from "socket.io-client";
import { whoami } from "../utils/whoami";
import { getWhoami} from "../utils/ApiRequest"
interface ProviderProps {
  children: React.ReactNode;
}

const SocketContext = createContext<Socket | null>(null);
const GameSocketContext = createContext<Socket | null>(null);

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
  const {match, set} = useCurPage();
  useEffect(() => {
    const newGameSocket = io("localhost:3001/game", { withCredentials: true });
    newGameSocket.on("connectionBlock",()=>{
      console.log("block")
      newGameSocket.disconnect();
      set("block");
    });
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
    
    const whoAmI = async () =>{
      getWhoami().then((resposne) => {
        const data = resposne.data;
        if (data)
        {
          newSocket.emit("bind", data.id);
          console.log("data",data.id);
        }
      }
      ).catch((error)=>{console.log(error)});
    }
    setSocket(newSocket);
    whoAmI();

    // newSocket.on("exit", () => {
    //   console.log("exit!!");
      // while (1) {
      //   alert("Already login user");
      //   navigate()
      // }
      // navigate("/");
    // });
    return () => {
      newSocket.disconnect();
    };
  }, []);

  return socket;
}

/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState, type ReactNode } from "react";
import { io, type Socket } from "socket.io-client";
import { useSelector } from "react-redux";
import { SocketContext } from "./SocketContextValue";
import type { RootState } from "../../redux/store";

export function SocketProvider({ children }: { children: ReactNode }) {
  const token = useSelector((state: RootState) => state.auth.token);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (!token) {
      setSocket(null);
      return;
    }
    const s = io(import.meta.env.VITE_API_URL ?? "http://localhost:5000", {
      auth: { token },
    });
    setSocket(s);
    return () => {
      s.disconnect();
    };
  }, [token]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
}

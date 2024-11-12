import { useEcho } from "../context/EchoContext";
import GameCanvas from "./GameCanvas";
import React from "react";

const LobbyRoom = ({ name }: { name: string }) => {
  const [roomId, setRoomId] = React.useState(null);
  const { setToken } = useEcho();

  React.useEffect(() => {
    const findRoom = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/find-room", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ name }),
        });

        if (!response.ok) {
          throw new Error("Erro ao criar sala");
        }

        const data = await response.json();
        setRoomId(data.room_id);
        setToken(data.token);
      } catch (error) {
        console.error("Erro ao criar sala:", error);
      }
    };

    findRoom();
  }, []);

  return <section>{roomId && <GameCanvas roomId={roomId} />}</section>;
};

export default LobbyRoom;

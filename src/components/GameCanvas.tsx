import { useRef, useEffect } from "react";
import { useEcho } from "../context/EchoContext";
import useGame from "../hooks/useGame";
import Enemy from "../domain/Enemy";

const GameCanvas = ({ roomId }: { roomId: string }) => {
  const { startGame, update, render, getPlayerData } = useGame();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { echo } = useEcho();
  const enemy = new Enemy();

  useEffect(() => {
    if (!roomId || !echo) return;

    echo
      .private(`Game.Room.${roomId}`)
      .listenForWhisper(".update.game", (data: any) => {
        enemy.updateEnemy(data.enemyData);
      });

    const intervalId = setInterval(() => {
      echo.private(`Game.Room.${roomId}`).whisper(".update.game", {
        roomId,
        playerId: 1,
        enemyData: getPlayerData(),
      });
      console.log("whisper", getPlayerData());
    }, 1);

    return () => {
      echo.leave(`Game.Room.${roomId}`);
      clearInterval(intervalId);
    };
  }, [roomId]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (context && enemy) {
      startGame();

      const gameLoop = () => {
        update();
        render(context, enemy);
        requestAnimationFrame(gameLoop);
      };

      gameLoop();

      return () => {};
    }
  }, [roomId, enemy]);

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={600}
      style={{ border: "1px solid black" }}
    />
  );
};

export default GameCanvas;

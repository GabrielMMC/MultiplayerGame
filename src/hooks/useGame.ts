import { useCallback, useState, useEffect, useRef } from "react";
import LootBox from "../components/LootBox";
import Wizard from "../roles/Role";

interface Obstacle {
  x: number;
  y: number;
  width: number;
  height: number;
}

const useGame = () => {
  const lootBox = new LootBox(200, 150);
  const selectedRole = new Wizard();

  const [isRunning, setIsRunning] = useState<boolean>(true);

  const obstacle: Obstacle = {
    x: 300,
    y: 200,
    width: 100,
    height: 100,
  };

  const animationFrameId = useRef<number | null>(null);
  const keysPressed = <Set<string>>new Set();

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    keysPressed.add(event.key);
  }, []);

  const handleKeyUp = useCallback((event: KeyboardEvent) => {
    keysPressed.delete(event.key);
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("click", selectedRole.getWeaponLeftClickEvent);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("click", selectedRole.getWeaponLeftClickEvent);
    };
  }, [handleKeyDown, handleKeyUp]);

  const startGame = useCallback(() => {
    setIsRunning(true);
  }, []);

  const update = () => {
    if (!isRunning) return;
    // const player = player;
    keysPressed.forEach((key) => {
      if (selectedRole.movieSet[key]) {
        selectedRole.movieSet[key](); // Agora acessa a função correspondente de forma segura
      }
    });

    // if (lootBox.checkCollision(player) && !lootBox.isCollected) {
    //   lootBox.startRoleta();
    // }
  };

  // const isCollidingWithObstacle = (proj: Projectile, obstacle: Obstacle) => {
  //   return (
  //     proj.x < obstacle.x + obstacle.width &&
  //     proj.x + proj.size > obstacle.x &&
  //     proj.y < obstacle.y + obstacle.height &&
  //     proj.y + proj.size > obstacle.y
  //   );
  // };

  const render = useCallback(
    (context: CanvasRenderingContext2D) => {
      selectedRole.renderPlayer(context);
      selectedRole.getCurrentWeapon().renderAtack(context);

      context.fillStyle = "grey";
      context.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);

      lootBox.render(context);
    },
    [selectedRole]
  );

  useEffect(() => {
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);

  return { startGame, update, render };
};

export default useGame;

import { useCallback, useState, useEffect, useRef } from "react";
import Wizard from "../domain/roles/wizard/Wizard";
import CommandKeys from "../types/CommandKeys";
import Enemy from "../domain/Enemy";

const useGame = () => {
  const selectedRole = new Wizard();

  const [isRunning, setIsRunning] = useState<boolean>(true);

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

    keysPressed.forEach((key) => {
      const action = selectedRole.movieSet[key as CommandKeys];
      if (action) {
        action();
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
    (context: CanvasRenderingContext2D, enemy: Enemy) => {
      selectedRole.renderPlayer(context);
      enemy.renderEnemy(context);

      selectedRole.getCurrentWeapon().renderAtack(context);

      // context.fillStyle = "grey";
      // context.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);

      // lootBox.render(context);
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

  return {
    startGame,
    update,
    render,
    getPlayerData: () => {
      return { x: selectedRole.xPos, y: selectedRole.yPos };
    },
  };
};

export default useGame;

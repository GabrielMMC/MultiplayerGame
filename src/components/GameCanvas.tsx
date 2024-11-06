// src/components/GameCanvas.tsx
import React, { useRef, useEffect } from 'react';
import useGame from '../hooks/useGame';

const GameCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { startGame, update, render } = useGame();

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');

    if (context) {
      // Iniciar o jogo
      startGame();

      // Loop de atualização e renderização
      const gameLoop = () => {
        update();
        render(context);
        requestAnimationFrame(gameLoop);
      };

      gameLoop();

      // Cleanup
      return () => {
        // cancelAnimationFrame(gameLoop);
      };
    }
  }, [startGame, update, render]);

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={600}
      style={{ border: '1px solid black' }}
    />
  );
};

export default GameCanvas;

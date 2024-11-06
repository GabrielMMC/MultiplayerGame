// src/App.tsx
import React from 'react';
import GameCanvas from './components/GameCanvas';

const App: React.FC = () => {
  return (
    <div className="App">
      <h1>Meu Jogo Multiplayer</h1>
      <GameCanvas />
    </div>
  );
};

export default App;

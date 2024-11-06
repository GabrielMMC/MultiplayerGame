// src/classes/LootBox.ts
interface Player {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
}

class LootBox {
  x: number;
  y: number;
  width: number;
  height: number;
  isCollected: boolean;
  roletaInterval: number | null;
  roletaNumbers: number[]; // Números que serão exibidos na roleta
  currentRoletaIndex: number;

  constructor(x: number, y: number, width = 30, height = 30) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.isCollected = false;
    this.roletaInterval = null;
    this.roletaNumbers = Array.from({ length: 100 }, (_, i) => i + 1); // Array de 1 a 100
    this.currentRoletaIndex = 0;
  }

  // Método que verifica se o jogador colidiu com a LootBox
  checkCollision(player: Player) {
    return (
      player.x < this.x + this.width &&
      player.x + player.width > this.x &&
      player.y < this.y + this.height &&
      player.y + player.height > this.y
    );
  }

  // Método para iniciar a roleta quando o jogador coleta a caixa
  startRoleta() {
    if (this.roletaInterval || this.isCollected) return;

    console.log("Roleta iniciada!"); // Mensagem de início
    this.isCollected = true;

    this.roletaInterval = setInterval(() => {
      // Atualizar o índice da roleta para exibir o próximo número
      this.currentRoletaIndex =
        (this.currentRoletaIndex + 1) % this.roletaNumbers.length;

      // Exibir o número atual no console
      console.log("Número da roleta:", this.roletaNumbers[this.currentRoletaIndex]);
    }, 50); // Troca rápida de números para simular roleta

    // Parar a roleta após 2 segundos e exibir o número final no console
    setTimeout(() => {
      if (this.roletaInterval) clearInterval(this.roletaInterval);
      this.roletaInterval = null;
      const finalNumber = this.roletaNumbers[this.currentRoletaIndex];
      console.log("Número final selecionado:", finalNumber);
    }, 2000);
  }

  // Método para renderizar a LootBox
  render(context: CanvasRenderingContext2D) {
    if (!this.isCollected) {
      context.fillStyle = 'green';
      context.fillRect(this.x, this.y, this.width, this.height);
    }
  }
}

export default LootBox;

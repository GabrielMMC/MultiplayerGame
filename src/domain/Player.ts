import CommandKeys from "../types/CommandKeys";
import PlayerI from "../interfaces/PlayerI";

class Player implements PlayerI {
  xPos = 375;
  yPos = 275;
  width = 50;
  height = 50;
  speed = 5;

  private readonly smoothSteps = 30;
  private readonly smoothStepDelay = 10;

  shiftsUp = () => this.smoothMove(() => (this.yPos -= this.speed * 0.05));
  shiftsDown = () => this.smoothMove(() => (this.yPos += this.speed * 0.05));
  shiftsRight = () => this.smoothMove(() => (this.xPos += this.speed * 0.05));
  shiftsLeft = () => this.smoothMove(() => (this.xPos -= this.speed * 0.05));

  private smoothMove = (updatePosition: () => void) => {
    for (let i = 0; i < this.smoothSteps; i++) {
      setTimeout(() => {
        updatePosition();
      }, i * this.smoothStepDelay);
    }
  };

  commonMovies: Partial<Record<CommandKeys, () => void>> = {
    w: this.shiftsUp,
    s: this.shiftsDown,
    d: this.shiftsRight,
    a: this.shiftsLeft,
    ArrowUp: this.shiftsUp,
    ArrowDown: this.shiftsDown,
    ArrowRight: this.shiftsRight,
    ArrowLeft: this.shiftsLeft,
  };

  renderPlayer = (context: CanvasRenderingContext2D): void => {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);

    context.fillStyle = "blue";
    context.fillRect(this.xPos, this.yPos, this.width, this.height);
  };
}

export default Player;

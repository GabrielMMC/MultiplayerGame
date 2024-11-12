class Enemy {
  xPos = 375;
  yPos = 275;
  width = 50;
  height = 50;

  renderEnemy = (context: CanvasRenderingContext2D): void => {
    context.fillStyle = "green";
    context.fillRect(this.xPos, this.yPos, this.width, this.height);
  };

  updateEnemy = (data: any) => {
    this.xPos = data.x;
    this.yPos = data.y;
  };
}

export default Enemy;

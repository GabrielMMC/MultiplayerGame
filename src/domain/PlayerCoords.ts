class PlayerCoords {
  xCallback: () => number;
  yCallback: () => number;
  width: number;
  height: number;

  constructor(
    xPos: () => number,
    yPos: () => number,
    width: number,
    height: number
  ) {
    this.xCallback = xPos;
    this.yCallback = yPos;
    this.width = width;
    this.height = height;
  }

  getX = (): number => {
    return this.xCallback() + this.width / 2;
  };

  getY = (): number => {
    return this.yCallback() + this.height / 2;
  };
}

export default PlayerCoords;

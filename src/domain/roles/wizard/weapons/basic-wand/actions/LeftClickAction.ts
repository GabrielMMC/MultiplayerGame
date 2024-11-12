import PlayerCoords from "../../../../../PlayerCoords";
import BasicWand from "../BasicWand";
import ZAction from "./ZAction";

export class LeftClickAction {
  lastShotTime: number = 0;
  speed: number = 10;
  size: number = 5;
  weapon: BasicWand;
  zAction: ZAction;

  constructor(weapon: BasicWand) {
    this.weapon = weapon;
    this.zAction = new ZAction(weapon);
  }

  execute(event: MouseEvent, coords: PlayerCoords) {
    const { directionX, directionY } = this.getClickPosition(event, coords);
    if (this.weapon.triggerWithClick.includes("z")) {
      return this.zAction.execute(directionX, directionY, coords);
    }

    const currentTime = Date.now();
    if (currentTime - this.lastShotTime < 500) return;
    if (this.weapon.owner) this.weapon.owner.speed -= 1;

    this.lastShotTime = currentTime;
    const delayBetweenShots = 50;

    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        const newProjectiles = Array.from({ length: 5 }).map(() => ({
          x: coords.getX(),
          y: coords.getY(),
          size: this.size,
          speed: this.speed,
          directionX: directionX,
          directionY: directionY,
        }));

        this.weapon.setProjectiles(newProjectiles);
      }, i * delayBetweenShots);
    }

    if (this.weapon.owner) {
      setTimeout(() => {
        this.weapon.owner.speed += 1;
      }, 300);
    }
  }

  private getClickPosition(event: MouseEvent, coords: PlayerCoords) {
    const { offsetX, offsetY } = event;
    let directionX = offsetX - coords.getX();
    let directionY = offsetY - coords.getY();
    const length = Math.sqrt(directionX ** 2 + directionY ** 2);

    directionX = length === 0 ? 0 : directionX / length;
    directionY = length === 0 ? 0 : directionY / length;

    return { directionX, directionY };
  }
}

export default LeftClickAction;

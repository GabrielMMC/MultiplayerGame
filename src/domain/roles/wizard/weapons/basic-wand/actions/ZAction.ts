import PlayerCoords from "../../../../../PlayerCoords";
import BasicWand from "../BasicWand";

export class ZAction {
  lastActivationTime: number = 0;
  weapon: BasicWand;

  constructor(weapon: BasicWand) {
    this.weapon = weapon;
  }

  execute(directionX: number, directionY: number, coords: PlayerCoords) {
    const currentTime = Date.now();
    if (currentTime - this.lastActivationTime < 1500) return;

    this.lastActivationTime = currentTime;
    this.weapon.triggerWithClick.push("z");

    const delayBetweenShots = 100;
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        const newProjectiles = Array.from({ length: 5 }).map((_, index) => ({
          x: coords.getX(),
          y: coords.getY(),
          size: 30 + index * 2,
          speed: 6,
          directionX: directionX,
          directionY: directionY,
        }));

        this.weapon.setProjectiles(newProjectiles);
      }, i * delayBetweenShots);
    }

    this.weapon.triggerWithClick = [];
  }
}

export default ZAction;

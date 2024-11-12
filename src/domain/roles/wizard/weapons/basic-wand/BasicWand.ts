import Projectile from "../../../../../interfaces/Projectile";
import CommandKeys from "../../../../../types/CommandKeys";
import LeftClickAction from "./actions/LeftClickAction";
import Weapon from "../../../../../interfaces/Weapon";
import PlayerCoords from "../../../../PlayerCoords";
import Wizard from "../../Wizard";

export class BasicWand implements Weapon {
  projectiles: Array<Projectile> = [];
  triggerWithClick: Array<string> = [];
  rarity = 0;
  name = "BasicWand";
  owner: Wizard | null = null;

  setProjectiles = (projectiles: Array<Projectile>): Array<Projectile> =>
    (this.projectiles = [...this.projectiles, ...projectiles]);

  prepareZ = () => {
    this.triggerWithClick.includes("z")
      ? this.triggerWithClick
      : this.triggerWithClick.push("z");
  };

  specialMovies: Partial<Record<CommandKeys, () => void>> = {
    z: this.prepareZ,
    // x: () => this.zAction,
    // c: () => this.cAction,
  };

  renderAtack = (context: CanvasRenderingContext2D): void => {
    context.fillStyle = "red";
    this.projectiles.forEach((proj) => {
      context.fillRect(proj.x, proj.y, proj.size, proj.size);
    });

    this.projectiles = this.projectiles
      .map((proj) => ({
        ...proj,
        x: proj.x + proj.directionX * proj.speed,
        y: proj.y + proj.directionY * proj.speed,
      }))
      .filter(
        (proj) => proj.x >= 0 && proj.x <= 800 && proj.y >= 0 && proj.y <= 600
      );
  };

  private leftClickAction = new LeftClickAction(this);

  leftClickEvent = (event: MouseEvent, coords: PlayerCoords): void => {
    this.leftClickAction.execute(event, coords);
  };

  setOwner(owner: Wizard) {
    this.owner = owner;
  }
}

export default BasicWand;

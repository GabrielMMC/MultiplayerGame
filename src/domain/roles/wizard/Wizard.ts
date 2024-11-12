import BasicWand from "./weapons/basic-wand/BasicWand";
import Role from "../Role";

class Wizard extends Role {
  atack: number = 10;
  health: number = 50;
  speed: number = 3.5;

  constructor() {
    const initialWand = new BasicWand();
    super(initialWand, [new BasicWand()]);

    initialWand.setOwner(this);
  }
}

export default Wizard;

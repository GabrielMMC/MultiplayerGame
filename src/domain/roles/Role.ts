import Weapon from "../../interfaces/Weapon";
import PlayerCoords from "../PlayerCoords";
import Player from "../Player";
import CommandKeys from "../../types/CommandKeys";

abstract class Role extends Player {
  disponibleWeapons: Array<Weapon>;
  currentWeapon: Weapon;
  movieSet: Partial<Record<CommandKeys, () => void>>;

  constructor(firstWeapon: Weapon, disponibleWapons: Array<Weapon>) {
    super();

    this.currentWeapon = firstWeapon;
    this.disponibleWeapons = disponibleWapons;
    this.movieSet = {
      ...this.commonMovies,
      ...this.currentWeapon.specialMovies,
    };
  }

  setDisponibleWeapons = (weapons: Array<Weapon>) => {
    this.disponibleWeapons = weapons;
  };

  getDisponibleWeapons = (): Array<Weapon> => {
    return this.disponibleWeapons;
  };

  setCurrentWeapon = (weapon: Weapon) => {
    this.currentWeapon = weapon;
  };

  getCurrentWeapon = (): Weapon => {
    return this.currentWeapon;
  };

  getWeaponLeftClickEvent = (event: MouseEvent): void => {
    const currentWeapon = this.getCurrentWeapon();
    const playerCoords = new PlayerCoords(
      () => this.xPos,
      () => this.yPos,
      this.width,
      this.height
    );

    return currentWeapon.leftClickEvent(event, playerCoords);
  };
}

export default Role;

import PlayerCoords from "../domain/PlayerCoords";
import CommandKeys from "../types/CommandKeys";

interface Weapon {
  rarity: number;
  name: string;
  leftClickEvent: (event: MouseEvent, playerCoords: PlayerCoords) => void;
  renderAtack: (context: CanvasRenderingContext2D) => void;
  specialMovies: Partial<Record<CommandKeys, () => void>>;
}

export default Weapon;

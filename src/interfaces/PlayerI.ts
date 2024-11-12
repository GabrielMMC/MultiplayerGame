import CommandKeys from "../types/CommandKeys";

interface PlayerI {
  xPos: number;
  yPos: number;
  width: number;
  height: number;
  speed: number;
  commonMovies: Partial<Record<CommandKeys, () => void>>;
}

export default PlayerI;

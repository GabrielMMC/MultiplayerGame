interface PlayerI {
  xPos: number;
  yPos: number;
  width: number;
  height: number;
  speed: number;
  commonMovies: Partial<Record<CommandKeys, () => void>>;
}

interface Weapon {
  rarity: number;
  speed: number;
  name: string;
  leftClickEvent: (event: MouseEvent, playerCoords: PlayerCoords) => void;
  renderAtack: (context: CanvasRenderingContext2D) => void;
  specialMovies: Partial<Record<CommandKeys, () => void>>;
}

interface Projectile {
  x: number;
  y: number;
  size: number;
  speed: number;
  directionX: number;
  directionY: number;
}

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

class BasicWand implements Weapon {
  lastShotTime: number = 0;
  lastZTime: number = 0;
  projectiles: Array<Projectile> = [];
  triggerWithClick: Array<string> = [];
  rarity = 0;
  speed = 10;
  size = 5;
  name = "";

  prepareZ = () => {
    const currentTime = Date.now();
    if (currentTime - this.lastZTime < 1500) return;
    this.lastZTime = currentTime;
    this.triggerWithClick = !this.triggerWithClick.find((item) => item === "z")
      ? ["z", ...this.triggerWithClick]
      : this.triggerWithClick;
  };

  specialMovies: Partial<Record<CommandKeys, () => void>> = {
    z: () => this.prepareZ(),
    x: () => this.zEvent,
    c: () => this.cEvent,
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
    // !isCollidingWithObstacle(proj, obstacle)
  };

  zEvent = (directionX: number, directionY: number, coords: PlayerCoords) => {
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

        this.projectiles = [...this.projectiles, ...newProjectiles];
      }, i * delayBetweenShots);
    }
    this.triggerWithClick = [];
  };

  xEvent = () => {};
  cEvent = () => {};

  leftClickEvent = (event: MouseEvent, coords: PlayerCoords): void => {
    const { directionX, directionY } = this.getClickPosition(event, coords);

    if (this.triggerWithClick.find((item) => item === "z")) {
      return this.zEvent(directionX, directionY, coords);
    }

    const currentTime = Date.now();
    // Verificar se o cooldown entre disparos já passou
    if (currentTime - this.lastShotTime < 500) return;

    // Atualizar o tempo do último disparo
    this.lastShotTime = currentTime;

    // Criar uma sequência de 5 projéteis
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

        this.projectiles = [...this.projectiles, ...newProjectiles];
      }, i * delayBetweenShots);
    }
  };

  getClickPosition = (
    event: MouseEvent,
    coords: PlayerCoords
  ): { directionX: number; directionY: number } => {
    let { offsetX, offsetY } = event;

    let directionX = offsetX - coords.getX();
    let directionY = offsetY - coords.getY();
    const length = Math.sqrt(directionX ** 2 + directionY ** 2);

    directionX = length === 0 ? 0 : directionX / length;
    directionY = length === 0 ? 0 : directionY / length;

    return { directionX, directionY };
  };
}
type CommandKeys =
  | "w"
  | "s"
  | "d"
  | "a"
  | "ArrowUp"
  | "ArrowDown"
  | "ArrowRight"
  | "ArrowLeft"
  | "z"
  | "x"
  | "c";

class Player implements PlayerI {
  xPos = 375;
  yPos = 275;
  width = 50;
  height = 50;
  speed = 5;

  shiftsUp = () => (this.yPos -= this.speed);
  shiftsDown = () => (this.yPos += this.speed);
  shiftsRight = () => (this.xPos += this.speed);
  shiftsLeft = () => (this.xPos -= this.speed);

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

abstract class Role extends Player {
  disponibleWeapons: Array<Weapon>;
  currentWeapon: Weapon;

  constructor(firstWeapon: Weapon, disponibleWapons: Array<Weapon>) {
    super();

    this.currentWeapon = firstWeapon;
    this.disponibleWeapons = disponibleWapons;
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

class Wizard extends Role {
  atack: number = 10;
  health: number = 50;
  speed: number = 3.5;
  xPos: number = 375;
  yPos: number = 275;
  width: number = 50;
  height: number = 50;
  movieSet: Partial<Record<CommandKeys, () => void>> = {
    ...this.commonMovies,
    ...this.getCurrentWeapon().specialMovies,
  };

  constructor() {
    super(new BasicWand(), [new BasicWand()]);
  }
}

export default Wizard;

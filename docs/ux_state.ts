type BangerMap = Record<string, Banger | undefined>;

interface TileManager {
  select: EventListener;
  register: (name: string, banger: Banger) => number;
  unregister: (stub: number) => void;
}

class Manager implements TileManager {
  private selectedTile: string;
  private selectionMap: BangerMap;
  private bangerMap: BangerMap;
  private stub: number;
  private recycledReciepts: number[];

  constructor() {
    this.stub = 0;
    this.recycledReciepts = [];
    this.selectedTile = "";
    this.bangerMap = {};
  }

  select(id: string) {}

  selectCallback = (e: Event) => {
    console.log(e);
    if (e.target instanceof HTMLInputElement) {
      console.log("we got an input event");
      console.log(e.target.value);
    }
  };

  register = (banger: Banger): number => {
    let stub = this.recycledReciepts.pop();
    if (stub !== undefined) {
      this.bangerMap[stub] = banger;
      return stub
    }

    stub = this.stub;
    this.bangerMap[stub] = banger;
    this.stub += 1;

    return stub;
  };

  unregister = (receipt: number) => {
    if (this.bangerMap[receipt] === undefined) {
      return;
    }
    this.bangerMap[receipt] = undefined;
    this.recycledReciepts.push(receipt);
  }
}

const manager = new Manager();
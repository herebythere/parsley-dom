import type { Banger, ChunkBaseArrayDOM } from "../src/parsley-dom.ts";

import { compose, draw } from "../src/parsley-dom.ts";
import { tile, TileRadioParams } from "./tiles.ts";

// create tiles
const colors: TileRadioParams[] = [
  { radioListName: "tilebar", id: "#52ffff", name: "blue" },
  { radioListName: "tilebar", id: "#2bff64", name: "green" },
  { radioListName: "tilebar", id: "#b452ff", name: "purple" },
  { radioListName: "tilebar", id: "#ff52f3", name: "pink" },
];

const tiles: ChunkBaseArrayDOM = [];
for (const colorID in colors) {
  const color = colors[colorID];
  tiles.push(tile(color));
}

// function to maintain selection

interface TileBarState {
  click: EventListener;
}

const tilebar = compose<string, TileBarState>({
  update: ({ params, state }) => {
    return draw`
      <h3>Tiles</h3>
      <div
        *tilebar
        @click="${state.click}">
        <div>
          ${tiles}
        </div>
        <div
          *underbar
          style=""></div>
      </div>
    `;
  },
  connect: ({ banger }) => {
    return {
      click: (e: Event) => {
        const refs = banger.getReferences();
        console.log("A click event traveled up to the tilebar!");
        console.log(refs);
      },
    };
  },
  disconnect: () => {},
});

export { tilebar };

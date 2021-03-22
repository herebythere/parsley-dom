import { compose, draw } from "../src/parsley-dom.ts";

interface TileRadioParams {
  radioListName: string;
  id: string;
  name: string;
}

interface TileRadioState {
  click: (e: Event) => void;
}

const tile = compose<TileRadioParams, TileRadioState>({
  update: ({ params, state }) => {
    return draw`
      <input
        type="radio"
        name="${params.radioListName}"
        id="${params.id}"
        value="${params.id}"
        @click="${state.click}"></input>
        <label
          *tile
          for="${params.id}">
            ${params.id}
        </label>
    `;
  },
  connect: ({ params, banger }) => {
    return {
      click: (e: Event) => {
        const refs = banger.getReferences();
        const tile = refs?.["tile"];

        console.log("tile: ");
        console.log(tile);
      },
    };
  },
  disconnect: (state) => {},
});

export type { TileRadioParams };
export { tile };

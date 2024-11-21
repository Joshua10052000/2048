// @ts-check

class Tile {
  #nodeTile;
  #row;
  #column;
  #value;

  /**
   * @param {{ nodeTile: HTMLDivElement; row: number; column: number; value: number; }} args
   */
  constructor(args) {
    this.#nodeTile = args.nodeTile;
    this.#row = args.row;
    this.#column = args.column;
    this.#value = args.value;

    this.updateNode();
  }

  get nodeTile() {
    return this.#nodeTile;
  }

  get row() {
    return this.#row;
  }

  get column() {
    return this.#column;
  }

  get value() {
    return this.#value;
  }

  set row(row) {
    this.#row = row;
  }

  set column(column) {
    this.#column = column;
  }

  set value(value) {
    this.#value = value;
  }

  updateNode() {
    this.nodeTile.textContent = `${this.value}`;
    this.nodeTile.classList.add("tile");
    this.nodeTile.style.setProperty("--row", `${this.row}`);
    this.nodeTile.style.setProperty("--column", `${this.column}`);
    this.nodeTile.dataset.value = `${this.value}`;
  }

  /**
   * @param { number } row
   * @param { number } column
   */
  updatePosition(row, column) {
    this.row = row;
    this.column = column;
    this.updateNode();
  }

  /**
   * @param {number} value
   */
  updateValue(value) {
    this.value = value;
    this.updateNode();
  }
}

export default Tile;

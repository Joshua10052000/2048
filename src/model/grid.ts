import Tile from "@/model/tile";

interface GridOptions {
  nodeGrid: HTMLElement;
}

class Grid {
  #tiles: Tile[];
  #nodeGrid;

  constructor(args: GridOptions) {
    this.#nodeGrid = args.nodeGrid;
    this.#tiles = [];
  }

  get tiles() {
    return this.#tiles;
  }

  get nodeGrid() {
    return this.#nodeGrid;
  }

  set tiles(tiles) {
    this.#tiles = tiles;
  }

  addTile(tile: Tile) {
    this.tiles = [...this.tiles, tile];
    this.nodeGrid.append(tile.nodeTile);
  }

  generateTile() {
    const nodeTile = document.createElement("div");
    const value = Math.random() < 0.7 ? 2 : 4;

    const { row, column } = this.getRandomPosition();

    const tile = new Tile({ nodeTile, row, column, value });

    this.addTile(tile);
  }

  getRandomPosition(): { row: number; column: number } {
    const row = Math.floor(Math.random() * 4) + 1;
    const column = Math.floor(Math.random() * 4) + 1;

    const foundTile = this.getTile(row, column);

    if (foundTile) {
      return this.getRandomPosition();
    }

    return { row, column };
  }

  getTile(row: number, column: number) {
    const tile = this.tiles.find(
      (tile) => tile.row === row && tile.column === column
    );

    return tile;
  }

  getCanMerge(tile: Tile, nextTile: Tile) {
    const canMerge = tile.value === nextTile.value;

    return canMerge;
  }

  moveRight() {
    const rows = [1, 2, 3, 4];
    let moveOccurred = false;

    rows.forEach((row) => {
      const originalTiles = [...this.tiles];

      const rowTiles = this.tiles
        .filter((tile) => tile.row === row)
        .sort((a, b) => b.column - a.column);

      rowTiles.forEach((rowTile) => {
        let { column } = rowTile;
        let nextColumn = column;
        let merged = false;

        while (nextColumn < 4) {
          nextColumn++;

          const occupiedTile = this.getTile(row, nextColumn);

          if (!occupiedTile) {
            rowTile.updatePosition(row, nextColumn);
            rowTile.updateNode();
            this.tiles = this.tiles.map((tile) =>
              tile.nodeTile === rowTile.nodeTile ? rowTile : tile
            );
            moveOccurred = true;
          } else {
            const canMerge = this.getCanMerge(rowTile, occupiedTile);

            if (canMerge && !merged) {
              occupiedTile.updateValue(occupiedTile.value * 2);
              occupiedTile.updatePosition(row, nextColumn);
              occupiedTile.updateNode();

              rowTile.nodeTile.remove();
              this.tiles = this.tiles.filter(
                (tile) => tile.nodeTile !== rowTile.nodeTile
              );

              merged = true;
              moveOccurred = true;
              break;
            } else {
              rowTile.updatePosition(row, nextColumn - 1);
              rowTile.updateNode();
              this.tiles = this.tiles.map((tile) =>
                tile.nodeTile === rowTile.nodeTile ? rowTile : tile
              );
              break;
            }
          }
        }
      });

      if (this.didMoveOrMergeOccurred(originalTiles, this.tiles)) {
        moveOccurred = true;
      }
    });

    if (moveOccurred) {
      this.generateTile();

      if (this.checkWin()) {
        alert("You win!");
      } else if (!this.canMove()) {
        alert("Game over!");
      }
    }
  }

  moveLeft() {
    const rows = [1, 2, 3, 4];
    let moveOccurred = false;

    rows.forEach((row) => {
      const originalTiles = [...this.tiles];

      const rowTiles = this.tiles
        .filter((tile) => tile.row === row)
        .sort((a, b) => a.column - b.column);

      rowTiles.forEach((rowTile) => {
        let { column } = rowTile;
        let nextColumn = column;
        let merged = false;

        while (nextColumn > 1) {
          nextColumn--;

          const occupiedTile = this.getTile(row, nextColumn);

          if (!occupiedTile) {
            rowTile.updatePosition(row, nextColumn);
            rowTile.updateNode();
            this.tiles = this.tiles.map((tile) =>
              tile.nodeTile === rowTile.nodeTile ? rowTile : tile
            );
            moveOccurred = true;
          } else {
            const canMerge = this.getCanMerge(rowTile, occupiedTile);

            if (canMerge && !merged) {
              occupiedTile.updateValue(occupiedTile.value * 2);
              occupiedTile.updatePosition(row, nextColumn);
              occupiedTile.updateNode();

              rowTile.nodeTile.remove();
              this.tiles = this.tiles.filter(
                (tile) => tile.nodeTile !== rowTile.nodeTile
              );

              merged = true;
              moveOccurred = true;
              break;
            } else {
              rowTile.updatePosition(row, nextColumn + 1);
              rowTile.updateNode();
              this.tiles = this.tiles.map((tile) =>
                tile.nodeTile === rowTile.nodeTile ? rowTile : tile
              );
              break;
            }
          }
        }
      });

      if (this.didMoveOrMergeOccurred(originalTiles, this.tiles)) {
        moveOccurred = true;
      }
    });

    if (moveOccurred) {
      this.generateTile();

      // Check if the player won or lost after the move
      if (this.checkWin()) {
        alert("You win!");
      } else if (!this.canMove()) {
        alert("Game over!");
      }
    }
  }

  moveTop() {
    const columns = [1, 2, 3, 4];
    let moveOccurred = false;

    columns.forEach((column) => {
      const originalTiles = [...this.tiles];

      const columnTiles = this.tiles
        .filter((tile) => tile.column === column)
        .sort((a, b) => a.row - b.row);

      columnTiles.forEach((columnTile) => {
        let { row } = columnTile;
        let nextRow = row;
        let merged = false;

        while (nextRow > 1) {
          nextRow--;

          const occupiedTile = this.getTile(nextRow, column);

          if (!occupiedTile) {
            columnTile.updatePosition(nextRow, column);
            columnTile.updateNode();
            this.tiles = this.tiles.map((tile) =>
              tile.nodeTile === columnTile.nodeTile ? columnTile : tile
            );
            moveOccurred = true;
          } else {
            const canMerge = this.getCanMerge(columnTile, occupiedTile);

            if (canMerge && !merged) {
              occupiedTile.updateValue(occupiedTile.value * 2);
              occupiedTile.updatePosition(nextRow, column);
              occupiedTile.updateNode();

              columnTile.nodeTile.remove();
              this.tiles = this.tiles.filter(
                (tile) => tile.nodeTile !== columnTile.nodeTile
              );

              merged = true;
              moveOccurred = true;
              break;
            } else {
              columnTile.updatePosition(nextRow + 1, column);
              columnTile.updateNode();
              this.tiles = this.tiles.map((tile) =>
                tile.nodeTile === columnTile.nodeTile ? columnTile : tile
              );
              break;
            }
          }
        }
      });

      if (this.didMoveOrMergeOccurred(originalTiles, this.tiles)) {
        moveOccurred = true;
      }
    });

    if (moveOccurred) {
      this.generateTile();

      // Check if the player won or lost after the move
      if (this.checkWin()) {
        alert("You win!");
      } else if (!this.canMove()) {
        alert("Game over!");
      }
    }
  }

  moveBottom() {
    const columns = [1, 2, 3, 4];
    let moveOccurred = false;

    columns.forEach((column) => {
      const originalTiles = [...this.tiles];

      const columnTiles = this.tiles
        .filter((tile) => tile.column === column)
        .sort((a, b) => b.row - a.row);

      columnTiles.forEach((columnTile) => {
        let { row } = columnTile;
        let nextRow = row;
        let merged = false;

        while (nextRow < 4) {
          nextRow++;

          const occupiedTile = this.getTile(nextRow, column);

          if (!occupiedTile) {
            columnTile.updatePosition(nextRow, column);
            columnTile.updateNode();
            this.tiles = this.tiles.map((tile) =>
              tile.nodeTile === columnTile.nodeTile ? columnTile : tile
            );
            moveOccurred = true;
          } else {
            const canMerge = this.getCanMerge(columnTile, occupiedTile);

            if (canMerge && !merged) {
              occupiedTile.updateValue(occupiedTile.value * 2);
              occupiedTile.updatePosition(nextRow, column);
              occupiedTile.updateNode();

              columnTile.nodeTile.remove();
              this.tiles = this.tiles.filter(
                (tile) => tile.nodeTile !== columnTile.nodeTile
              );

              merged = true;
              moveOccurred = true;
              break;
            } else {
              columnTile.updatePosition(nextRow - 1, column);
              columnTile.updateNode();
              this.tiles = this.tiles.map((tile) =>
                tile.nodeTile === columnTile.nodeTile ? columnTile : tile
              );
              break;
            }
          }
        }
      });

      if (this.didMoveOrMergeOccurred(originalTiles, this.tiles)) {
        moveOccurred = true;
      }
    });

    if (moveOccurred) {
      this.generateTile();

      // Check if the player won or lost after the move
      if (this.checkWin()) {
        alert("You win!");
      } else if (!this.canMove()) {
        alert("Game over!");
      }
    }
  }

  didMoveOrMergeOccurred(originalTiles: Tile[], updatedTiles: Tile[]) {
    return (
      originalTiles.length !== updatedTiles.length ||
      !originalTiles.every((tile, index) => {
        return (
          tile.row === updatedTiles[index]?.row &&
          tile.column === updatedTiles[index].column &&
          tile.value === updatedTiles[index].value
        );
      })
    );
  }

  checkWin() {
    return this.tiles.some((tile) => tile.value === 2048);
  }

  canMove() {
    if (this.tiles.length < 16) {
      return true;
    }

    for (let row = 1; row <= 4; row++) {
      for (let col = 1; col <= 3; col++) {
        const tile1 = this.getTile(row, col);
        const tile2 = this.getTile(row, col + 1);
        if (tile1 && tile2 && tile1.value === tile2.value) {
          return true;
        }
      }
    }

    for (let col = 1; col <= 4; col++) {
      for (let row = 1; row <= 3; row++) {
        const tile1 = this.getTile(row, col);
        const tile2 = this.getTile(row + 1, col);
        if (tile1 && tile2 && tile1.value === tile2.value) {
          return true;
        }
      }
    }

    return false;
  }
}

export default Grid;

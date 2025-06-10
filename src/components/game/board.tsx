import { cn } from "@/lib/utils";
import * as React from "react";

const GAME_COLUMNS = 4;
const GAME_ROWS = 4;
const GAME_CELL_WIDTH = 120;
const GAME_CELL_HEIGHT = 120;
const GAME_BOARD_OFFSET = 12;
const GAME_BOARD_WIDTH =
  (GAME_CELL_WIDTH + GAME_BOARD_OFFSET) * GAME_COLUMNS + GAME_BOARD_OFFSET;
const GAME_BOARD_HEIGHT =
  (GAME_CELL_HEIGHT + GAME_BOARD_OFFSET) * GAME_ROWS + GAME_BOARD_OFFSET;

interface Dimension {
  width: number;
  height: number;
}

interface GameCell {
  row: number;
  column: number;
}

interface GameTile extends GameCell {
  id: string;
  value: number;
}

interface GameBoardProps extends React.ComponentProps<"div"> {
  rows?: number;
  columns?: number;
  dimensions?: {
    cell: Dimension;
    board: Dimension;
    offset: number;
  };
}

const tileColors: Record<number, { background: string; text: string }> = {
  2: { background: "#eee4da", text: "#776e65" },
  4: { background: "#ede0c8", text: "#776e65" },
  8: { background: "#f2b179", text: "#f9f6f2" },
  16: { background: "#f59563", text: "#f9f6f2" },
  32: { background: "#f57c5f", text: "#f9f6f2" },
  64: { background: "#f65e3b", text: "#f9f6f2" },
  128: { background: "#edcf72", text: "#f9f6f2" },
  256: { background: "#edcc61", text: "#f9f6f2" },
  512: { background: "#edc850", text: "#f9f6f2" },
  1024: { background: "#edc53f", text: "#f9f6f2" },
  2048: { background: "#edc22e", text: "#f9f6f2" },
};

function GameBoard({
  rows = GAME_ROWS,
  columns = GAME_COLUMNS,
  dimensions = {
    board: { height: GAME_BOARD_HEIGHT, width: GAME_BOARD_WIDTH },
    cell: { height: GAME_CELL_HEIGHT, width: GAME_CELL_WIDTH },
    offset: GAME_BOARD_OFFSET,
  },
  className,
  children,
  ...props
}: GameBoardProps) {
  const [tiles, setTiles] = React.useState<GameTile[]>([]);
  const board = React.useMemo(
    () => ({
      columns,
      rows,
      dimensions,
    }),
    [columns, rows, dimensions],
  );
  const cells = React.useMemo(
    () =>
      Array.from({ length: board.rows * board.columns }, (_, i) => {
        const column = Math.floor(i / board.columns) + 1;
        const row = (i % board.rows) + 1;
        const cell: GameCell = { row, column };

        return cell;
      }),
    [board.rows, board.columns],
  );

  const createRandomTile = (tiles: GameTile[]) => {
    const emptyCells = cells.filter(
      (cell) =>
        !tiles.some(
          (tile) => tile.column === cell.column && tile.row === cell.row,
        ),
    );

    const randomCell =
      emptyCells[Math.floor(Math.random() * emptyCells.length)];
    const randomValue = Math.random() >= 0.5 ? 4 : 2;

    if (!randomCell) {
      return null;
    }

    const randomTile: GameTile = {
      ...randomCell,
      value: randomValue,
      id: crypto.randomUUID(),
    };

    return randomTile;
  };

  type Direction = "left" | "right" | "up" | "down";

  const moveTiles = (
    tiles: GameTile[],
    direction: Direction,
    board: { rows: number; columns: number },
  ) => {
    const updatedTiles: GameTile[] = [];
    const isHorizontal = direction === "left" || direction === "right";
    const sortFn = (a: GameTile, b: GameTile) => {
      if (direction === "left") return a.column - b.column;
      if (direction === "right") return b.column - a.column;
      if (direction === "up") return a.row - b.row;

      return b.row - a.row;
    };

    const groupKey = (tile: GameTile) =>
      isHorizontal ? tile.row : tile.column;
    const positionKey = (group: string) =>
      isHorizontal ? parseInt(group) : parseInt(group);
    const limit = isHorizontal ? board.columns : board.rows;

    const groupedTiles = Object.groupBy(tiles.toSorted(sortFn), groupKey);

    let hasMoved = false;

    for (const [group, groupTiles] of Object.entries(groupedTiles)) {
      let position = direction === "left" || direction === "up" ? 1 : limit;

      if (!groupTiles) {
        continue;
      }

      while (groupTiles.length > 0) {
        const currentTile = groupTiles.shift();
        const nextTile = groupTiles[0];

        if (!currentTile) {
          continue;
        }

        if (nextTile && nextTile.value === currentTile.value) {
          hasMoved = true;
          groupTiles.shift();

          const tile: GameTile = {
            ...currentTile,
            row: isHorizontal ? positionKey(group) : position,
            column: isHorizontal ? position : positionKey(group),
            value: currentTile.value * 2,
          };

          updatedTiles.push(tile);
          position += direction === "left" || direction === "up" ? 1 : -1;
        } else {
          if (
            (isHorizontal && currentTile.column !== position) ||
            (!isHorizontal && currentTile.row !== position)
          ) {
            hasMoved = true;
          }

          const tile: GameTile = {
            ...currentTile,
            row: isHorizontal ? positionKey(group) : position,
            column: isHorizontal ? position : positionKey(group),
          };

          updatedTiles.push(tile);
          position += direction === "left" || direction === "up" ? 1 : -1;
        }
      }
    }

    if (hasMoved) {
      const randomTile = createRandomTile(updatedTiles);
      if (randomTile) {
        updatedTiles.push(randomTile);
      }
    }

    return updatedTiles;
  };

  React.useEffect(() => {
    let initialized = false;
    const abortController = new AbortController();

    if (!initialized) {
      setTiles((tiles) => {
        const randomTile = createRandomTile(tiles);

        if (randomTile) {
          tiles = [...tiles, randomTile];
        }

        return tiles;
      });
      initialized = true;
    }

    window.document.addEventListener(
      "keydown",
      (e) => {
        setTiles((tiles) => {
          if (e.key === "ArrowRight") {
            tiles = moveTiles(tiles, "right", board);
          } else if (e.key === "ArrowLeft") {
            tiles = moveTiles(tiles, "left", board);
          } else if (e.key === "ArrowUp") {
            tiles = moveTiles(tiles, "up", board);
          } else if (e.key === "ArrowDown") {
            tiles = moveTiles(tiles, "down", board);
          }

          return tiles;
        });
      },
      { signal: abortController.signal },
    );

    return () => {
      initialized = false;

      abortController.abort();
    };
  }, []);

  return (
    <div
      className="inline-flex"
      style={
        {
          "--game-board-width": `${board.dimensions.board.width}px`,
          "--game-board-height": `${board.dimensions.board.height}px`,
          "--game-board-offset": `${board.dimensions.offset}px`,
          "--game-cell-width": `${board.dimensions.cell.width}px`,
          "--game-cell-height": `${board.dimensions.cell.height}px`,
        } as React.CSSProperties
      }
    >
      <div
        className={cn(
          "bg-game-board relative h-(--game-board-height) w-(--game-board-width) rounded-[calc(var(--game-board-offset)-4px)]",
          className,
        )}
        {...props}
      >
        {cells.map((cell) => (
          <div
            key={`${cell.row}-${cell.column}`}
            style={
              {
                "--game-cell-x": `${(board.dimensions.cell.width + board.dimensions.offset) * (cell.column - 1) + board.dimensions.offset}px`,
                "--game-cell-y": `${(board.dimensions.cell.height + board.dimensions.offset) * (cell.row - 1) + board.dimensions.offset}px`,
              } as React.CSSProperties
            }
          >
            <div className="bg-game-cell absolute h-(--game-cell-height) w-(--game-cell-width) translate-x-(--game-cell-x) translate-y-(--game-cell-y) rounded-[calc(var(--game-board-offset)-4px)]" />
          </div>
        ))}
        {tiles.map((tile) => (
          <div
            key={tile.id}
            style={
              {
                "--game-tile-x": `${(board.dimensions.cell.width + board.dimensions.offset) * (tile.column - 1) + board.dimensions.offset}px`,
                "--game-tile-y": `${(board.dimensions.cell.width + board.dimensions.offset) * (tile.row - 1) + board.dimensions.offset}px`,
                "--game-tile-background": `${tileColors[tile.value]?.background}`,
                "--game-tile-text": `${tileColors[tile.value]?.text}`,
              } as React.CSSProperties
            }
          >
            <div className="absolute flex h-(--game-cell-height) w-(--game-cell-width) translate-x-(--game-tile-x) translate-y-(--game-tile-y) items-center justify-center rounded-[calc(var(--game-board-offset)-4px)] bg-(--game-tile-background) text-(--game-tile-text) shadow transition-transform">
              <span
                className="font-bold"
                style={{ fontSize: `${board.dimensions.offset * 4 - 4}px` }}
              >
                {tile.value}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export { GameBoard };

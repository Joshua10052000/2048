// @ts-check

import Grid from "./model/grid.js";

const nodeGrid = document.querySelector("article");
if (!nodeGrid) throw new Error("nodeBoard is undefined.");

const grid = new Grid({ nodeGrid });

const rightKeys = ["ArrowRight", "D", "d"];
const leftKeys = ["ArrowLeft", "A", "a"];
const topKeys = ["ArrowUp", "W", "w"];
const bottomKeys = ["ArrowDown", "s", "s"];

grid.generateTile();
grid.generateTile();

document.addEventListener("keydown", (e) => {
  if (["ArrowRight", "ArrowLeft", "ArrowUp", "ArrowDown"].includes(e.key)) {
    e.preventDefault();
  }

  if (rightKeys.includes(e.key)) {
    grid.moveRight();
  } else if (leftKeys.includes(e.key)) {
    grid.moveLeft();
  } else if (topKeys.includes(e.key)) {
    grid.moveTop();
  } else if (bottomKeys.includes(e.key)) {
    grid.moveBottom();
  }
});

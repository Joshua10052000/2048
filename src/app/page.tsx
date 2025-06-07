import { GameBoard } from "@/components/game/board";
import * as React from "react";

function Homepage() {
  return (
    <div className="grid min-h-screen place-items-center">
      <GameBoard />
    </div>
  );
}

export default Homepage;

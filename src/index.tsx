import * as React from "react";
import * as ReactDOM from "react-dom/client";
import Homepage from "@/app/page";
import "@/styles/globals";

const rootNode = document.getElementById("root")!;
const root = ReactDOM.createRoot(rootNode);

root.render(
  <React.StrictMode>
    <Homepage />
  </React.StrictMode>,
);

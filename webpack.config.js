// @ts-check

import HtmlWebpackPlugin from "html-webpack-plugin";
import path from "path";

process.loadEnvFile();

/**
 * @type {import("webpack").Configuration}
 */
const config = {
  // @ts-ignore
  mode: process.env.NODE_ENV,
  entry: path.resolve("./src/index.tsx"),
  output: {
    filename: "main.js",
    path: path.resolve("./build/"),
  },
  module: {
    rules: [
      {
        test: /\.(?:js|mjs|cjs|ts|tsx|jsx)$/,
        use: [{ loader: "babel-loader" }],
      },
      {
        test: /\.css$/i,
        use: [
          { loader: "style-loader" },
          { loader: "css-loader" },
          { loader: "postcss-loader" },
        ],
      },
    ],
  },
  resolve: {
    extensions: [".js", ".ts", ".css", ".tsx", ".jsx"],
    alias: {
      "@": path.resolve("./src/"),
    },
  },
  plugins: [new HtmlWebpackPlugin({ template: path.resolve("./index.html") })],
};

export default config;

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
  entry: path.resolve("./src/index.ts"),
  output: {
    filename: "main.js",
    path: path.resolve("./build/"),
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [{ loader: "ts-loader", options: { transpileOnly: true } }],
      },
      {
        test: /\.(?:js|mjs|cjs)$/,
        use: [{ loader: "babel-loader" }],
      },
    ],
  },
  resolve: {
    extensions: [".js", ".ts"],
    alias: {
      "@": path.resolve("./src/"),
    },
  },
  plugins: [new HtmlWebpackPlugin({ template: path.resolve("./index.html") })],
};

export default config;

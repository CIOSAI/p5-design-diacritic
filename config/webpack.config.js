const path = require("path")
const webpack = require("webpack")
const HtmlWebpackPlugin = require("html-webpack-plugin")

module.exports = {
  entry: "./src/index.ts",
  //entry: "./src/tests.ts",
  output: {
    path: path.resolve(__dirname, "../dist"),
    filename: "bundle.js",
    // clean: true,
  },
  devtool: "inline-source-map",
  resolve: {
    extensions: [".js", ".ts"],
    modules: [path.resolve("./src"), path.resolve("./node_modules")],
  },
  module: {
    rules: [
      { test: /\.ts$/, loader: "ts-loader", exclude: /node_modules/ },
      { test: /\.js$/, loader: "source-map-loader" },
      { test: /\.css$/i, use: ["style-loader", "css-loader"] },
      { test: /\.(png|jpe?g|gif)$/i, use: ["file-loader"] },
      {
        test: /\.(glsl|vs|fs|vert|frag)$/,
        exclude: /node_modules/,
        use: ["raw-loader"],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: ["file-loader"],
        // loader: "file-loader",
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      favicon: false,
      template: "./public/index.html",
      inject: "body",
      publicPath: "./",
      // minify: false,
    }),
  ],
  optimization: {
    minimize: false,
  },
}

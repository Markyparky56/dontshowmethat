module.exports = {
  entry: "./src/dontshowmethat.js",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/
      },
      {
        enforce: "pre",
        test: /\.js$/,
        use: "source-map-loader"
      }
    ]
  },
  resolve: {
    extensions: [".ts", ".js"]
  },
  output: {
    filename: "dontshowmethat.js",
    path: __dirname + "/dist",
    libraryTarget: "var",
    library: "bundle"
  },
  devtool: "source-map"
}
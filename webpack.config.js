var path = require("path");
var CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  target: "web",
  entry: {
    app: "./src/app.ts"
  },
  output: {
    filename: "./[name].js",
    libraryTarget: "amd",
    publicPath: '',
  },
  externals: [
    {
    },
    /^VSS\/.*/, /^TFS\/.*/, /^q$/
  ],
  resolve: {
    extensions: [".js", ".ts", ".tsx", ".js", ".css", ".map", ".png"]
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader"
      },
      {
        test: /\.s?css$/,
        use: ["style-loader", "css-loader", "sass-loader"]
      }
    ]
  },
  mode: "development",
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        { from: "./node_modules/vss-web-extension-sdk/lib/VSS.SDK.min.js", to: "VSS.SDK.min.js" },
        { from: "./src/index.html", to: "./" },
        { from: "./img", to: "img" },
        { from: "./readme.md", to: "readme.md" },
        { from: "./src/style.css", to: "./" },
      ]
    })
  ]
}




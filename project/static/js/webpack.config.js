var webpack = require("webpack");

module.exports = {
  mode: "production",
  context: __dirname,
  entry: "./src/app.js",
  output: {
    path: __dirname,
    filename: "app.min.js"
  },
  plugins: [
    new webpack.ProvidePlugin({
      jQuery: 'jquery',
      $: 'jquery',
      jquery: 'jquery'
    })
  ]
}

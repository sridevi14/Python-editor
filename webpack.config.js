const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
  entry: {
    index: path.resolve(__dirname, './src/index.js')
  },
  output: {
    path: path.resolve(__dirname, './build'),
    filename: '[name].bunde.js'
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "./src/index.html")
    })
  ],
  rules: [
    {
      test: /worker.js$/,
      use: [
        {
          loader: `val-loader`,
        },
      ],
    },
  ],
}
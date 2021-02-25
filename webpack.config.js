const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const ASSET_PATH = process.env.ASSET_PATH || '/'
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const CopyPlugin = require('copy-webpack-plugin')

module.exports = {
  mode: 'production',
  entry: './src/js/index.js',
  output: {
    publicPath: ASSET_PATH,
    path: path.resolve(__dirname, 'docs'),
    filename: '[name].js'
  },
  devServer: {
    contentBase: path.join(__dirname, './'),
    compress: true,
    port: 80,
    host: '127.0.0.5'
  },
  plugins: [
    new HtmlWebpackPlugin({ template: './src/index.html' }),
    new VueLoaderPlugin(),
    new CopyPlugin({
      patterns: [
        { from: path.resolve(__dirname, 'assets'), to: path.resolve(__dirname, 'docs/assets') },
        { from: path.resolve(__dirname, 'atom.xml'), to: path.resolve(__dirname, 'docs/atom.xml') }
      ]
    })
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: '/node_modules/',
        options: {
          presets: ['@babel/preset-env']
        }
      },
      {
        test: /\.css$/,
        loader: 'css-loader'
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.less$/i,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              sourceMap: true
            }
          },
          {
            loader: 'less-loader',
            options: {
              sourceMap: true
            }
          }
        ]
      }
    ]
  }
}

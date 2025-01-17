/* eslint-disable @typescript-eslint/no-var-requires */
const webpack = require('webpack');
const path = require('path');
const autoprefixer = require('autoprefixer');
const flexfixes = require('postcss-flexbugs-fixes');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');

const isDev = process.env.NODE_ENV === 'development';

const getPlugins = () => {
  const plugins = [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      hash: true,
    }),
    new StyleLintPlugin({
      context: path.resolve(__dirname, 'src'),
      files: '**/*.s?(a|c)ss',
    }),
    new webpack.ProvidePlugin({
      Promise: ['es6-promise', 'Promise'],
    }),
  ];
  if (!isDev) {
    plugins.push(new MiniCssExtractPlugin());
  }

  return plugins;
};

module.exports = {
  mode: isDev ? 'development' : 'production',
  devtool: isDev ? 'eval-cheap-module-source-map' : 'source-map',
  target: 'web',
  entry: ['whatwg-fetch', './src/index.tsx'],
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    filename: 'bundle.js',
  },
  devServer: {
    client: {
      overlay: { errors: true, warnings: false }
    },
    historyApiFallback: true, // enables reloads of routed pages
  },
  module: {
    rules: [
      {
        enforce: 'pre', // lint files before they are transformed, config in .eslintrc.json
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
      },
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader', // config in .tsconfig
      },
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        use: [
          isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [autoprefixer(), flexfixes()],
              },
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sassOptions: {
                includePaths: [path.resolve(__dirname, 'src')],
              },
            },
          },
        ],
      },
      {
        test: /\.(png|svg|jpg|gif|woff|woff2|eot|ttf)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        exclude: /node_modules/,
        loader: 'url-loader',
        options: {
          limit: 1024, // will insert a data URI if filesize < 1kb otherwise uses file-loader
          fallback: 'file-loader',
        },
      },
    ],
  },
  plugins: getPlugins(),
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.json', '.scss'],

    modules: [path.resolve(__dirname, 'src'), 'node_modules'],
    alias: {
      'react-dom': '@hot-loader/react-dom',
    },
  },
};

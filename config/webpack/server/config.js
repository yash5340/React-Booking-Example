/* eslint-disable import/no-extraneous-dependencies,
  global-require, @typescript-eslint/no-var-requires */
const webpack = require('webpack');
const path = require('path');
const nodeExternals = require('webpack-node-externals');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const isProductionMode = (process.env.NODE_ENV || 'development') === 'production';
const sourcePath = path.join(__dirname, '../../../src');
const distPath = path.join(__dirname, '../../../server-dist/');

module.exports = {
  mode: isProductionMode ? 'production' : 'development',
  target: 'node',
  node: {
    global: false,
    process: false,
    Buffer: false,
    __filename: false,
    __dirname: false
  },
  context: sourcePath,
  entry: './server/app.ts',
  output: {
    libraryTarget: 'commonjs2',
    auxiliaryComment: 'Exported Koa app and Nodejs server',
    path: distPath,
    filename: 'server.bundle.js'
  },
  // externals: nodeModules,
  externals: [
    nodeExternals({
      whitelist: /roboto|mdi/i
    })
  ], // in order to ignore all modules in node_modules folder
  plugins: [
    new CleanWebpackPlugin(),
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'development',
      SERVER: true,
      API_URL: null
    })
  ],
  devtool: isProductionMode ? 'none' : 'inline-source-map',
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    modules: [path.resolve(__dirname, '../../../node_modules'), sourcePath]
  },
  module: {
    rules: [
      {
        test: /\.html$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'html-loader',
            options: {
              minimize: true
            }
          }
        ]
      },
      {
        enforce: 'pre',
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        include: [sourcePath],
        use: {
          loader: 'eslint-loader',
          options: {
            configFile: 'config/linters/.eslintrc.json',
            failOnError: true
          }
        }
      },
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            plugins: [
              '@babel/plugin-proposal-object-rest-spread',
              '@babel/plugin-syntax-dynamic-import',
              '@babel/plugin-transform-runtime',
              '@babel/plugin-proposal-class-properties'
            ],
            presets: [
              [
                '@babel/preset-env',
                {
                  debug: false,
                  loose: true,
                  modules: false,
                  useBuiltIns: 'usage',
                  corejs: '3'
                }
              ],
              '@babel/preset-react',
              '@babel/preset-typescript'
            ]
          }
        }
      },
      {
        test: /\.s?css$/,
        use: 'null-loader'
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: 'svg-sprite-loader'
          },
          {
            loader: 'svgo-loader',
            options: {
              plugins: [
                { removeTitle: true },
                { convertColors: { shorthex: false } },
                { convertPathData: false }
              ]
            }
          }
        ]
      },
      {
        test: /\.(png|jpg|jpeg|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000
            }
          }
        ]
      },
      {
        test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
        use: 'null-loader'
      }
    ]
  }
};

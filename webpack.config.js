const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { DefinePlugin } = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const merge = require('webpack-merge');
const envDev = require('./env/development.env');
const envProd = require('./env/production.env');

const isProd = process.env.NODE_ENV === 'production';

const optimization = {
  minimize: true,
  minimizer: [
    new TerserPlugin({
      terserOptions: {
        warnings: false,
        compress: {
          comparisons: false,
          pure_funcs: ['console.log', 'console.info'],
        },
        parse: {},
        mangle: true,
        output: {
          comments: false,
          ascii_only: true,
        },
      },
      parallel: true,
      cache: true,
      sourceMap: false,
    }),
  ],
  nodeEnv: 'production',
};


const devConfig = {
  mode: 'development',
  plugins: [
    new DefinePlugin({
      'SDK_ENV': envDev
    })
  ]
};

const prodConfig = {
  mode: 'production',
  performance: {
    hints: 'warning'
  },
  plugins: [
    new DefinePlugin({
      'SDK_ENV': envProd
    })
  ],
  optimization
};

const config = {
  entry: './index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'incognito-sdk.js',
    library: 'incognitoSdk',
    libraryTarget: 'umd'
  },
  target: 'node',
  module: {
    rules: [
      // rules for modules (configure loaders, parser options, etc.)
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.wasm$/,
        use: {
          loader: 'file-loader',
        }
      }
    ]
  },
  externals: {
    window: 'window',
    'incognito-chain-web-js': 'incognito-chain-web-js'
  },
  plugins: [
    new CleanWebpackPlugin(),
  ],
};

module.exports = function() {
  console.log('BUILD MODE:', isProd ? 'PRODUCTION' : 'DEVELOPMENT' );

  const cf = merge(config, isProd ? prodConfig : devConfig);
  
  return cf;
};
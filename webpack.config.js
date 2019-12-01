const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { DefinePlugin } = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const merge = require('webpack-merge');
const path = require('path');
const NodemonPlugin = require('nodemon-webpack-plugin');
const envDev = require('./env/development.env');
const envProd = require('./env/production.env');

// eslint-disable-next-line
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
    }),
    new NodemonPlugin()
  ]
};

const prodConfig = {
  mode: 'production',
  output: {
    filename: 'papp-sdk.min.js'
  },
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
    // eslint-disable-next-line
    path: path.resolve(__dirname, 'dist'),
    filename: 'papp-sdk.js',
    library: 'pappSdk',
    libraryTarget: 'umd',
    libraryExport: ['default'],
    globalObject: 'this'
  },
  target: 'web',
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
    ]
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
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { DefinePlugin } = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const merge = require('webpack-merge');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
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
  devtool: 'source-map',
  devServer: {
    contentBase: path.join(__dirname, 'dist'), // boolean | string | array, static file location
    compress: true, // enable gzip compression
    port: 9000,
    historyApiFallback: true, // true for index.html upon 404, object for multiple paths
    hot: true, // hot module replacement. Depends on HotModuleReplacementPlugin
    https: false, // true for self-signed, object for cert authority
    disableHostCheck: false,
    host: '0.0.0.0',
    proxy: {
      '/api': 'http://192.168.1.5:3000/bet'
    }
  },
  plugins: [
    new DefinePlugin({
      'APP_ENV': envDev
    }),
  ]
};

const prodConfig = {
  mode: 'production',
  performance: {
    hints: 'warning'
  },
  plugins: [
    new DefinePlugin({
      'APP_ENV': envProd
    })
  ],
  optimization
};

const config = {
  entry: './index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[hash:5].js'
  },
  target: 'web',
  module: {
    rules: [
      {
        test: /\.js?$/,
        include: [
          path.resolve(__dirname, 'src')
        ],
        loader: 'babel-loader',
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|jpg|gif)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
            },
          },
        ],
      },
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: 'Roll Dice Game',
      template: 'src/index.html'
    }), 
  ],
};

module.exports = function() {
  console.log('BUILD MODE:', isProd ? 'PRODUCTION' : 'DEVELOPMENT' );

  const cf = merge(config, isProd ? prodConfig : devConfig);
  
  return cf;
};
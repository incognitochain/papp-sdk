require('@babel/register');
require('@babel/polyfill');
const window = require('window');
global.window = global.window || window;
// config-overrides.js see: https://github.com/timarney/react-app-rewired
// https://github.com/arackaf/customize-cra
const {override, addBabelPlugins} = require('customize-cra');

module.exports = {
  webpack: override(...addBabelPlugins(
    ["@babel/plugin-proposal-decorators", { "legacy": true }],
    ["@babel/plugin-proposal-class-properties", { "loose" : true }]
  ), (config) => {
    if (process.env.NODE_ENV === 'development') {
        config.output.publicPath = 'http://127.0.0.1:4005/';
    }
    config.optimization.splitChunks.name = 'vendor';
    return config;
  }),
};
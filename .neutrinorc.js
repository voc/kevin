const path = require('path');
const standardjs = require('@neutrinojs/standardjs');
const react = require('@neutrinojs/react');

module.exports = {
  options: {
    root: __dirname
  },
  use: [
    standardjs(),
    react({
      html: {
        template: path.resolve(__dirname, 'src/index.ejs'),
      },
      style: {
        test: /\.(sa|sc|c)ss$/,
        modulesTest: /\.module\.(sa|sc|c)ss$/,
        loaders: [
          { loader: require.resolve('sass-loader'), useId: 'sass' }
        ]
      }
    }),

    // Enable eslint autofixer
    // Note: leads to hot-reload loops on errors
    (neutrino) => {
      neutrino.config.module.rule('lint').use('eslint').tap(args => {
        args.fix = true
        return args
      })
    },

    // Resolve modules within ./src without relative URL
    (neutrino) => {
      const modules = neutrino.config.resolve.modules
      modules.add(path.resolve(__dirname, 'src'))
      modules.add(path.resolve(__dirname, 'node_modules'))
    }
  ],
};

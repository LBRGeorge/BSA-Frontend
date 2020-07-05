const CracoLessPlugin = require('craco-less');

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: {
              '@primary-color': '#1B36DB',
              '@secondary-color': '#2529bd',
              '@link-color': '#636FCC',
              '@heading-color': '#34394A',
              '@heading-color-secondary': '#ADB5CC',
              '@text-color': '#34394A',
              '@text-color-secondary': '#ADB5CC',
              '@label-color': '#34394A',
            },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
};

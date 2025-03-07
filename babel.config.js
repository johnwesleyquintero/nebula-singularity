module.exports = {
  presets: [
    ['next/babel', {
      'preset-react': {
        runtime: 'automatic',
        importSource: 'react'
      },
      'preset-typescript': {
        isTSX: true,
        allExtensions: true
      }
    }]
  ],
  plugins: [
    ['@babel/plugin-transform-runtime', { regenerator: true }],
    'babel-plugin-transform-typescript-metadata'
  ]
};
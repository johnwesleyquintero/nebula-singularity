export const themeConfig = {
  light: {
    '--background': '250 250 250',
    '--foreground': '15 23 42',
    '--primary': '20 184 166',
    '--primary-foreground': '240 253 250'
  },
  dark: {
    '--background': '15 23 42',
    '--foreground': '248 250 252',
    '--primary': '20 184 166',
    '--primary-foreground': '240 253 250'
  },
  cssVariables: (mode: 'light' | 'dark') => ({
    '--background': mode === 'dark' ? '15 23 42' : '250 250 250',
    '--foreground': mode === 'dark' ? '248 250 252' : '15 23 42',
    '--primary': '20 184 166',
    '--primary-foreground': '240 253 250'
  })
};
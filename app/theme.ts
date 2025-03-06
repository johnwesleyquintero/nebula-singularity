type Theme = 'light' | 'dark'

export const initializeTheme = (): void => {
  if (typeof window !== 'undefined') {
    const theme = (localStorage.getItem('theme') as Theme) || 'light'
    document.documentElement.setAttribute('data-theme', theme)
  }
}

import React from 'react'

import { ITheme, IThemeProvider, light } from '@constants/index'

export const ThemeContext = React.createContext({
  theme: light,
  setTheme: () => {},
})

export const ThemeProvider = ({ children, theme = light, setTheme = () => {} }: IThemeProvider) => {
  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>
}

export default function useTheme(): ITheme {
  const { theme } = React.useContext(ThemeContext)
  return theme
}

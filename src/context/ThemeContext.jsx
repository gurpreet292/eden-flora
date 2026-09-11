import { useEffect, useState } from 'react'
import { ThemeContext } from './theme'

export const ThemeProvider = ({ children }) => {
  const [nightGarden, setNightGarden] = useState(() => localStorage.getItem('eden-flora-theme') === 'night')
  useEffect(() => { localStorage.setItem('eden-flora-theme', nightGarden ? 'night' : 'greenhouse') }, [nightGarden])
  return <ThemeContext.Provider value={{ nightGarden, toggleTheme: () => setNightGarden((value) => !value) }}><div className={nightGarden ? 'night-garden min-h-screen' : 'min-h-screen'}>{children}</div></ThemeContext.Provider>
}


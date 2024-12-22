import {createContext} from 'react'

export const AppContext = createContext(null);

export default function AppProvider ({children}: {children: any}) {
  return (
    <AppContext.Provider value={null}>
      {children}
    </AppContext.Provider>
  )
}
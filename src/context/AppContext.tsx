import * as React from 'react'

type Props = {
  children: React.ReactNode
}

export type IAppContext = {
  // Interface app state context here
}

const AppContext = React.createContext<IAppContext>({
  // App state context here
})

export const initialState = {}

export function AppProvider({ children }: Props) {
  // const [state, dispatch] = React.useReducer(reducer, initialState);

  return <AppContext.Provider value={{}}>{children}</AppContext.Provider>
}

export default AppContext

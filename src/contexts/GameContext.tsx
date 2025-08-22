import { createContext, useContext, useState } from "react"
import { AxiosResponse } from "axios"

interface IGameContext {}

export const GameContext = (): IGameContext => {
  return <div></div>
}

const Context = createContext({} as IGameContext)

export function GameProvider({ children }: { children: any }) {
  return <Context.Provider value={true}>{children}</Context.Provider>
}

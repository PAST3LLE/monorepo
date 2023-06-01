import { atom, useAtom } from 'jotai'

export type AppMessagesState = {
  [key in AppMessagesKeys]: string | undefined
}

export enum AppMessagesKeys {
  UNSUPPORTED_CHAIN = 'UNSUPPORTED_CHAIN'
}

const appMessagesAtom = atom<AppMessagesState>({
  [AppMessagesKeys.UNSUPPORTED_CHAIN]: undefined
})

const readWriteAppMessagesAtom = atom(
  (get) => get(appMessagesAtom),
  (get, set, [key, value]: [string, string | undefined]) => {
    const messagesState = get(appMessagesAtom)

    return set(appMessagesAtom, { ...messagesState, [key]: value })
  }
)
const readKeyAppMessagesAtom = (key: AppMessagesKeys) =>
  atom<AppMessagesState[AppMessagesKeys]>((get) => get(appMessagesAtom)[key])

const readAppMessagesAtom = atom<AppMessagesState>((get) => get(appMessagesAtom))

appMessagesAtom.debugLabel = 'APP MESSAGES ATOM'
export const useAppMessagesAtom = () => useAtom(readWriteAppMessagesAtom)
export const useAppMessagesReadByKeyAtom = (key: AppMessagesKeys) => useAtom(readKeyAppMessagesAtom(key))
export const useAppMessagesReadAtom = () => useAtom(readAppMessagesAtom)

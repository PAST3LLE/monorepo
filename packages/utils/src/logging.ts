// Curried fn base
// Logs a choice from LogType in any env except Production. Else noop
type LogType = keyof Pick<Console, 'debug' | 'log' | 'error' | 'warn' | 'info'>
export const devConsole =
  (type: LogType) =>
  (...args: any[]) => {
    if (process.env.NODE_ENV !== 'production') {
      return console[type](...args)
    }
  }

export const devLog = devConsole('log')
export const devWarn = devConsole('warn')
export const devInfo = devConsole('info')
export const devError = devConsole('error')
export const devDebug = devConsole('debug')

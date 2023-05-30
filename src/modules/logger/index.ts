import {
  LogEvent,
  LoggerHook,
  StringifyObjectsHook,
  createLogger,
} from 'vue-logger-plugin'
import { SwitchMatchError } from '../error'
import { LogSeverity } from './types'

export const getLogMeta = (s: LogSeverity): { weight: number; str: string } => {
  switch (s) {
    case LogSeverity.DEFAULT:
      return { weight: 0, str: 'default' }
    case LogSeverity.DEBUG:
      return { weight: 100, str: 'debug' }
    case LogSeverity.INFO:
      return { weight: 200, str: 'info' }
    case LogSeverity.WARNING:
      return { weight: 400, str: 'warn' }
    case LogSeverity.ERROR:
      return { weight: 500, str: 'error' }
    case LogSeverity.CRITICAL:
      return { weight: 600, str: 'critical' }
    case LogSeverity.EMERGENCY:
      return { weight: 800, str: 'emergency' }

    default:
      throw new SwitchMatchError('getLogMeta', 'LogSeverity', s)
  }
}

export const printLogConsole = (s: LogSeverity, ...optionalParams: any[]) => {
  let level: keyof Console
  switch (s) {
    case LogSeverity.DEFAULT || LogSeverity.DEBUG:
      level = 'debug'
      break
    case LogSeverity.INFO:
      level = 'info'
      break
    case LogSeverity.WARNING:
      level = 'warn'
      break
    case LogSeverity.ERROR || LogSeverity.CRITICAL || LogSeverity.EMERGENCY:
      level = 'error'
      break
    default:
      throw new SwitchMatchError('logPrintConsole', 'LogSeverity', s)
  }
  // eslint-disable-next-line no-console
  console[level](optionalParams)
}

const logger = createLogger({
  enabled: true,
  // consoleEnabled: import.meta.env.MODE !== "production",
  prefixFormat: ({ level, caller }) =>
    caller
      ? `[${level.toUpperCase()}] [${caller?.fileName}:${
          caller?.functionName
        }:${caller?.lineNumber}]`
      : `[${level.toUpperCase()}]`,
  beforeHooks: [StringifyObjectsHook],
  afterHooks: [ServerLogHook],
})

export enum LogSeverity {
  DEFAULT = 'DEFAULT', //  The log entry has no assigned severity level.
  DEBUG = 'DEBUG', //  Debug or trace information.
  INFO = 'INFO', //  Routine information, such as ongoing status or performance.
  //   NOTICE = 'NOTICE', //  Normal but significant events, such as start up, shut down, or a configuration change.
  WARNING = 'WARNING', //  Warning events might cause problems.
  ERROR = 'ERROR', //  Error events are likely to cause problems.
  CRITICAL = 'CRITICAL', //  Critical events cause more severe problems or outages.
  //   ALERT = 'ALERT', //  A person must take an action immediately.
  EMERGENCY = 'EMERGENCY', //  One or more systems are unusable.
}

export interface ILog {
  createdAt?: Date
  uid?: string
  category?: string
  msgs: (string | number)[]
  severity: string
}

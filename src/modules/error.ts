export class AbacusError extends Error {
  constructor(message: string) {
    super(message)
    this.name = this.constructor.name
  }
}

export class RequiredFieldError extends AbacusError {
  constructor(name: string, field: string) {
    super(`${name} required field: ${field}`)
  }
}

export class SwitchMatchError extends AbacusError {
  constructor(funcName: string, typeName: string, inputValue: string) {
    super(`${funcName}_${typeName}_${inputValue}`)
  }
}

window.onerror = function (errorMsg, url, lineNumber, column, errorObj) {
  console.error(`window onerror: ${errorMsg} Script: ${url} Line: ${lineNumber
     } Column: ${column} StackTrace: ${errorObj}`)
}

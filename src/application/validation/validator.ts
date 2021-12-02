export interface Validator {
  validate: () => Validator.Result
}

export namespace Validator {
  export type Result = Error | undefined
}

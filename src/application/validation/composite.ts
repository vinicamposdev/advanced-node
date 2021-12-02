import { Validator } from './validator'

export class ValidationComposite implements Validator {
  constructor (private readonly validators: Validator[] = []) {}

  validate (): Validator.Result {
    for (const validator of this.validators) {
      const error = validator.validate()
      if (error !== undefined) {
        return error
      }
    }
  }
}
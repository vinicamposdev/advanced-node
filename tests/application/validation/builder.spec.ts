import { RequiredStringValidator, ValidationBuilder } from '@/application/validation'

describe('ValidationBuilder', () => {
  it('should return a RequiredStringValidator', async () => {
    const validator = ValidationBuilder
      .of({ value: 'any_value', fieldName: 'any_name' })
      .required()
      .build()

    expect(validator).toEqual([
      new RequiredStringValidator('any_value', 'any_name')
    ])
  })
})

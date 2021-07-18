import { AccessToken } from '@/data/services'

describe('AccessToken', () => {
  it('should create with a value', async () => {
    const sut = new AccessToken('any_value')

    expect(sut).toEqual({ value: 'any_value' })
  })

  it('should exoire in 1.800.000 ms', async () => {
    expect(AccessToken.expirationInMs).toBe(1800000)
  })
})

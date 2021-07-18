import { FacebookAccount } from '@/domain/models'

const fakeFbAccount = {
  name: 'any_fb_name',
  email: 'any_fb_email',
  facebookId: 'any_fb_id'
}
describe('FacebookAccount', () => {
  it('should create with facebook data only', () => {
    const sut = new FacebookAccount(fakeFbAccount)

    expect(sut).toEqual(fakeFbAccount)
  })

  it('should update name if its empty', () => {
    const sut = new FacebookAccount(fakeFbAccount, { id: 'any_id' })

    expect(sut).toEqual({ ...fakeFbAccount, id: 'any_id' })
  })

  it('should not update name if its not empty', () => {
    const fakeAccount = {
      id: 'any_id',
      name: 'any_name'
    }
    const sut = new FacebookAccount(fakeFbAccount, fakeAccount)

    expect(sut).toEqual({ ...fakeFbAccount, ...fakeAccount })
  })
})

import { mock, MockProxy } from 'jest-mock-extended'

import { AuthenticationError } from '@/domain/errors'
import { LoadFacebookUserApi } from '@/data/contracts/apis'
import { FacebookAuthenticationService } from '@/data/services'
import { LoadUserAccountRepository, CreateFacebookAccountRepository } from '@/data/contracts/repositories'

const makeFakeFbAccount = (): CreateFacebookAccountRepository.Params => ({
  name: 'any_fb_name',
  email: 'any_fb_email',
  facebookId: 'any_fb_id'
})

describe('FacebookAuthenticationService', () => {
  let sut: FacebookAuthenticationService
  let facebookApi: MockProxy<LoadFacebookUserApi>
  let userAccountRepo: MockProxy<LoadUserAccountRepository & CreateFacebookAccountRepository>
  const token = 'any_token'
  const email = 'any_fb_email'
  beforeEach(() => {
    facebookApi = mock()
    facebookApi.loadUser.mockResolvedValue(makeFakeFbAccount())
    userAccountRepo = mock()
    sut = new FacebookAuthenticationService(
      facebookApi,
      userAccountRepo
    )
  })
  it('should call LoadFacebookUserApi with correct params', async () => {
    await sut.perform({ token })

    expect(facebookApi.loadUser).toHaveBeenCalledWith({ token })
    expect(facebookApi.loadUser).toHaveBeenCalledTimes(1)
  })

  it('should return AuthenticationError when LoadFacebookUserApi returns undefined', async () => {
    facebookApi.loadUser.mockResolvedValueOnce(undefined)

    const authResult = await sut.perform({ token })

    expect(authResult).toEqual(new AuthenticationError())
  })

  it('should call LoadUserAccountRepository when LoadFacebookUserApi returns data', async () => {
    await sut.perform({ token })

    expect(userAccountRepo.load).toHaveBeenCalledWith({ email })
    expect(userAccountRepo.load).toHaveBeenCalledTimes(1)
  })

  it('should call CreateFacebookAccountRepository when LoadFacebookUserApi returns undefined', async () => {
    userAccountRepo.load.mockResolvedValueOnce(undefined)
    await sut.perform({ token })

    expect(userAccountRepo.createFromFacebook).toHaveBeenCalledWith(makeFakeFbAccount())
    expect(userAccountRepo.createFromFacebook).toHaveBeenCalledTimes(1)
  })
})

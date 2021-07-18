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
  let loadFacebookUserApi: MockProxy<LoadFacebookUserApi>
  let loadUserAccountRepository: MockProxy<LoadUserAccountRepository>
  let createFacebookAccountRepository: MockProxy<CreateFacebookAccountRepository>
  const token = 'any_token'
  const email = 'any_fb_email'
  beforeEach(() => {
    loadFacebookUserApi = mock()
    loadFacebookUserApi.loadUser.mockResolvedValue(makeFakeFbAccount())
    loadUserAccountRepository = mock()
    createFacebookAccountRepository = mock()
    sut = new FacebookAuthenticationService(
      loadFacebookUserApi,
      loadUserAccountRepository,
      createFacebookAccountRepository
    )
  })
  it('should call LoadFacebookUserApi with correct params', async () => {
    await sut.perform({ token })

    expect(loadFacebookUserApi.loadUser).toHaveBeenCalledWith({ token })
    expect(loadFacebookUserApi.loadUser).toHaveBeenCalledTimes(1)
  })

  it('should return AuthenticationError when LoadFacebookUserApi returns undefined', async () => {
    loadFacebookUserApi.loadUser.mockResolvedValueOnce(undefined)

    const authResult = await sut.perform({ token })

    expect(authResult).toEqual(new AuthenticationError())
  })

  it('should call LoadUserAccountRepository when LoadFacebookUserApi returns data', async () => {
    await sut.perform({ token })

    expect(loadUserAccountRepository.load).toHaveBeenCalledWith({ email })
    expect(loadUserAccountRepository.load).toHaveBeenCalledTimes(1)
  })

  it('should call CreateFacebookAccountRepository when LoadFacebookUserApi returns undefined', async () => {
    loadUserAccountRepository.load.mockResolvedValueOnce(undefined)
    await sut.perform({ token })

    expect(createFacebookAccountRepository.createFromFacebook).toHaveBeenCalledWith(makeFakeFbAccount())
    expect(createFacebookAccountRepository.createFromFacebook).toHaveBeenCalledTimes(1)
  })
})

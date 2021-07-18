import { mock, MockProxy } from 'jest-mock-extended'
import { mocked } from 'ts-jest/utils'

import { AuthenticationError } from '@/domain/errors'
import { LoadFacebookUserApi } from '@/data/contracts/apis'
import { AccessToken, FacebookAuthenticationService } from '@/data/services'
import { LoadUserAccountRepository, SaveFacebookAccountRepository } from '@/data/contracts/repositories'
import { FacebookAccount } from '@/domain/models'
import { TokenGenerator } from '@/data/contracts/crypto'

jest.mock('@/domain/models/facebook-account')

const makeFakeFbAccount = (): SaveFacebookAccountRepository.Params => ({
  name: 'any_fb_name',
  email: 'any_fb_email',
  facebookId: 'any_fb_id'
})

describe('FacebookAuthenticationService', () => {
  let sut: FacebookAuthenticationService
  let facebookApi: MockProxy<LoadFacebookUserApi>
  let crypto: MockProxy<TokenGenerator>
  let userAccountRepo: MockProxy<LoadUserAccountRepository & SaveFacebookAccountRepository>
  const token = 'any_token'
  const email = 'any_fb_email'
  beforeEach(() => {
    facebookApi = mock()
    facebookApi.loadUser.mockResolvedValue(makeFakeFbAccount())
    userAccountRepo = mock()
    userAccountRepo.load.mockResolvedValue(undefined)
    userAccountRepo.saveWithFacebook.mockResolvedValue({ id: 'any_account_id' })
    crypto = mock()
    sut = new FacebookAuthenticationService(
      facebookApi,
      userAccountRepo,
      crypto
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

  it('should call SaveFacebookAccountRepository with FacebookAccount', async () => {
    const mockedContructor = { any: 'any' }
    const FacebookAccountStub = jest.fn().mockImplementation(() => (mockedContructor))
    mocked(FacebookAccount).mockImplementation(FacebookAccountStub)

    await sut.perform({ token })

    expect(userAccountRepo.saveWithFacebook).toHaveBeenCalledWith(mockedContructor)
    expect(userAccountRepo.saveWithFacebook).toHaveBeenCalledTimes(1)
  })

  it('should call TokenGenerator with correct params', async () => {
    await sut.perform({ token })

    expect(crypto.generateToken).toHaveBeenCalledWith({
      key: 'any_account_id',
      expirationInMs: AccessToken.expirationInMs
    })
    expect(crypto.generateToken).toHaveBeenCalledTimes(1)
  })
})

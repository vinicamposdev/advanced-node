import { AuthenticationError } from '@/domain/errors'
import { FacebookAuthentication } from '@/domain/features'
import { LoadFacebookUserApi } from '@/main/data/contracts/apis'

export class FacebookAuthenticationService {
  constructor (
    private readonly loadFacebookUserApiSpy: LoadFacebookUserApi
  ) {}

  async perform (params: FacebookAuthentication.Params): Promise<AuthenticationError> {
    await this.loadFacebookUserApiSpy.loadUser({ token: params.token })
    return new AuthenticationError()
  }
}

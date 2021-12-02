import { FacebookAuthentication } from '@/domain/features'
import { badRequest, HttpResponse, ok, serverError, unauthorized } from '@/application/helpers'
import { AccessToken } from '@/domain/models'
import { RequiredFieldError } from '../errors'

export class FacebookLoginController {
  constructor (private readonly facebookLoginService: FacebookAuthentication) {}
  async handle ({ token }: any): Promise<HttpResponse> {
    try {
      if (token === '' || token === undefined || token === null) {
        return badRequest(new RequiredFieldError('token'))
      }
      const accessToken = await this.facebookLoginService.perform({ token })
      if (accessToken instanceof AccessToken) {
        return ok({ accessToken: accessToken.value })
      }
      return unauthorized()
    } catch (error) {
      return serverError(error)
    }
  }
}

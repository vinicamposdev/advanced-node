import { FacebookAuthentication } from '@/domain/features'
import { badRequest, HttpResponse, ok, serverError, unauthorized } from '@/application/helpers'
import { AccessToken } from '@/domain/models'
import { RequiredFieldError } from '../errors'

type HttpRequest = {
  token: string
}

type Model = Error | {
  accessToken: string
}

export class FacebookLoginController {
  constructor (private readonly facebookLoginService: FacebookAuthentication) {}
  async handle ({ token }: HttpRequest): Promise<HttpResponse<Model>> {
    try {
      const error = this.validate({ token })
      if (error !== undefined) {
        return badRequest(error)
      }
      const accessToken = await this.facebookLoginService.perform({ token: token })
      if (accessToken instanceof AccessToken) {
        return ok({ accessToken: accessToken.value })
      }
      return unauthorized()
    } catch (error) {
      return serverError(error)
    }
  }

  private validate ({ token }: HttpRequest): Error | undefined {
    if (token === '' || token === undefined || token === null) {
      return new RequiredFieldError('token')
    }
  }
}

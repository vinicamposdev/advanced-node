import { FacebookAuthentication } from '@/domain/features'
import { HttpResponse, ok, unauthorized } from '@/application/helpers'
import { AccessToken } from '@/domain/models'
import { ValidationBuilder as Builder, Validator } from '@/application/validation'
import { Controller } from './controller'

type HttpRequest = {
  token: string
}

type Model = Error | {
  accessToken: string
}

export class FacebookLoginController extends Controller {
  constructor (private readonly facebookLoginService: FacebookAuthentication) {
    super()
  }

  async perform ({ token }: HttpRequest): Promise<HttpResponse<Model>> {
    const accessToken = await this.facebookLoginService.perform({ token })
    return accessToken instanceof AccessToken
      ? ok({ accessToken: accessToken.value })
      : unauthorized()
  }

  override buildValidators ({ token }: HttpRequest): Validator[] {
    return [
      ...Builder.of({ value: token, fieldName: 'token' }).required().build()
    ]
  }
}

import { FacebookAuthentication } from '@/domain/features'
import { badRequest, HttpResponse } from '@/application/helpers'
import { AccessToken } from '@/domain/models'
import { RequiredFieldError, ServerError } from '../errors'

export class FacebookLoginController {
  constructor (private readonly facebookLoginService: FacebookAuthentication) {}
  async handle ({ token }: any): Promise<HttpResponse> {
    try {
      if (token === '' || token === undefined || token === null) {
        return badRequest(new RequiredFieldError('token'))
      }
      const result = await this.facebookLoginService.perform({ token })
      if (result instanceof AccessToken) {
        return {
          statusCode: 200,
          data: {
            accessToken: result.value
          }
        }
      }
      return {
        statusCode: 401,
        data: result
      }
    } catch (error) {
      return {
        statusCode: 500,
        data: new ServerError(error instanceof Error ? error : undefined)
      }
    }
  }
}
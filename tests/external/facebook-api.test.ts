import { AxiosHttpClient, FacebookApi } from '@/infra/apis'
import { env } from '@/main/config/env'

describe('Facebook Api Integration Test', () => {
  let axiosClient: AxiosHttpClient
  let sut: FacebookApi
  beforeEach(() => {
    axiosClient = new AxiosHttpClient()
    sut = new FacebookApi(
      axiosClient,
      env.facebookApi.clientId,
      env.facebookApi.clientSecret
    )
  })

  it('should return a Facebook User if token is valid', async () => {
    // this access token is obtained from https://developers.facebook.com/apps/{AppId}/roles/test-users/
    // then go on options of the user test and click in get access token from user
    // this will be valid for 3 months from 12/03/2021
    const fbUser = await sut.loadUser({ token: 'EAAGuZCg1F6sABAMU5RbiyTNukOTwnuqzRsXtMvNHeldRboLQ7IAhCbim00ww5t8takFHLc7ufyRQaYReZCdLtMk5LC12j1NI0uLXNTHIVKAscnClPYL962YvMnelr88xIwcZB4mpAH4rbEH4wSjhbh0i4bImYXZAZC3Ba8WFxQcxmTUPeEEQPkqhDkkBdNSjIcS45YM77ctaCGAhUHmZBT' })

    expect(fbUser).toEqual({
      facebookId: '112062554645830',
      email: 'beta_qphalmj_tester@tfbnw.net',
      name: 'Beta Tester'
    })
  })

  it('should return undefined if token is invalid', async () => {
    const fbUser = await sut.loadUser({ token: 'invalid_token' })

    expect(fbUser).toBeUndefined()
  })
})

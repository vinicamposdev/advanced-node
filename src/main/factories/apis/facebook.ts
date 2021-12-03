import { FacebookApi } from '@/infra/apis'
import { env } from '@/main/config/env'
import { makeAxiosClient } from '../htpp/axios-client'

export const makeFacebookApi = (): FacebookApi => {
  return new FacebookApi(makeAxiosClient(), env.facebookApi.clientId, env.facebookApi.clientSecret)
}

import { Router } from 'express'
import { makeFacebookLoginController } from '@/main/factories/controllers'
import { adaptExpressRoute } from '@/infra/http'

export default (router: Router): void => {
  router.post('/api/login/facebook', adaptExpressRoute(makeFacebookLoginController()))
}

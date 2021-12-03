
import { Controller } from '@/application/controllers'

import { Request, Response } from 'express'

export class ExpressRouter {
  constructor (private readonly controller: Controller) {}

  async adapt (req: Request, res: Response): Promise<void> {
    const httpResponse = await this.controller.handle({ ...req.body })
    res.status(httpResponse.statusCode).json(
      httpResponse.statusCode === 200 ? httpResponse.data : { error: httpResponse.data.message }
    )
  }
}

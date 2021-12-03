import './config/module-alias'

import 'reflect-metadata'
import { env } from './config/env'
import { app } from '@/main/config/app'

app.listen(env.port, () => {
  console.log(`Express server started at ${env.port}`)
})

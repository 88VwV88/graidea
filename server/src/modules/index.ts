import { Router } from 'express'
import { UserRouter } from './user/routes'

interface IModuleRoutesMapping {
  prefix: string
  router: Router
}

const MODULE_ROUTES_MAPPINGS: IModuleRoutesMapping[] = [
  {
    prefix: '/users',
    router: UserRouter,
  },
]

export default MODULE_ROUTES_MAPPINGS



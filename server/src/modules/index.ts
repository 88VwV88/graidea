import { Router } from 'express'
import { UserRouter } from './user/routes'
import { TeacherRouter } from './teacher/routes'

interface IModuleRoutesMapping {
  prefix: string
  router: Router
}

const MODULE_ROUTES_MAPPINGS: IModuleRoutesMapping[] = [
  {
    prefix: '/users',
    router: UserRouter,
  },
  {
    prefix: '/teachers',
    router: TeacherRouter,
  },
]

export default MODULE_ROUTES_MAPPINGS



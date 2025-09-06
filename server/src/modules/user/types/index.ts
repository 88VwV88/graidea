export const Role = ['admin','student','teacher'] as const

export type RoleType = (typeof Role)[number]

export interface IUserResponse {
  _id: string
  name: string
  email: string
  phone?: string
  roles: RoleType[]
  createdAt: Date
  updatedAt: Date
}

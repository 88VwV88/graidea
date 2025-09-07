import { ICourse } from '../models/course.model'
import { ICourseMeta, IWeek, ISubTopic, IAssignment } from '../models/course-meta.model'

export { ICourse, ICourseMeta, IWeek, ISubTopic, IAssignment }

// Course types
export type CourseCreateInput = Omit<ICourse, '_id' | 'createdAt' | 'updatedAt'>
export type CourseUpdateInput = Partial<Omit<ICourse, '_id' | 'createdAt' | 'updatedAt'>>

// Course Meta types
export type CourseMetaCreateInput = Omit<ICourseMeta, '_id' | 'createdAt' | 'updatedAt'>
export type CourseMetaUpdateInput = Partial<Omit<ICourseMeta, '_id' | 'createdAt' | 'updatedAt'>>

// Week types
export type WeekCreateInput = Omit<IWeek, '_id' | 'createdAt' | 'updatedAt'>
export type WeekUpdateInput = Partial<Omit<IWeek, '_id' | 'createdAt' | 'updatedAt'>>

// SubTopic types
export type SubTopicCreateInput = Omit<ISubTopic, '_id' | 'createdAt' | 'updatedAt'>
export type SubTopicUpdateInput = Partial<Omit<ISubTopic, '_id' | 'createdAt' | 'updatedAt'>>

// Assignment types
export type AssignmentCreateInput = Omit<IAssignment, '_id' | 'createdAt' | 'updatedAt'>
export type AssignmentUpdateInput = Partial<Omit<IAssignment, '_id' | 'createdAt' | 'updatedAt'>>

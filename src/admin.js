import AdminJS from 'adminjs'
import AdminJSExpress from '@adminjs/express'
import { Database, Resource } from '@adminjs/mongoose'
import mongoose from 'mongoose'

import { Good } from './models/good.js'
import Category from './models/сategories.js'
import Order from './models/order.js'
import { User } from './models/user.js'
import { Feedback } from './models/feedback.js'
import { Subscription } from './models/subscription.js'

AdminJS.registerAdapter({ Database, Resource })

// 🔧 Кастомні дії для безпечного видалення
const safeActions = {
  delete: { isVisible: false, isAccessible: false },
  bulkDelete: { isVisible: false, isAccessible: false },

  safeDelete: {
    actionType: 'record',
    icon: 'Trash',
    label: 'Видалити (safe)',
    guard: 'Ви точно хочете видалити цей запис?',
    component: false,
    handler: async (request, response, context) => {
      const { record, resource } = context
      if (record) {
        await resource.MongooseModel.deleteOne({ _id: record.params._id })
      }
      return {
        record: record?.toJSON(),
        notice: { message: 'Запис успішно видалено', type: 'success' },
      }
    },
  },

  safeBulkDelete: {
    actionType: 'bulk',
    icon: 'Trash',
    label: 'Видалити вибрані (safe)',
    guard: 'Ви точно хочете видалити ці записи?',
    component: false,
    handler: async (request, response, context) => {
      const { records, resource } = context
      if (records?.length) {
        await Promise.all(records.map(r => resource.MongooseModel.deleteOne({ _id: r.params._id })))
      }
      return {
        records: records.map(r => r.toJSON()),
        notice: { message: 'Вибрані записи успішно видалено', type: 'success' },
      }
    },
  },
}

// 🔧 Обгортка для ресурсу
const withSafeDelete = (model, label) => ({
  resource: model,
  options: {
    navigation: label,
    actions: {
      list: { isVisible: true },
      show: { isVisible: true },
      new: { isVisible: true },
      edit: { isVisible: true },
      ...safeActions,
    },
  },
})

// ⚡ Конфігурація AdminJS
const adminJs = new AdminJS({
  resources: [
    withSafeDelete(Order, 'Замовлення'),
    withSafeDelete(Good, 'Товари'),
    withSafeDelete(Category, 'Категорії'),
    withSafeDelete(User, 'Користувачі'),
    withSafeDelete(Feedback, 'Відгуки'),
    withSafeDelete(Subscription, 'Підписки'),
  ],
  rootPath: '/admin',
  branding: {
    companyName: 'Clothica Admin',
    softwareBrothers: false,
  },
})

const router = AdminJSExpress.buildAuthenticatedRouter(adminJs, {
  authenticate: async (email, password) => {
    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      return { email }
    }
    return null
  },
  cookieName: 'adminjs',
  cookiePassword: process.env.ADMIN_COOKIE_SECRET || 'supersecret',
})

export { adminJs, router }

import axios from 'axios'
import { MyContext } from '../types'

export const start = async (ctx: MyContext) => {
  if (!ctx.from) {
    return ctx.reply('User info is not available')
  }

  const { id, first_name, username } = ctx.from

  try {
    const response = await axios.post('http://localhost:5050/api/users', {
      telegramId: id, 
      firstName: first_name, 
      username: username,
    })

    const user = response.data
    const isNewUser = response.status === 201

    ctx.session.step = 'await_inn'

    if (!isNewUser) {
      return ctx.reply(`Здравствуйте ${user.firstName}! Вы уже зарегистрированы. \nВведи ИНН предприятия (например 302115789), чтобы получить отчёт.`)
    }

    return ctx.reply(
      `Здравствуйте, ${user.firstName}! Вы успешно зарегистрированы!\n` +
      `Введи ИНН предприятия (например 302115789), чтобы получить отчёт.`
    )
  } catch (err) {
    console.error('Ошибка при регистрации пользователя', err)
    ctx.reply('Произошла ошибка, попробуйте позже')
  }
} 
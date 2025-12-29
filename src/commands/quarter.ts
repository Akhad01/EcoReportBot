import { CallbackQueryContext } from 'grammy'
import { MyContext } from '../types'
import { User } from '../models/User'
import { payKeyboard } from '../utils/keyboards'

export const quarter = async (ctx: CallbackQueryContext<MyContext>) => {
  ctx.answerCallbackQuery()
  const quarter = Number(ctx.match[0].split('_')[1])
    
  ctx.session.quarter = quarter
  const { inn, year } = ctx.session
  
  if (!inn || !year) {
    return ctx.callbackQuery.message?.editText('Ошибка состояния. Пожалуйста, повторите /start')
  }
  
  // const report = await findReadyReport(inn, year, quarter)

  // if (!report) {
  //   return ctx.callbackQuery.message?.editText(`Отчет за ${year} Q${quarter} пока не готов. Свяжитесь с администратором.`)
  // }

  //   return ctx.callbakQuery.message?.editText(`Отчет омечен готовым, но PDF не найден. Обратитесь к администратору.`)
  // }

  const telegramUser = await User.findOne({ telegramId: ctx.from!.id })

  if (!telegramUser) {
    return ctx.reply('Пользователь не зарегистрирован. Наберите /start')
  }

  ctx.callbackQuery.message?.editText(`Отчет наден: ... \nНажмите Оплатить чтобы получить отчет`, {
    reply_markup: payKeyboard()
  })
}
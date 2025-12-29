import { CallbackQueryContext } from 'grammy'
import { MyContext } from '../types'
import { quartersKeyboard } from '../utils/keyboards'

export const year = (ctx: CallbackQueryContext<MyContext>) => {
  ctx.answerCallbackQuery()
  const year = Number(ctx.match[0].split('_')[1])
  ctx.session.year = year
  ctx.session.step = 'await_quarter'
  ctx.callbackQuery.message?.editText(`Выбран год ${year}. Теперь выберите квартал:`, { reply_markup: quartersKeyboard() })
}
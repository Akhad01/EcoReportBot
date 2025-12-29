import { MyContext } from '../types'
import { yearsKeyboard } from '../utils/keyboards'

export const messageHandler = async (ctx: MyContext) => {
  const text = ctx.message?.text?.trim()

  if (!text) {
    return;
  }

  if (ctx.session.step === 'await_inn') {
    const inn = parseInt(text)
    // const company = await Company.findOne({ inn })

    // if (!company) {
    //   await ctx.reply(`Компания не найдено. Проверьте ИНН или обратитесь к администратору. ${inn}`)
    //   return
    // }

    ctx.session.inn = inn
    ctx.session.step = 'await_year'

    const now = new Date()
    const currentYear = now.getFullYear()
    const years = [currentYear, currentYear - 1, currentYear - 2]

    return await ctx.reply(`Найдена компания:\nВыберите год:`, {
      reply_markup: yearsKeyboard(years)
    })
  }

  return await ctx.reply('Чтобы начать, отправьте /start')
}
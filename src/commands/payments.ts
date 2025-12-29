import { CallbackQueryContext, InputFile } from 'grammy'
import { MyContext } from '../types'
import { User } from '../models/User'
import path from 'path'

export const payments = (ctx: CallbackQueryContext<MyContext>) => {
  ctx.answerCallbackQuery()
  try {
    const chatId = ctx.chat?.id
    if (!chatId) {
      throw new Error('Chat ID is not defined')
    }

    const providerInvoiceData = {
      receipt: {
        items: [
          {
            description: 'Это продукт',
            quantity: 1,
            amount: {
              value: `800000.00`,
              currency: 'UZS'
            },
            vat_code: 1,
          }
        ]
      }
    }

    ctx.api.sendInvoice(chatId, 'product name', 'product description test text', 'ID_1234567', 'UZS', [{
      label: 'Сум',
      amount: 800000 * 100
    }], {
      provider_token: process.env.PAYMENT_TOKEN,
      need_email: true,
      send_email_to_provider: true,
      provider_data: JSON.stringify(providerInvoiceData)
    })

  } catch (error) {
    console.error('Error in payment')
    ctx.reply('Произошла ошибка, поддержка @support_123_bot')
  }
}



export const telegramSuccessPaymentHandler = async (ctx: MyContext) => {
  if (!ctx.message?.successful_payment || !ctx.from?.id) {
    return ctx.reply('Что-то пошло не так')
  }

  // const { invoice_payload, total_amount } = ctx.message?.successful_payment

  // const productId = parseInt(invoice_payload)

  // const price = total_amount / 100

  try {
    const user = await User.findOne({
      telegramId: ctx.from?.id
    })

    if (!user) {
      throw new Error(`${ctx.from.id}: User not found`)
    }

    ctx.reply('Оплата прошла успешно спасибо! Ваш отчет формируется и будет отправлен ниже.')

    const filePath = path.join(process.cwd(), 'src/static', 'report_123.pdf')

    ctx.replyWithDocument(new InputFile(filePath), {
      caption: `Ваш отчет за год, кватал (ИНН)`
    })
  } catch (error) {
    console.error('Error in payment')
    ctx.reply('Произошла ошибка, поддержка @support_123_bot')
  }
}
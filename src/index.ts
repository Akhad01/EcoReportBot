import 'dotenv/config';
import { Bot, GrammyError, HttpError, session } from 'grammy';
import mongoose from 'mongoose'
import { hydrate } from '@grammyjs/hydrate';
import { MyContext } from './types';
import { messageHandler, payments, quarter, start, telegramSuccessPaymentHandler, year } from './commands';

const BOT_API_KEY = process.env.BOT_TOKEN

if (!BOT_API_KEY) {
  throw new Error('BOT_API_KEY is not defined')
}

const bot = new Bot<MyContext>(BOT_API_KEY);

bot.on('pre_checkout_query', (ctx) => {
  ctx.answerPreCheckoutQuery(true)
})

bot.use(hydrate())
bot.use(session({ initial: () => ({}) }))

bot.on(':successful_payment', telegramSuccessPaymentHandler)

// Ответ на команду /start
bot.command('start', start);

bot.on('message:text', messageHandler)

bot.callbackQuery(/year_\d+/, year)

bot.callbackQuery(/quarter_[1-4]/, quarter)

bot.callbackQuery('cancel', (ctx) => {
  ctx.answerCallbackQuery()
  ctx.session = {}
  ctx.callbackQuery.message?.editText('Операция отменена. /start чтобы начать заново.')
})

bot.callbackQuery('buyProduct', payments)

// Обработка ошибок согласно документации
bot.catch((err) => {
  const ctx = err.ctx;
  console.error(`Error while handling update ${ctx.update.update_id}:`);
  const e = err.error;

  if (e instanceof GrammyError) {
    console.error('Error in request:', e.description);
  } else if (e instanceof HttpError) {
    console.error('Could not contact Telegram:', e);
  } else {
    console.error('Unknown error:', e);
  }
});

// Функция запуска бота
async function startBot() {
  const MONGODB_URI = process.env.MONGODB_URI

  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is not defined")
  }

  try {
    await mongoose.connect(MONGODB_URI)
    bot.start();
    console.log('MongoDb connected & bot started');
  } catch (error) {
    console.error('Error in startBot:', error);
  }
}

startBot();
import { InlineKeyboard } from 'grammy'

export const yearsKeyboard = (years: number[]) => {
  const kb = new InlineKeyboard()
  years.forEach(y => kb.text(String(y), `year_${y}`).row())
  return kb
}

export const quartersKeyboard = () => {
  const kb = new InlineKeyboard();
  [1, 2, 3, 4].forEach(q => kb.text(`Q${q}`, `quarter_${q}`).row());
  return kb;
}

export const payKeyboard = () => {
  const kb = new InlineKeyboard().text('Оплатить', 'buyProduct').row().text('Отменить', 'cancel')
  return kb
}


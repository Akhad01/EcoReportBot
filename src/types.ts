import { Context, SessionFlavor } from 'grammy';
import { HydrateFlavor } from '@grammyjs/hydrate';

type MySession = {
  step?: 'await_inn' | 'await_year' | "await_quarter" | null;
  inn?: number;
  year?: number;
  quarter?: number;
}

export type MyContext = HydrateFlavor<Context> & SessionFlavor<MySession>
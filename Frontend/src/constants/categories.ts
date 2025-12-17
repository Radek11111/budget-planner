import {
  Home,
  CreditCard,
  Utensils,
  Bus,
  Tv,
  HeartPulse,
  ShoppingCart,
  Gamepad2,
  Circle,
} from 'lucide-vue-next'

export const earningCategories = [
  'Wynagrodzenie',
  'Własna działalność',
  'Inwestycje',
  'Prezenty',
  'Inne',
] as const

export const expenseCategories = [
  'Mieszkanie',
  'Rachunki',
  'Kredyty',
  'Żywność',
  'Transport',
  'Media',
  'Rozrywka',
  'Opieka zdrowotna',
  'Zakupy',
  'Inne',
] as const

export const savingCategories = [
  'Fundusz awaryjny',
  'Emerytura',
  'Wakacje',
  'Edukacja',
  'Zakup domu',
  'Inne',
] as const

export type ExpenseCategory = (typeof expenseCategories)[number]

export const categoryStyles: Record<
  (typeof expenseCategories)[number],
  { color: string; icon: any }
> = {
  Mieszkanie: { color: 'bg-blue-100 text-blue-600', icon: Home },
  Rachunki: { color: 'bg-yellow-100 text-yellow-600', icon: CreditCard },
  Kredyty: { color: 'bg-orange-100 text-orange-600', icon: CreditCard },
  Żywność: { color: 'bg-green-100 text-green-600', icon: Utensils },
  Transport: { color: 'bg-sky-100 text-sky-600', icon: Bus },
  Media: { color: 'bg-purple-100 text-purple-600', icon: Tv },
  Rozrywka: { color: 'bg-pink-100 text-pink-600', icon: Gamepad2 },
  'Opieka zdrowotna': { color: 'bg-red-100 text-red-600', icon: HeartPulse },
  Zakupy: { color: 'bg-teal-100 text-teal-600', icon: ShoppingCart },
  Inne: { color: 'bg-gray-100 text-gray-500', icon: Circle },
}

export const categoryOCRMap: { [key: string]: string } = {
  Biedronka: 'Zakupy',
  Lidl: 'Zakupy',
  Żabka: 'Zakupy',
  Carrefour: 'Zakupy',
  Auchan: 'Zakupy',
  Netto: 'Zakupy',
  Lewiatan: 'Zakupy',
  Kaufland: 'Zakupy',
  Tesco: 'Zakupy',
  Aldi: 'Zakupy',
  BP: 'Transport',
  Shell: 'Transport',
  Orlen: 'Transport',
  Poczta: 'Rachunki',
  'Poczta Polska': 'Rachunki',
  InPost: 'Rachunki',
  DHL: 'Rachunki',
  UPS: 'Rachunki',
}

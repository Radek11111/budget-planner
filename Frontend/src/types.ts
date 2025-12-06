export interface TransactionBase {
  id: string
  date: Date | string
  amount: number
  category: string
  description: string
}

export interface Income extends TransactionBase {
  type?: 'income'
}

export interface Expense extends TransactionBase {
  type?: 'expense'
}

export interface Saving extends TransactionBase {
  type?: 'saving'
  savingGoalId?: string
  savingGoal?: SavingGoal
}

export interface SavingGoal {
  id: string
  name: string
  targetAmount: number
  currentAmount: number
  deadline: string
  createdAt: string
  updatedAt: string
  budgetId: string
  savings?: Saving[]
}

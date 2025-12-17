
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
}

export interface SavingInput {
  date: string
  category: string
  description?: string
  amount: number
  savingGoalId?: string
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
}

export interface SavingGoalInput {
  name: string
  targetAmount: number
  deadline: string
}

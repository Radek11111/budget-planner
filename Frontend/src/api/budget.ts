import type { Budget } from '@/types'
import axios from 'axios'

export function createBudgetAPI(token: string) {
  return {
    async fetchBudgets(): Promise<Budget[]> {
      const response = await axios.get('http://localhost:3001/budget/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (response.status !== 200) {
        throw new Error('Failed to fetch budgets')
      }
      return response.data
    },

    async addBudget(payload: Omit<Budget, 'id' | 'userId' | 'createdAt'>): Promise<Budget> {
      const response = await axios.post('http://localhost:3001/budget/', payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (response.status !== 201) {
        throw new Error('Failed to add budget')
      }
      return response.data
    },

    async deleteBudget(id: string): Promise<void> {
      const response = await axios.delete(`http://localhost:3001/budget/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (response.status !== 204) {
        throw new Error('Failed to delete budget')
      }
    },
  }
}

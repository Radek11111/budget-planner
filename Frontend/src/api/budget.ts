import type { Budget } from '@/types'
import { useAuth } from '@clerk/vue'
import axios from 'axios'

export async function fetchBudgets(): Promise<Budget[]> {
  const { getToken } = useAuth()
  const token = await getToken.value()
  const response = await axios.get('http://localhost:3001/api/budgets', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  if (response.status !== 200) {
    throw new Error('Failed to fetch budgets')
  }
  return response.data
}

export async function addBudget(
  payload: Omit<Budget, 'id' | 'userId' | 'createdAt'>,
): Promise<Budget> {
  const { getToken } = useAuth()
  const token = await getToken.value()
  const response = await axios.post('http://localhost:3001/api/budgets', payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  if (response.status !== 201) {
    throw new Error('Failed to add budget')
  }
  return response.data
}

export async function deleteBudget(id: string): Promise<void> {
  const { getToken } = useAuth()
  const token = await getToken.value()
  const response = await axios.delete(`http://localhost:3001/api/budgets/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  if (response.status !== 204) {
    throw new Error('Failed to delete budget')
  }
}

export interface Budget {
    id: string;
    userId: string;
    name: string;
    total: number;
    incomes: {
        date: string;
        amount: number;
        category: string;
        description: string;
    }[]
    expenses: {
        date: string;
        amount: number;
        category: string;
        description: string;
    }[]
    savings: {
        date: string;
        amount: number;
        category: string;
        description: string;
    }[]
}
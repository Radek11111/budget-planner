<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { useSavingGoalStore } from '../../stores/savingGoalStore'
import SavingGoalsCard from './SavingGoalsCard.vue'
import Card from '../ui/card/Card.vue'

const store = useSavingGoalStore()

onMounted(() => {
  store.fetchSavingGoals()
})

const onEditGoal = (goal: any) => {
  console.log('Edit goal:', goal)
}


</script>

<template>
    <Card class="p-6 space-y-6">
        <h2 class="text-xl font-semibold">Twoje cele oszczędzania</h2>

        <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            
            <SavingGoalsCard
            v-for="goal in store.goalsWithProgress"
            :key="goal.id"
            :goal="goal"
            @edit="onEditGoal"
            />
        </div>
    </Card>
</template>

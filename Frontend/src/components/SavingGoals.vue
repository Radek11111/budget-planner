<script setup lang="ts">
import { Button } from './ui/button';
import Card from './ui/card/Card.vue'
import CardContent from './ui/card/CardContent.vue'
</script>
<template>
  <div class="space-y-8">
    <!-- Goal Grid -->
    <Card>
      <CardContent class="space-y-4">
        <h2 class="text-xl font-semibold">Nowy Cel Oszczędnościowy</h2>
      </CardContent>
    </Card>

    <!-- Saving calculator section -->
    <Card>
      <CardContent class="space-y-4">
        <h2 class="text-xl font-semibold">Kalkulator celu oszczędnościowego</h2>
        <div class="">
          <div class="">
            <div class="">
              <label> Cel oszczędnościowy</label>

              <input type="number" placeholder="Np.10000" />
            </div>
            <div class="">
              <label> Data docelowa</label>

              <input type="date" placeholder="Np.10000" />
            </div>
            <div class="">
              <label>Już zaoszczędzone</label>

              <input type="number" placeholder="Np.2000" />
            </div>
            <Button variant="default" class="bg-orange-dark text-white hover:bg-orange-medium">Oblicz plan oszczędzania</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

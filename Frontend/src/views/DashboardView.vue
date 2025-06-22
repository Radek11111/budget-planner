<script setup lang="ts"></script>

<template>
  <div class="min-h-screen bg-gray-50">
    <div class="container mx-auto px-4 py-8 max-w-7xl">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-orange">Planer Budżetu</h1>
        <p class="text-gray-600">Śledź swoje finanse i planuj przyszłość</p>
      </div>
      <!-- Summary Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <!-- Earnings Card -->
        <div
          class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
        >
          <div class="flex items-center mb-4">
            <v-icon
              name="io-wallet-outline"
              scale="1.5"
              fill="orange"
              animation="pulse"
              class="mr-3"
            />
            <h2 class="text-xl font-semibold text-gray-800">Zarobki</h2>
          </div>
          <p class="text-3xl font-bold text-gray-800 mb-2">Zarobki w zł</p>
          <p class="text-gray-600">tu funcja wyliczajaca</p>
        </div>
        <!-- Expenses Card -->
        <div
          class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
        >
          <div class="flex items-center mb-4">
            <v-icon
              name="fa-shopping-cart"
              scale="1.5"
              fill="orange"
              animation="pulse"
              class="mr-3"
            />
            <h2 class="text-xl font-semibold text-gray-800">Wydatki</h2>
          </div>
          <p class="text-3xl font-bold text-gray-800 mb-2">Zarobki w zł</p>
          <p class="text-gray-600">tu funcja wyliczajaca</p>
        </div>
        <!-- Savings Card -->
        <div
          class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
        >
          <div class="flex items-center mb-4">
            <v-icon name="fa-piggy-bank" scale="1.5" fill="orange" animation="pulse" class="mr-3" />
            <h2 class="text-xl font-semibold text-gray-800">Oszczędności</h2>
          </div>
          <p class="text-3xl font-bold text-gray-800 mb-2">Zarobki w zł</p>
          <p class="text-gray-600">tu funcja wyliczajaca</p>
        </div>
      </div>
      <!-- Charts Section -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">Wykres Finansów</h2>
        <div class="flex flex-col md:flex-row gap-6">
          <div class="w-full md:w-2/3" style="height: 400px">wykres</div>
          <div class="w-full md:w-1/3 mt-6 md:mt-0">
            <div class="mb-4">
              <h3 class="text-lg font-medium text-gray-800 mb-2">Podsumowanie</h3>
              <p class="text-gray-600">Twoje podsumowanie bugdżetu na dzień</p>
            </div>
            <div class="space-y-4">
              <div class="flex items-center">
                <div class="bg-orange-light w-4 h-4 rounded-full mr-3"></div>
                <div class="">
                  <p class="font-medium">Zarobki</p>
                  <p class="text-gray-600">tu funcja wyliczajaca</p>
                </div>
              </div>
              <div class="flex items-center">
                <div class="bg-orange-dark w-4 h-4 rounded-full mr-3"></div>
                <div class="">
                  <p class="font-medium">Wydatki</p>
                  <p class="text-gray-600">tu funcja wyliczajaca</p>
                </div>
              </div>
              <div class="flex items-center">
                <div class="bg-orange-light-medium w-4 h-4 rounded-full mr-3"></div>
                <div class="">
                  <p class="font-medium">Oszczędności</p>
                  <p class="text-gray-600">tu funcja wyliczajaca</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Tabs section -->
  </div>
</template>

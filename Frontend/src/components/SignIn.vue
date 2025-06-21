<script setup>
import { useClerk } from '@clerk/vue'
import { SignedIn, SignedOut, UserButton } from '@clerk/vue'


const clerk = useClerk()
</script>

<template>
  <div>
    <SignedOut>
      <button
        @click="clerk.openSignIn"
        class="px-6 py-2 bg-gradient-to-r from bg-indigo-600 to-purple-600 text-white font-medium text-lg rounded-lg shadow-lg hover:from-indigo-700 hover:to-purple-700 hover:shadow-xl active:scale-95 transition-all duration-200 focus:outline=none focus:ring2 focus:ring-purple-400 focus:ring-offset-2"
      >
        <div class="flex items-center space-x-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
            />
          </svg>
          <span>Zaloguj się</span>
        </div>
      </button>
    </SignedOut>
    <SignedIn>
      <UserButton
        :appearance="{
          elements: {
            avatarBox: {
              width: '40px',
              height: '40px',
              
            },
            userButtonPopoverCard: {},
          },
        }"
      />
    </SignedIn>
  </div>
</template>

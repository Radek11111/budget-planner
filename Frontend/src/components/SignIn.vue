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
        class="bg-white text-orange-dark border border-orange-dark font-bold px-5 py-2.5 rounded-lg transition-all flex items-center gap-2 shadow-md hover:shadow-lg"
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

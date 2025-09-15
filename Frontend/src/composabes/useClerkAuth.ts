import { useClerk } from '@clerk/vue'

export const useClerkAuth = () => {
  const clerk = useClerk()

  const signIn = () => {
    clerk.value?.openSignIn()
  }
  const signOut = () => {
    clerk.value?.signOut()
  }
  const openUserProfile = () => {
    clerk.value?.openUserProfile()
  }

  return {
    signIn,
    signOut,
    openUserProfile,
  }
}

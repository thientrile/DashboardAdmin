// composables/useGlobalLoading.ts
export const useGlobalLoading = () => {
    const isGlobalLoading = useState('isGlobalLoading', () => true)
    return isGlobalLoading
  }
  
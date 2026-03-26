import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useGlobalState = create(
  persist(
    (set) => ({
      user: null,
      data: [],
      isDataLoading: false,
      credentials: [],
      requestTokens: [],
      selectedBroker: null,
      setData: (data) => set({ data }),
      setIsDataLoading: (isLoading) => set({ isDataLoading: isLoading }),
      setUser: (user) => set({ user }),
      setCredentials: (credentials) => set({ credentials }),
      setRequestTokens: (tokensOrFn) =>
        set((state) => ({
          requestTokens:
            typeof tokensOrFn === "function"
              ? tokensOrFn(state.requestTokens)
              : Array.isArray(tokensOrFn)
                ? tokensOrFn
                : [],
        })),

      setSelectedBroker: (broker) => set({ selectedBroker: broker }),
    }),
    {
      name: 'tradio-state',
      partialize: (state) => ({
        user: state.user,
        credentials: state.credentials,
        requestTokens: state.requestTokens,
        selectedBroker: state.selectedBroker,
        data: state.data,
      }),
    }
  )
);

export default useGlobalState;

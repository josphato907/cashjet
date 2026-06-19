import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isLoggedIn: false,
      deviceId: "",

      initializeDevice: () => {
        if (typeof window === 'undefined') return;
        let id = localStorage.getItem("cashjet-device-id");
        if (!id) {
          id = `device-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
          localStorage.setItem("cashjet-device-id", id);
        }
        set({ deviceId: id });
      },

      setUser: (userData) => {
        const state = get();
        set({
          user: {
            ...userData,
            deviceId: state.deviceId,
            lastLogin: Date.now(),
          },
          isLoggedIn: true,
        });
      },

      logout: () => {
        set({ user: null, isLoggedIn: false });
      },

      updateBalance: (amount) => {
        set((state) => {
          if (!state.user) return {};
          return {
            user: {
              ...state.user,
              balance: Math.max(0, (state.user.balance || 0) + amount),
            },
          };
        });
      },

      addBonus: (amount) => {
        set((state) => {
          if (!state.user) return {};
          return {
            user: {
              ...state.user,
              bonus: (state.user.bonus || 0) + amount,
              balance: (state.user.balance || 0) + amount,
            },
          };
        });
      },

      addSharedEarning: () => {
        let now = Date.now();
        set((state) => {
          if (!state.user) return {};
          // Limit WhatsApp sharing to once every 5 minutes (300,000 ms)
          if (now - (state.user.lastSharedAt || 0) < 300000) {
            return {};
          }
          return {
            user: {
              ...state.user,
              balance: (state.user.balance || 0) + 300,
              sharedCount: (state.user.sharedCount || 0) + 1,
              lastSharedAt: now,
            },
          };
        });
      },

      setActivationFeePaid: (paid) => {
        set((state) => {
          if (!state.user) return {};
          return {
            user: {
              ...state.user,
              activationFeePaid: paid,
            },
          };
        });
      },
    }),
    {
      name: "auth-store",
      // Only persist in client-side environments
      skipHydration: typeof window === 'undefined',
    }
  )
);

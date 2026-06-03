import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { createUISlice, type UISlice } from './slices/uiSlice';
import { createAuthSlice, type AuthSlice } from './slices/authSlice';

export type StoreState = UISlice & AuthSlice;

export const useAppStore = create<StoreState>()(
  persist(
    immer((...a) => ({
      ...createUISlice(...a),
      ...createAuthSlice(...a),
    })),
    {
      name: 'app-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ 
        theme: state.theme,
        sidebarOpen: state.sidebarOpen,
        user: state.user
      }),
    }
  )
);

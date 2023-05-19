import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface UserProps {
  email: string,
  salario: number,
  horasDia: number,
  diasSemana: number,
  id: number
}

interface UseUserStoreProps {
  user: UserProps
  setUser: (user: UserProps) => void;
}

const useStore = create<UseUserStoreProps>()(persist(
  (set) => ({
    user: {
      email: '',
      salario: 0,
      horasDia: 0,
      diasSemana: 0,
      id: 0
    },
    setUser: (user) => set({
      user: {
        email: user.email,
        salario: user.salario,
        horasDia: user.horasDia,
        diasSemana: user.diasSemana,
        id: user.id
      }
    })
  }),
  {
    name: 'user-storage',
    storage: createJSONStorage(() => localStorage),
  }
));

export const useUserStore = useStore;
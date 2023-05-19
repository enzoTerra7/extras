'use client'
import { useUserStore } from "@/Store/user";
import Card from "@/components/Card";
import { CashIcon, ClockIcon, CalendarIcon } from '@heroicons/react/solid';

export function WorkDataCards() {
  
  const userInfos = useUserStore(state => state.user)

  return (
    <Card
      cards={[
        {
          icon: <CashIcon className="w-6 h-6 text-white" />,
          id: 1,
          name: 'Seu salário',
          stat: `R$${userInfos.salario}`
        },
        {
          icon: <ClockIcon className="w-6 h-6 text-white" />,
          id: 2,
          name: 'Horas trabalhadas por dia',
          stat: userInfos.horasDia
        },
        {
          icon: <CalendarIcon className="w-6 h-6 text-white" />,
          id: 3,
          name: 'Dias trabalhados na semana',
          stat: userInfos.diasSemana
        }
      ]}
    />
  )
}
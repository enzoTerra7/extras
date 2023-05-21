'use client'
import Card from "@/components/Card";
import api from "@/lib/api";
import { CashIcon, ClockIcon, CalendarIcon } from '@heroicons/react/solid';
import useSWR from 'swr'
export function WorkDataCards() {

  const { data, error, isLoading } = useSWR<any, any, "/api/user">("/api/user", api)

  return (
    <>
      <Card
        loading={isLoading}
        cards={[
          {
            icon: <CashIcon className="w-6 h-6 text-white" />,
            id: 1,
            name: 'Seu salário',
            stat: `R$${data?.data?.user?.salario}`
          },
          {
            icon: <ClockIcon className="w-6 h-6 text-white" />,
            id: 2,
            name: 'Horas trabalhadas por dia',
            stat: data?.data?.user?.horasDia
          },
          {
            icon: <CalendarIcon className="w-6 h-6 text-white" />,
            id: 3,
            name: 'Dias trabalhados na semana',
            stat: data?.data?.user?.diasSemana
          }
        ]}
      />
    </>
  )
}
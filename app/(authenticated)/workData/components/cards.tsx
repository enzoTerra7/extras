'use client'
import Card from "@/components/Card";
import api from "@/lib/api";
import { formatCurrency } from "@/utils/usualFunction";
import { CashIcon, ClockIcon, CalendarIcon, CurrencyDollarIcon } from '@heroicons/react/solid';
import useSWR from 'swr'
export function WorkDataCards() {

  const { data, error, isLoading } = useSWR<any, any, "/api/user">("/api/user", api, { refreshInterval: 5000 })

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
            icon: <CurrencyDollarIcon className="w-6 h-6 text-white" />,
            id: 1,
            name: 'Valor da sua hora extra',
            stat: formatCurrency(Number(data?.data?.user?.valorHora || 0) * 1.8)
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
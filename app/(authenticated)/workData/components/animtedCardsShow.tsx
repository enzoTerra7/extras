'use client'
import api from "@/lib/api";
import { AnimatedCard } from "./animatedCards";
import useSWR from 'swr'
import { formatCurrency } from "@/utils/usualFunction";

export function CardsAnimation() {
  
  const { data, error, isLoading } = useSWR<any, any, "/api/user">("/api/user", api, { refreshInterval: 5000 })

  return (
    <>
      <div className="flex gap-4 items-center w-full flex-wrap ">
        <AnimatedCard
          loading={isLoading}
          title="Total de ganhos"
          value={formatCurrency(data?.data?.user?.totalGanho)}
          type="circle"
        />
        <AnimatedCard
          loading={isLoading}
          title="Total de horas já feita"
          value={data?.data?.user?.totalHoras}
          type="bar"
        />
        <AnimatedCard
          loading={isLoading}
          title="Total de horas descontadas"
          value={data?.data?.user?.totalHorasDescontadas}
          type="clock"
        />
      </div>
    </>
  )
}
'use client'
import useSWR from 'swr'
import { AnimatedCard } from "../workData/components/animatedCards"
import api from '@/lib/api'
import { formatCurrency } from '@/utils/usualFunction'
import { Header } from '@/components/Heading'
import { ResponsiveBar } from '@nivo/bar'

export default function Dashboard() {

  const { data, error, isLoading } = useSWR<any, any, "/api/dashboard">("/api/dashboard", api)

  return (
    <>
      <Header
        title='Confira seus dados'
        subtitle='Veja o quanto você tem de extras nesse mês'
      />
      {isLoading ? (
        <div className="flex bg-white rounded-lg shadow h-80 w-full justify-center items-center">
          <svg aria-hidden="true" role="status" className="inline margin-auto w-16 h-16 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="rgb(7 89 133)"></path>
            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"></path>
          </svg>
        </div>
      ) : (
        <>
          <div className="flex gap-4 items-center w-full flex-wrap ">
            <AnimatedCard
              title="Ganhos no mês"
              value={formatCurrency(data?.data?.dados?.totalGanho)}
              type="circle"
            />
            <AnimatedCard
              title="Horas feitas"
              value={data?.data?.dados?.totalHoras}
              type="bar"
            />
            <AnimatedCard
              title="Horas descontadas"
              value={data?.data?.dados?.totalHorasDescontadas}
              type="clock"
            />
          </div>

          <div className="flex flex-col gap-4 p-8 w-full bg-white rounded-lg shadow-lg">
            <Header
              title='Veja em quais dias você fez seus extras!'
              subtitle='E analise quanto você tem trabalhado'
            />
            <h4 className='text-center font-extrabold text-xl text-sky-700 xl:hidden'>
              Acesse em uma tela maior para ter acesso gráfico!
            </h4>
            <div className="hidden xl:flex h-80 w-full">
              <ResponsiveBar
                data={data.data.dados.grafico.map((dados: any) => ({
                  day: dados.dia,
                  horas: dados.horas
                }))}
                keys={[
                  'horas',
                ]}
                indexBy="day"
                margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
                padding={0.3}
                valueScale={{ type: 'linear' }}
                indexScale={{ type: 'band', round: true }}
                colors={{ scheme: 'purple_blue' }}
                colorBy="indexValue"
                borderColor={{
                  from: 'color',
                  modifiers: [
                    [
                      'darker',
                      1.6
                    ]
                  ]
                }}
                axisTop={null}
                axisRight={null}
                axisBottom={{
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: 0,
                  legend: 'Dias',
                  legendPosition: 'middle',
                  legendOffset: 32
                }}
                axisLeft={{
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: 0,
                  legend: '',
                  legendPosition: 'middle',
                  legendOffset: -40,
                  format: e => `${Math.floor(e / 60)}h${e % 60}m`
                }}
                label={d => `${Math.floor(Number(d.value) / 60)}:${Number(d.value) % 60}`}
                labelSkipWidth={12}
                labelSkipHeight={12}
                labelTextColor={{
                  from: 'color',
                  modifiers: [
                    [
                      'darker',
                      1.6
                    ]
                  ]
                }}
                legends={[
                  {
                    dataFrom: 'keys',
                    anchor: 'bottom-right',
                    direction: 'column',
                    justify: false,
                    translateX: 120,
                    translateY: 0,
                    itemsSpacing: 2,
                    itemWidth: 100,
                    itemHeight: 20,
                    itemDirection: 'left-to-right',
                    itemOpacity: 0.85,
                    symbolSize: 20,
                    effects: [
                      {
                        on: 'hover',
                        style: {
                          itemOpacity: 1
                        }
                      }
                    ]
                  }
                ]}
                tooltip={e => (
                  <>
                    <div className="bg-white shadow-lg border border-gray-200 p-3 rounded">
                      <p className="font-bold text-sky-950">{`Dia ${e.label.replace('horas ', '')}`}</p>
                      <p className="">
                        {e.value == 0 ? '0h' : `${Math.floor(e.value / 60)}h${e.value % 60}m`}
                      </p>
                    </div>
                  </>
                )}
                role="application"
                ariaLabel="Nivo bar chart demo"
                barAriaLabel={e => e.id + ": " + e.formattedValue + " in country: " + e.indexValue}
              />
            </div>
          </div>
        </>
      )}
    </>
  )
}
// 'use client'
import { classNames } from '@/utils/usualFunction';
import Skeleton from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css'

interface Cards {
  change?: {
    change: React.ReactNode,
    changeType: 'increase' | 'decrease'
  }
  id: number,
  name: string,
  stat: string | number,
  icon: React.ReactNode,
}

interface CardProps {
  className?: string
  loading?: boolean
  cards: Cards[]
}

export default function Card(props: CardProps) {

  return (
    <>
      {props.cards.map((item) => (
        <div
          key={item.id}
          className={`relative flex-1 bg-white pt-5 px-4 sm:pt-6 sm:px-6 shadow rounded-lg overflow-hidden`}
        >
          {props.loading ? (
            <dt>
              <div className="absolute rounded-md ">
                <Skeleton height={48} width={48} />
              </div>
              <Skeleton height={8} width={'80%'} className='ml-16' />
            </dt>
          ) : (
            <dt>
              <div className="absolute bg-sky-500 rounded-md p-3">
                {item.icon}
              </div>
              <p className="ml-16 text-sm font-medium text-gray-500 truncate">{item.name}</p>
            </dt>
          )}
          {props.loading ? (
            <Skeleton height={8} width={'40%'} className='ml-16 mb-9' />
          ) : (
            <dd className="ml-16 pb-6 flex items-baseline sm:pb-7">
              <p
                className={classNames(
                  item?.change ? item?.change.changeType === 'increase' ?
                    'text-green-600' : 'text-red-600' : 'text-gray-900',
                  'text-2xl font-semibold'
                )}
              >{item.stat}</p>
              {item.change && (
                <p
                  className={classNames(
                    item.change.changeType === 'increase' ? 'text-green-600' : 'text-red-600',
                    'ml-2 flex items-baseline text-sm font-semibold'
                  )}
                >
                  <span className="sr-only">{item.change.changeType === 'increase' ? 'Aumento' : 'Prejuízo'} de</span>
                  {item.change.change}
                </p>
              )}
            </dd>
          )}
        </div>
      ))}
    </>
  )
}
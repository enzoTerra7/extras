'use client'
import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import {
  ClockIcon,
  MenuAlt1Icon,
  XIcon,
} from '@heroicons/react/outline'
import {
  HomeIcon
} from '@heroicons/react/solid'
import { classNames } from '@/utils/usualFunction'
import { usePathname } from 'next/navigation'

export function Sidebar({ children }: {
  children?: React.ReactNode
}) {

  const path = usePathname()

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon, current: path.includes('/dashboard') },
    { name: 'Dados Trabalhistas', href: '/workData', icon: ClockIcon, current: path.includes('/workData') },
  ]

  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <>
      <Transition.Root show={sidebarOpen} as={Fragment}>
        <Dialog as="div" className="fixed inset-0 flex z-40" onClose={setSidebarOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-600 bg-opacity-75" />
          </Transition.Child>
          <Transition.Child
            as={Fragment}
            enter="transition ease-in-out duration-300 transform"
            enterFrom="-translate-x-full"
            enterTo="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leaveFrom="translate-x-0"
            leaveTo="-translate-x-full"
          >
            <div className="relative flex-1 flex flex-col max-w-xs w-full pt-5 pb-4 bg-white">
              <Transition.Child
                as={Fragment}
                enter="ease-in-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in-out duration-300"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="absolute -mr-12 top-0 right-0 h-16 flex items-center justify-center">
                  <button
                    type="button"
                    className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <span className="sr-only">Close sidebar</span>
                    <XIcon className="h-6 w-6 text-white" aria-hidden="true" />
                  </button>
                </div>
              </Transition.Child>
              <div className="flex-shrink-0 flex items-center px-4">
                <img
                  className="h-8 w-auto"
                  src="https://tailwindui.com/img/logos/158x48/reform-logo-gray-900.svg"
                  alt="Reform logo"
                />
              </div>
              <nav className="mt-8 flex-1 flex flex-col divide-y divide-cyan-800 overflow-y-auto" aria-label="Sidebar">
                <div className="px-2 space-y-4">
                  {navigation.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className={classNames(
                        item.current ? 'bg-sky-500 text-white' : 'text-gray-800 hover:text-white hover:bg-sky-500',
                        'group flex items-center transition py-4 px-3 text-lg font-medium rounded-md'
                      )}
                      aria-current={item.current ? 'page' : undefined}
                    >
                      <item.icon className="mr-4 flex-shrink-0 h-6 w-6" aria-hidden="true" />
                      {item.name}
                    </a>
                  ))}
                </div>
              </nav>
            </div>
          </Transition.Child>
        </Dialog>
      </Transition.Root>
      <button
        type="button"
        className="absolute -mr-12 h-16 left-2 flex items-center justify-center z-20 top-0 text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-cyan-500"
        onClick={() => setSidebarOpen(true)}
      >
        <span className="sr-only">Abrir sidebar</span>
        <MenuAlt1Icon className="h-6 w-6" aria-hidden="true" />
      </button>
    </>
  )
}
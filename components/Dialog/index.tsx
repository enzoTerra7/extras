import { Dialog as Modal, Transition } from '@headlessui/react'
import { Fragment, useState } from 'react'
import { Button, ButtonProps } from '../Button'

interface DialogProps {
  title: String
  subtitle: React.ReactNode
  button: ButtonProps
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  withoutOutsideClick?: boolean
}

export default function Dialog(props: DialogProps) {

  const close = () => {
    props.setIsOpen(false)
  }

  return (
    <Transition appear show={props.isOpen} as={Fragment}>
      <Modal as="div" className="relative z-10" onClose={props.withoutOutsideClick ? () => '' : close}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Modal.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all flex items-center flex-col gap-4">
                <Modal.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  {props.title}
                </Modal.Title>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    {props.subtitle}
                  </p>
                </div>

                <div className="mt-4">
                  <Button
                    {...props.button}
                    onClick={() => {
                      close()
                      if(props.button.onClick) props.button.onClick()
                    }}
                  >
                    {props.button.children}
                  </Button>
                </div>
              </Modal.Panel>
            </Transition.Child>
          </div>
        </div>
      </Modal>
    </Transition>
  )
}

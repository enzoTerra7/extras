'use client'
import { Button } from '@/components/Button';
import { Header } from '@/components/Heading';
import { Transition } from '@headlessui/react';
import { CheckIcon, PencilIcon, UploadIcon } from '@heroicons/react/solid';
import { useState } from 'react';
import useSWR from 'swr';

export default function MyProfile() {

  const [editing, setEditing] = useState(false)

  const handleSaveInformation = async () => {
    alert('em construção')
  }

  return (
    <>
      <div className="flex w-full flex-col bg-white p-4 md:p-8 lg:p-12 rounded md:rounded-md lg:rounded-lg shadow-lg gap-4">
        <Header
          title='Confira as informações do seu usuário'
          subtitle='Veja e edite suas informações trabalhistas.'
          button={{
            testId: 'editar',
            children: editing ? (
              <>
                <CheckIcon className="w-6 h-6" />
                Salvar edição
              </>
            ) : (
              <>
                <PencilIcon className="w-6 h-6" />
                Editar
              </>
            ),
            onClick: editing ? handleSaveInformation : () => setEditing(true)
          }}
        />
        <div className="flex gap-4 md:gap-8 flex-wrap w-full items-center">
          <div className="flex items-center p-4 flex-col gap-4 mx-auto transition-shadow duration-300 hover:rounded-lg hover:shadow-lg hover:border-gray-50 hover:border w-[280px] md:[320px]">
            <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=1080&h=1080&q=80" alt="Foto do seu usuário" className='w-full rounded-full object-cover' />
            <Transition
              show={editing}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Button
                testId='enviar foto'
              >
                <UploadIcon className="w-6 h-6" />
                Enviar foto
              </Button>
            </Transition>
          </div>
        </div>
      </div>
    </>
  )
}
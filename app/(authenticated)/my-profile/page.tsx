'use client'
import { Button } from '@/components/Button';
import { Header } from '@/components/Heading';
import { Input } from '@/components/Input';
import api from '@/lib/api';
import { Transition } from '@headlessui/react';
import { XIcon } from '@heroicons/react/outline';
import { CheckIcon, PencilIcon, UploadIcon } from '@heroicons/react/solid';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import ToastInstance from '@/lib/toastify';
import { formatCurrency } from '@/utils/usualFunction';
import Dialog from '@/components/Dialog';
import { Dropzone } from '@/components/Dropzone';

const schema = yup.object({
  Email: yup.string().email("Formato de email inválido").required("Por favor, preencha este campo."),
  Nome: yup.string().required("Por favor, preencha este campo").matches(/^(?=(?:.*[a-zA-ZÀ-ÖØ-öø-ÿ]){5})[a-zA-ZÀ-ÖØ-öø-ÿ\s]+$/, "O nome deve possuir pelo menos 5 letras. E não pode conter números ou símbolos."),
  Salario: yup.number().positive('O valor inserido deve ser no mínimo 1').required("Por favor, preencha este campo.").typeError('Por favor, preencha com um valor válido.'),
  HorasDia: yup.number().min(1, 'O valor inserido deve ser no mínimo 1').max(24, 'O valor inserido deve ser no máximo 24').required("Por favor, preencha este campo.").typeError('Por favor, preencha com um número válido.'),
  DiasSemana: yup.number().min(1, 'O valor inserido deve ser no mínimo 1').max(7, 'O valor inserido deve ser no máximo 7').required("Por favor, preencha este campo.").typeError('Por favor, preencha com um número válido.')
}).required()

export default function MyProfile() {

  const [editing, setEditing] = useState(false)
  const [sending, setSending] = useState(false)
  const [sendingImage, setSendingImage] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [previewImage, setPreviewImage] = useState('')
  const [modalOpen, setModalOpen] = useState(false)

  const { data, isLoading } = useSWR<any, any, "/api/user">("/api/user", api, { refreshInterval: 5000 })

  const { register, handleSubmit, formState: { errors }, clearErrors, setValue } = useForm({
    resolver: yupResolver(schema),
  });

  const handleSaveInformation = async (values: any) => {
    try {
      setSending(true)
      const { data } = await api.put('/api/user', {
        ...values
      })
      setEditing(false)
      ToastInstance.success('Informações atualizadas com sucesso! Em instantes os dados serão atualizados.')
    } catch (e: any) {
      console.log(e)
      ToastInstance.error(e.response.data.message)
    } finally {
      setSending(false)
    }
  }

  function fileToBase64(file: File, callback: (file64: string | ArrayBuffer | null) => Promise<void>) {
    var reader = new FileReader();
    reader.onloadend = function () {
      callback(reader.result);
    };
    reader.readAsDataURL(file);
  }

  const sendImage = async (file64: string | ArrayBuffer | null) => {
    try {
      setSendingImage(true)
      await api.put('/api/user/image', {
        Imagem: file64
      })
      handleCloseModal()
      ToastInstance.success('Imagem atualizadas com sucesso! Em instantes ela será atualizada.')
    } catch (e: any) {
      console.log(e)
      ToastInstance.error(e.response.data.message)
    } finally {
      setSendingImage(false)
    }
  }

  const handleCloseModal = () => {
    setModalOpen(false)
    setFile(null)
    setPreviewImage('')
  }

  useEffect(() => {
    if (data && !isLoading) {
      setValue('Email', data?.data?.user?.email)
      setValue('Nome', data?.data?.user?.nome)
      setValue('Salario', data?.data?.user?.salario)
      setValue('HorasDia', data?.data?.user?.horasDia)
      setValue('DiasSemana', data?.data?.user?.diasSemana)
    }
  }, [isLoading, data])

  return (
    <>
      <div className="flex w-full flex-col bg-white p-4 md:p-8 lg:p-12 rounded md:rounded-md lg:rounded-lg shadow-lg gap-4">
        <Header
          title='Confira as informações do seu usuário'
          subtitle='Veja e edite suas informações trabalhistas.'
          button={{
            loading: sending,
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
            onClick: editing ? handleSubmit(handleSaveInformation) : () => setEditing(true)
          }}
          secondButton={editing ? {
            testId: 'cancelar',
            type: 'white',
            children: <>
              <XIcon className='w-6 h-6' />
              Cancelar
            </>,
            onClick: () => {
              clearErrors()
              setEditing(false)
            }
          } : undefined}
        />
        {isLoading ? (
          <div className="flex gap-4 md:gap-8 flex-wrap w-full justify-center items-center">
            <svg aria-hidden="true" role="status" className="inline margin-auto w-16 h-16 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="rgb(7 89 133)"></path>
              <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"></path>
            </svg>
          </div>
        ) : (
          <div className="flex gap-4 md:gap-8 flex-wrap w-full items-center">
            <div className="flex items-center p-4 flex-col gap-4 mx-auto transition-shadow duration-300 hover:rounded-lg hover:shadow-lg hover:border-gray-50 hover:border w-[280px] md:w-[320px]">
              <img src={(!!!data?.data?.user?.imagem.length || isLoading) ? "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" : data.data.user.imagem} alt="Foto do seu usuário" className='w-full rounded-full object-cover' />
              <Transition
                show={editing}
                enter="transition ease-out duration-300"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-300"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Button
                  testId='enviar foto'
                  onClick={() => setModalOpen(true)}
                >
                  <UploadIcon className="w-6 h-6" />
                  Enviar foto
                </Button>
              </Transition>
            </div>
            <div className="flex flex-1 p-4 gap-4 flex-col transition-shadow duration-300 hover:rounded-lg hover:border-gray-50 hover:border w-[280px] md:w-[unset]">
              <Header
                title={data.data.user.nome}
                subtitle='Confira e edite seus dados'
              />
              <div className="flex flex-col gap-4 md:flex-row w-full">
                <Input
                  id='email'
                  label="Email"
                  input={{
                    ...register('Email'),
                    placeholder: 'Insira o seu email',
                    disabled: true
                  }}
                  type="email"
                  error={!!errors.Email}
                  errorMessage={errors.Email?.message as string || ''}
                />
                <Input
                  id='nome'
                  label="Nome"
                  input={{
                    ...register('Nome'),
                    placeholder: 'Insira o seu nome',
                    disabled: !editing,
                  }}
                  error={!!errors.Nome}
                  errorMessage={errors.Nome?.message as string || ''}
                />
              </div>
              <div className="flex flex-col gap-4 lg:flex-row w-full">
                <Input
                  id="Salario"
                  label="Salário (R$)"
                  type="number"
                  input={{
                    ...register('Salario'),
                    placeholder: "Insira sem os centavos",
                    min: 1,
                    disabled: !editing,
                  }}
                  error={!!errors.Salario}
                  errorMessage={errors.Salario?.message as string || ''}
                />
                <Input
                  id="Horas"
                  label="Horas por dia"
                  type="number"
                  input={{
                    ...register('HorasDia'),
                    placeholder: "Insira seu horário diário",
                    min: 1,
                    max: 24,
                    disabled: !editing,
                  }}
                  error={!!errors.HorasDia}
                  errorMessage={errors.HorasDia?.message as string || ''}
                />
                <Input
                  id="Semanas"
                  type="number"
                  label="Dias por semana"
                  input={{
                    ...register('DiasSemana'),
                    placeholder: "Insira a qtd de dias na semana",
                    min: 1,
                    max: 7,
                    disabled: !editing,
                  }}
                  error={!!errors.DiasSemana}
                  errorMessage={errors.DiasSemana?.message as string || ''}
                />
              </div>
            </div>
            <div className="hidden w-full md:flex flex-wrap items-center gap-4">
              <div className="flex flex- items-center p-4 flex-col gap-4 transition-shadow duration-300 rounded-lg border-gray-150 border min-w-[260px] flex-1">
                <h4 className="text-sky-950 font-semibold text-lg">
                  Valor da sua hora
                </h4>
                <strong className="text-sky-500 font-semibold text-lg">
                  {formatCurrency(data.data.user.valorHora)}
                </strong>
              </div>
              <div className="flex items-center p-4 flex-col gap-4 transition-shadow duration-300 rounded-lg hover:shadow-lg border-gray-150 border min-w-[260px] flex-1">
                <h4 className="text-sky-950 font-semibold text-lg">
                  Ganhos totais
                </h4>
                <strong className="text-sky-500 font-semibold text-lg">
                  {formatCurrency(data.data.user.totalGanho)}
                </strong>
              </div>
              <div className="flex items-center p-4 flex-col gap-4 transition-shadow duration-300 rounded-lg hover:shadow-lg border-gray-150 border min-w-[260px] flex-1">
                <h4 className="text-sky-950 font-semibold text-lg">
                  Horas feitas
                </h4>
                <strong className="text-sky-500 font-semibold text-lg">
                  {data.data.user.totalHoras}
                </strong>
              </div>
              <div className="flex items-center p-4 flex-col gap-4 transition-shadow duration-300 rounded-lg hover:shadow-lg border-gray-150 border min-w-[260px] flex-1">
                <h4 className="text-sky-950 font-semibold text-lg">
                  Total de horas descontadas
                </h4>
                <strong className="text-sky-500 font-semibold text-lg">
                  {data.data.user.totalHorasDescontadas}
                </strong>
              </div>
            </div>
          </div >
        )}
      </div >
      <Dialog
        secondButton={file && {
          children: 'Enviar',
          testId: 'enviar',
          loading: sendingImage,
          onClick: () => fileToBase64(file as File, sendImage),
        } || undefined}
        button={{
          children: 'Cancelar',
          testId: 'cancelar',
          type: 'white',
          onClick: handleCloseModal,
          disabled: sendingImage
        }}
        withoutOutsideClick
        disabledAutoClose
        isOpen={modalOpen}
        setIsOpen={setModalOpen}
        title="Trocar foto"
        subtitle="Selecione a foto que deseja enviar"
      >
        {file ? (
          <div className="flex h-[50vh] min-h-[350px] w-full items-center justify-center p-4 border border-dashed border-sky-700 rounded-lg">
            <img src={previewImage} alt="Sua nova foto" className="h-full object-cover" />
          </div>
        ) : (
          <Dropzone
            saveFile={setFile}
            typeFiles={2}
            preview={setPreviewImage}
          >
            <div className="flex h-[50vh] min-h-[350px] w-full items-center justify-center p-4 border border-dashed border-sky-700 rounded-lg">
              <h4 className="font-bold text-sky-950 text-lg text-center">
                Clique aqui ou solte o arquivo para enviar sua foto.
              </h4>
            </div>
          </Dropzone>
        )}
      </Dialog>
    </>
  )
}
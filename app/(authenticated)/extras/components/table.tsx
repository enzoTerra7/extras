'use client'
import Dialog from '@/components/Dialog'
import { ExtraModal } from '@/components/ExtraModal'
import api from '@/lib/api'
import ToastInstance from '@/lib/toastify'
import { formatCurrency } from '@/utils/usualFunction'
import { PencilIcon, TrashIcon, XCircleIcon } from '@heroicons/react/solid'
import { useEffect, useState } from 'react'
import useSWR from 'swr'

export function TableExtras() {

  const { data, error, isLoading } = useSWR<any, any, "/api/extras">("/api/extras", api, { refreshInterval: 5000 })

  const [show, setShow] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [dataEdit, setDataEdit] = useState<any>(null)
  const [sending, setSending] = useState(false)

  const handleDelete = async (id: number) => {
    try {
      setSending(true)
      await api.delete(`/api/extras/${id}`)
      ToastInstance.success("Extra removido com sucesso. Em instantes os dados serão atualizados")
    } catch (e: any) {
      console.log(e)
      ToastInstance.error(e?.response?.data?.message)
    } finally {
      setDataEdit(null)
      setShowDelete(false)
      setSending(false)
    }
  }

  useEffect(() => {
    if (!show) setDataEdit(null)
  }, [show])

  return (
    <table className="border-collapse w-full">
      <thead>
        <tr>
          <th className="p-3 font-bold uppercase bg-sky-200 text-gray-600 border border-gray-300 hidden lg:table-cell">Descrição</th>
          <th className="p-3 font-bold uppercase bg-sky-200 text-gray-600 border border-gray-300 hidden lg:table-cell">Dia</th>
          <th className="p-3 font-bold uppercase bg-sky-200 text-gray-600 border border-gray-300 hidden lg:table-cell">Horas totais</th>
          <th className="p-3 font-bold uppercase bg-sky-200 text-gray-600 border border-gray-300 hidden lg:table-cell">Valor</th>
          <th className="p-3 font-bold uppercase bg-sky-200 text-gray-600 border border-gray-300 hidden lg:table-cell">Descontado</th>
          <th className="p-3 font-bold uppercase bg-sky-200 text-gray-600 border border-gray-300 hidden lg:table-cell">Ações</th>
        </tr>
      </thead>
      <tbody>
        {isLoading ? (
          <tr className="bg-white lg:hover:bg-gray-100 flex lg:table-row flex-row lg:flex-row flex-wrap lg:flex-no-wrap mb-10 lg:mb-0">
            <td className="w-full lg:w-auto p-3 text-gray-800 text-center border border-b block lg:table-cell relative lg:static" colSpan={6}>
              <svg aria-hidden="true" role="status" className="inline margin-auto w-8 h-8 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="rgb(7 89 133)"></path>
                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"></path>
              </svg>
            </td>
          </tr>
        ) : error ? (
          <tr className="bg-white lg:hover:bg-gray-100 flex lg:table-row flex-row lg:flex-row flex-wrap lg:flex-no-wrap mb-10 lg:mb-0">
            <td className="w-full lg:w-auto p-3 text-red-600 text-center border border-b block lg:table-cell relative lg:static" colSpan={6}>
              Algo deu errado. Tente novamente mais tarde
            </td>
          </tr>
        ) : !!!data.data.extras.length ? (
          <tr className="bg-white lg:hover:bg-gray-100 flex lg:table-row flex-row lg:flex-row flex-wrap lg:flex-no-wrap mb-10 lg:mb-0">
            <td className="w-full lg:w-auto p-3 text-sky-600 text-center border border-b block lg:table-cell relative lg:static" colSpan={6}>
              Você ainda não possuí nenhum extra!
            </td>
          </tr>
        ) : data.data.extras.map((e: any, index: number) => (
          <tr key={index} className="lg:bg-white lg:hover:bg-gray-100 transition-colors flex lg:table-row flex-column lg:flex-row flex-wrap lg:flex-no-wrap mb-10 gap-0 lg:mb-0">
            <td className="w-full shadow rounded-lg lg:shadow-none lg:rounded-none lg:max-w-[200px] lg:w-auto text-xs font-semibold text-gray-600 text-center lg:border lg:border-b flex items-center lg:table-cell relative lg:static">
              <span className="lg:hidden rounded-s-lg min-w-[130px] max-w-[130px] h-full bg-blue-200 p-4 flex items-center justify-center text-xs font-bold uppercase">Descrição</span>
              <div className="w-full rounded-e-lg bg-white lg:bg-transparent flex p-4 justify-center h-full">
                {e.descricao}
              </div>
            </td>
            <td className="w-full shadow rounded-lg lg:shadow-none lg:rounded-none lg:w-auto text-gray-800 text-center lg:border lg:border-b flex justify-stretch items-center lg:table-cell relative lg:static">
              <span className="lg:hidden rounded-s-lg min-w-[130px] max-w-[130px] h-full bg-blue-200 p-4 flex items-center justify-center text-xs font-bold uppercase">Dia</span>
              <div className="w-full rounded-e-lg bg-white lg:bg-transparent flex p-4 justify-center h-full">
                {e.diaReferente.substring(0, 10).split('-').reverse().join('/')}
              </div>
            </td>
            <td className="w-full shadow rounded-lg lg:shadow-none lg:rounded-none lg:w-auto text-gray-800 lg:border lg:border-b text-center flex justify-stretch items-center lg:table-cell relative lg:static">
              <span className="lg:hidden rounded-s-lg min-w-[130px] max-w-[130px] h-full bg-blue-200 p-4 flex items-center justify-center text-xs font-bold uppercase">Horas totais</span>
              <div className="w-full rounded-e-lg bg-white lg:bg-transparent flex p-4 justify-center h-full">
                {`${Math.floor(e?.horas / 60)}h${e?.horas % 60}m`}
              </div>
            </td>
            <td className="w-full shadow rounded-lg lg:shadow-none lg:rounded-none lg:w-auto text-gray-800 lg:border lg:border-b text-center flex justify-stretch items-center lg:table-cell relative lg:static">
              <span className="lg:hidden rounded-s-lg min-w-[130px] max-w-[130px] h-full bg-blue-200 p-4 flex items-center justify-center text-xs font-bold uppercase">Valor recebido</span>
              <div className="w-full rounded-e-lg bg-white lg:bg-transparent flex p-4 justify-center h-full">
                <span className="rounded text-green-600 py-1 px-3 text-xs font-bold">{formatCurrency(e?.valor)}</span>
              </div>
            </td>
            <td className="w-full shadow rounded-lg lg:shadow-none lg:rounded-none lg:w-auto text-gray-800 lg:border lg:border-b text-center flex justify-stretch items-center lg:table-cell relative lg:static">
              <span className="lg:hidden rounded-s-lg min-w-[130px] max-w-[130px] h-full bg-blue-200 p-4 flex items-center justify-center text-xs font-bold uppercase">Descontado</span>
              <div className="w-full rounded-e-lg bg-white lg:bg-transparent flex p-4 justify-center h-full">
                <span className="rounded py-1 px-3 text-xs font-bold">{(!e?.descontado) ? 'Não descontou' : `${Math.floor(e?.horasDescontas / 60)}h${e?.horasDescontas % 60}m`}</span>
              </div>
            </td>
            <td className="w-full shadow rounded-lg lg:shadow-none lg:rounded-none lg:w-auto text-gray-800 lg:border lg:border-b text-center flex justify-stretch items-center lg:table-cell relative lg:static">
              <span className="lg:hidden rounded-s-lg min-w-[130px] max-w-[130px] h-full bg-blue-200 p-4 flex items-center justify-center text-xs font-bold uppercase">Ações</span>
              <div className="w-full rounded-e-lg bg-white lg:bg-transparent p-4 h-full flex items-center justify-center gap-4">
                <span onClick={() => {
                  setDataEdit(e)
                  setShow(true)
                }} className='text-sky-400 hover:text-sky-500 transition-colors cursor-pointer'>
                  <PencilIcon className='w-6 h-6' />
                </span>
                <span onClick={() => {
                  setDataEdit(e)
                  setShowDelete(true)
                }} className='text-sky-400 hover:text-sky-500 transition-colors cursor-pointer'>
                  <XCircleIcon className='w-6 h-6' />
                </span>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
      {dataEdit && (
        <ExtraModal
          Descontado={dataEdit.descontado}
          Dia={dataEdit.diaReferente.substring(0, 10)}
          Horas={Math.floor(dataEdit?.horas / 60)}
          HorasDescontadas={Math.floor(dataEdit?.horasDescontas / 60)}
          Minutos={dataEdit.horas % 60}
          Descricao={dataEdit.descricao}
          MinutosDescontados={dataEdit.horasDescontadas % 60}
          id={dataEdit.id}
          show={show}
          setShow={setShow}
        />
      )}
      {dataEdit && (
        <Dialog
          error
          disabledAutoClose
          icon={<TrashIcon className='w-7 h-7' />}
          isOpen={showDelete}
          setIsOpen={setShowDelete}
          title="Deseja excluir o extra?"
          subtitle={`Se clicar em confirmar, o seu extra será deletado.`}
          button={{
            testId: 'cancelar',
            children: 'Cancelar',
            type: 'error',
            onClick: () => {
              setDataEdit(null)
            },
            loading: sending
          }}
          secondButton={!sending ? {
            testId: 'remover',
            children: 'Remover',
            onClick: () => handleDelete(dataEdit.id)
          } : undefined}
        />
      )}
    </table>
  )
}
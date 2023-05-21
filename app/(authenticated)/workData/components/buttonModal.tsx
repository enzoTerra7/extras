'use client'
import Dialog from "@/components/Dialog";
import { Input } from "@/components/Input";
import api from "@/lib/api";
import ToastInstance from "@/lib/toastify";
import { Transition } from "@headlessui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react"
import { useForm } from "react-hook-form";
import * as yup from 'yup'

interface ButtonModalProps {
  children: React.ReactNode
}

const schema = yup.object({
  Horas: yup.number().required("Por favor, preencha este campo.").max(23, "Informe um valor de no máximo 23").typeError('Por favor, preencha com um valor válido.'),
  Minutos: yup.number().required("Por favor, preencha este campo.").max(59, "Informe um valor de no máximo 59").typeError('Por favor, preencha com um valor válido.'),
  Dia: yup.date().max(new Date(), "A data não pode ser superior a do dia de hoje").required('Por favor, preencha esse campo').typeError('Por favor, preencha com um valor válido.'),
  HorasDescontadas: yup.number().required("Por favor, preencha este campo.").max(23, "Informe um valor de no máximo 23").typeError('Por favor, preencha com um valor válido.').test(
    'HorasDescontadas', 
    'Horas descontadas não podem ser maiores que as horas trabalhadas',
    function (value) {
      const { Horas } = this.parent;
      return value <= Horas;
    }
  ),
  MinutosDescontados: yup.number().required("Por favor, preencha este campo.").max(59, "Informe um valor de no máximo 59").typeError('Por favor, preencha com um valor válido.').test(
    'MinutosDescontados', 
    'Os minutos não podem ser maior que os trabalhados',
    function (value) {
      const { Horas, Minutos, HorasDescontadas } = this.parent;
      if(Horas == HorasDescontadas) {
        return value <= Minutos
      } else {
        return true
      }
    }
  )

}).required()

export function ButtonModal(props: ButtonModalProps) {

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      Horas: 0,
      Minutos: 0,
      Dia: '',
      HorasDescontadas: 0,
      MinutosDescontados: 0,
    }
  });

  const [show, setShow] = useState(false);
  const [descontado, setDescontado] = useState(false);

  const onSubmit = async (values: {
    Horas: number;
    Minutos: number;
    Dia: string;
    HorasDescontadas: number;
    MinutosDescontados: number;
  }) => {
    try {
      const { data } = await api.post('/api/extras', {
        ...values,
        Descontado: descontado,
        HorasDescontadas: descontado ? 0 : values.HorasDescontadas,
        MinutosDescontados: descontado ? 0 : values.MinutosDescontados
      })
      setShow(false)
      reset()
      ToastInstance.success("Extra criado com sucesso. Em instantes os dados serão atualizados")
    } catch(e: any) {
      ToastInstance.error(e?.response?.data?.message)
    }
  }

  return (
    <>
      <button className="bg-blue-600 py-3 px-3 rounded font-semibold text-white text-sans text-sm max-w-xs hover:bg-blue-800 transition-colors focus:ring-2 ring-white flex justify-center items-center gap-3 w-full text-center" onClick={() => setShow(true)}>
        {props.children}
      </button>
      <Dialog
        button={{
          children: 'Enviar',
          testId: 'enviar',
          loading: isSubmitting,
          onClick: handleSubmit(onSubmit)
        }}
        isOpen={show}
        setIsOpen={setShow}
        title="Lançar horas"
        subtitle="Envie os dados das suas horas por cada dia"
      >
        <div className="flex w-full gap-4">
          <Input
            label="Horas"
            id="horas"
            type="number"
            input={{
              ...register('Horas'),
              min: 0,
              max: 23,
              placeholder: 'Informe as horas trabalhadas nesse dia'
            }}
            error={!!errors.Horas}
            errorMessage={errors.Horas?.message as string || ''}
          />
          <Input
            label="Minutos"
            id="minutos"
            type="number"
            input={{
              ...register('Minutos'),
              min: 0,
              max: 59,
              placeholder: 'Informe os minutos trabalhadas nesse dia'
            }}
            error={!!errors.Minutos}
            errorMessage={errors.Minutos?.message as string || ''}
          />
        </div>
        <Input
          label="Dia"
          id="dia"
          type="date"
          input={{
            ...register('Dia')
          }}
          error={!!errors.Dia}
          errorMessage={errors.Dia?.message as string || ''}
        />
        <div className="flex items-center gap-3">
          <input
            id="descontado"
            type="checkbox"
            className="w-6 h-6 rounded cursor-pointer"
            checked={descontado}
            onChange={() => setDescontado(!descontado)}
          />
          <label
            htmlFor="descontado"
            className="text-gray-700 font-bold text-sm cursor-pointer"
          >
            Descontou as horas?
          </label>
        </div>
        <Transition
          show={descontado}
          enter="transition ease-in-out duration-2000"
          enterFrom="scale-0"
          enterTo="scale-1"
          leave="transition ease-in-out duration-2000"
          leaveFrom="scale-1"
          leaveTo="scale-0"
        >
          <div className="flex w-full gap-4">
            <Input
              label="Horas"
              id="horasDescontadas"
              type="number"
              input={{
                ...register('HorasDescontadas'),
                min: 0,
                max: 24,
                placeholder: 'Informe as horas descontadas'
              }}
              error={!!errors.HorasDescontadas}
              errorMessage={errors.HorasDescontadas?.message as string || ''}
            />
            <Input
              label="Minutos"
              id="minutosDescontados"
              type="number"
              input={{
                ...register('MinutosDescontados'),
                min: 0,
                max: 60,
                placeholder: 'Informe os minutos descontados'
              }}
              error={!!errors.MinutosDescontados}
              errorMessage={errors.MinutosDescontados?.message as string || ''}
            />
          </div>
        </Transition>
      </Dialog>
    </>
  )

}
'use client'
import { useState } from 'react'
import { Input } from "@/components/Input";
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { Button } from "@/components/Button";
import Link from "next/link";
import axios from "axios";
import Dialog from "@/components/Dialog";
import { useRouter } from 'next/navigation';
import ToastInstance from '@/lib/toastify';

const schema = yup.object({
  Email: yup.string().email("Formato de email inválido").required("Por favor, preencha este campo."),
  Senha: yup.string().required("Por favor, preencha este campo.").matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#()-+.\/])[A-Za-z\d@$!%*?&]+$/, 'A senha deve conter pelo menos 1 letra minúscula, 1 maiúscula, 1 número e 1 simbolo.').min(8, 'A senha deve possuir pelo menos 8 caracteres.').max(30, 'A senha deve possuir no máximo 30 caracteres.'),
  Nome: yup.string().required("Por favor, preencha este campo").matches(/^(?=(?:.*[a-zA-ZÀ-ÖØ-öø-ÿ]){5})[a-zA-ZÀ-ÖØ-öø-ÿ\s]+$/, "O nome deve possuir pelo menos 5 letras. E não pode conter números ou símbolos."),
  ConfirmarSenha: yup.string().oneOf([yup.ref('Senha')], 'As senhas precisam ser iguais').required("Por favor, preencha este campo."),
  Salario: yup.number().positive('O valor inserido deve ser no mínimo 1').required("Por favor, preencha este campo.").typeError('Por favor, preencha com um valor válido.'),
  HorasDia: yup.number().min(1, 'O valor inserido deve ser no mínimo 1').max(24, 'O valor inserido deve ser no máximo 24').required("Por favor, preencha este campo.").typeError('Por favor, preencha com um número válido.'),
  DiasSemana: yup.number().min(1, 'O valor inserido deve ser no mínimo 1').max(7, 'O valor inserido deve ser no máximo 7').required("Por favor, preencha este campo.").typeError('Por favor, preencha com um número válido.'),
  CargaHoraria: yup.number().min(1, 'O valor inserido deve ser no mínimo 1').typeError('Por favor, preencha com um número válido.')
}).required()


export default function Register() {

  const router = useRouter()
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(schema)
  });

  const [open, setOpen] = useState(false)

  const onSubmit = async (values: any) => {
    try {
      const { data } = await axios.post('/api/user/register', {
        ...values
      })
      setOpen(true)
    } catch (e: any) {
      console.log(e)
      ToastInstance.error(e.response.data.message)
    }
  }

  return (
    <>
      <h4 className="font-bold text-center text-xl mb-4 sm:text-2xl text-sky-900">
        Faça seu cadastro
      </h4>
      <Input
        id="Email"
        label="Email"
        type="email"
        input={{
          placeholder: "Insira seu e-mail",
          ...register('Email')
        }}
        error={!!errors.Email}
        errorMessage={errors.Email?.message as string || ''}
      />
      <Input
        id="Nome"
        label="Nome"
        input={{
          placeholder: "Insira seu nome completo",
          ...register('Nome')
        }}
        error={!!errors.Nome}
        errorMessage={errors.Nome?.message as string || ''}
      />
      <div className="grid gap-4 grid-cols-2 w-full">
        <Input
          id="Senha"
          label="Senha"
          isPassword
          input={{
            placeholder: "Insira sua senha",
            ...register('Senha')
          }}
          error={!!errors.Senha}
          errorMessage={errors.Senha?.message as string || ''}
        />
        <Input
          id="ConfirmarSenha"
          label="Confirmar senha"
          isPassword
          input={{
            placeholder: "Repita sua senha",
            ...register('ConfirmarSenha')
          }}
          error={!!errors.ConfirmarSenha}
          errorMessage={errors.ConfirmarSenha?.message as string || ''}
        />
      </div>

      <div className="grid gap-4 grid-cols-3 w-full">
        <Input
          id="Salario"
          label="Salário (R$)"
          type="number"
          input={{
            ...register('Salario'),
            placeholder: "Insira sem os centavos",
            min: 1
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
            max: 7
          }}
          error={!!errors.DiasSemana}
          errorMessage={errors.DiasSemana?.message as string || ''}
        />
      </div>
      <Input
        id="cargaHoras"
        label="Carga Horária Mensal (Opcional)"
        type="number"
        input={{
          ...register('CargaHoraria'),
          placeholder: "Insira sua carga horária",
          min: 1
        }}
        error={!!errors.CargaHoraria}
        errorMessage={errors.CargaHoraria?.message as string || ''}
      />
      <Button
        testId="Cadastrar"
        className="mt-6"
        onClick={handleSubmit(onSubmit)}
        loading={isSubmitting}
      >
        Criar conta
      </Button>
      <Link href="/" as={'/'} className="text-center transition-all hover:text-slate-700 text-slate-500 text-sm cursor-pointer hover:font-bold hover:underline">
        Voltar
      </Link>
      <Dialog
        title="Usuário criado com sucesso"
        subtitle="Volte para a tela de login e aproveite o sistema"
        isOpen={open}
        setIsOpen={setOpen}
        button={{
          testId: 'irLogin',
          children: 'Ir para login',
          onClick: () => router.push('/')
        }}
        withoutOutsideClick
      />
    </>
  )
}
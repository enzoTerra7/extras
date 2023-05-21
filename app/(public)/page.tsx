'use client'
import { Input } from "@/components/Input";
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { Button } from "@/components/Button";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";
import ToastInstance from "@/lib/toastify";

const schema = yup.object({
  Email: yup.string().email("Formato de email inválido").required("Por favor, preencha este campo."),
  Senha: yup.string().required("Por favor, preencha este campo."),
}).required()

export default function Login() {
  const router = useRouter()
  const { register, handleSubmit, formState: { errors, isSubmitting }, setError } = useForm({
    resolver: yupResolver(schema)
  });

  const onSubmit = async (values: any) => {
    try {
      const { data } = await axios.post('/api/auth', {
        ...values
      })
      localStorage.setItem('token', data.body.accessToken)
      router.push('/dashboard')
    } catch (e: any) {
      console.log(e)
      ToastInstance.error(e?.response?.data?.message)
      setError('Senha', {
        message: e?.response?.data?.message
      })
    }
  }

  return (
    <>
      <h4 className="font-bold text-xl mb-4 sm:text-2xl text-sky-900">
        TITULO
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
      <Button
        testId="Logar"
        className="mt-6"
        onClick={handleSubmit(onSubmit)}
        loading={isSubmitting}
      >
        Login
      </Button>
      <Link href="/register" as={'/register'} className="text-center transition-all hover:text-slate-700 text-slate-500 text-sm cursor-pointer hover:font-bold hover:underline">
        Não possuí uma conta? <strong className="text-slate-700">Crie agora!</strong>
      </Link>
    </>
  )
}
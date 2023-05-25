import checkAuth from "@/middleware/checkAuth";
import { prisma } from "@/prisma/lib";
import { NextRequest, NextResponse } from "next/server";
import { atualizarCamposUsuario } from "../route";

export async function PUT(req: NextRequest, props: any) {
  const body = await req.json()
  try {
    const token = checkAuth(req)
    const { id } = props.params

    if (token instanceof NextResponse) {
      return token;
    }

    //@ts-expect-error
    const { valorHora } = token

    const horasTotal = (body.Horas * 60) + (body.Minutos)
    const horasTotalDescontado = (body.HorasDescontadas * 60) + (body.MinutosDescontados)

    await prisma.extras.update({
      where: {
        id: Number(id)
      },
      data: {
        horas: horasTotal,
        valor: Number(((valorHora) * ((horasTotal - horasTotalDescontado) / 60)).toFixed(2)),
        descontado: body.Descontado,
        diaReferente: body.Dia,
        horasDescontas: horasTotalDescontado
      }
    })

    await prisma.$disconnect()
    
    //@ts-expect-error
    atualizarCamposUsuario(token.id)
    
    await prisma.$disconnect()

    return NextResponse.json({
      message: 'Extra atualizado com sucesso'
      // user: user
    }, {
      status: 200
    })
  } catch (e: any) {
    console.log(e)
    await prisma.$disconnect()
    return NextResponse.json({ message: "Ocorreu um erro. Tente novamente mais tarde", error: e }, {
      status: 500
    })
  }
}
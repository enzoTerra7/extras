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

    const user = await prisma.user.findUnique({
      where: {
        //@ts-expect-error
        id: token.id
      }, 
      select: {
        valorHora: true
      }
    })
    
    await prisma.$disconnect()

    if(user == null) {
      return NextResponse.json({ message: "Usuário não encontrado" }, {
        status: 400
      })
    }

    const valorHora = user.valorHora

    const horasTotal = (body.Horas * 60) + (body.Minutos)
    const horasTotalDescontado = (body.HorasDescontadas * 60) + (body.MinutosDescontados)

    await prisma.extras.update({
      where: {
        id: Number(id)
      },
      data: {
        horas: horasTotal,
        valor: Number(((valorHora * 1.7) * ((horasTotal - horasTotalDescontado) / 60)).toFixed(2)),
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

export async function DELETE(req: NextRequest, props: any) {
  try {
    const token = checkAuth(req)
    const { id } = props.params

    if (token instanceof NextResponse) {
      return token;
    }

    await prisma.extras.delete({
      where: {
        id: Number(id)
      }
    })

    await prisma.$disconnect()

    //@ts-expect-error
    atualizarCamposUsuario(token.id)

    await prisma.$disconnect()

    return NextResponse.json({
      message: 'Extra deletado com sucesso'
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
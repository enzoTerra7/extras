import checkAuth from "@/middleware/checkAuth";
import { prisma } from "@/prisma/lib";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json()
  console.log('entrou na request')
  try {
    const token = checkAuth(req)

    if (token instanceof NextResponse) {
      console.log('entrou no token')
      return token;
    }

    //@ts-expect-error
    const { valorHora } = token

    const horasTotal = (body.Horas * 60) + (body.Minutos)
    const horasTotalDescontado = (body.HorasDescontadas * 60) + (body.MinutosDescontados)

    console.log('vai criar o extra')
    console.log('valor', valorHora)
    console.log('horasTotal', horasTotal, 'horas', body.Horas, 'Minutos', body.Minutos)
    console.log('horasTotalDescontado', horasTotalDescontado, 'HorasDescontadas', body.HorasDescontadas, 'MinutosDescontados', body.MinutosDescontados)

    const extra = await prisma.extras.create({
      data: {
        horas: horasTotal,
        valor: Number(((valorHora) * ((horasTotal - horasTotalDescontado) / 60)).toFixed(2)),
        descontado: body.Descontado,
        diaReferente: body.Dia,
        horasDescontas: horasTotalDescontado,
        //@ts-expect-error
        user: { connect: { id: token.id } }
      }
    })
    
    await prisma.$disconnect()

    console.log('criou o extra', extra)

    const user = await prisma.user.update({
      where: {
        //@ts-expect-error
        id: token?.id
      },
      data: {
        totalGanho: {
          increment: extra.valor
        },
        totalHoras: {
          increment: extra.horas
        },
        totalHorasDescontadas: {
          increment: extra.horasDescontas || 0
        }
      }
    })

    await prisma.$disconnect()

    return NextResponse.json({
      message: 'Extra criado com sucesso'
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
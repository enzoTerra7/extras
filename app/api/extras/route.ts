import checkAuth from "@/middleware/checkAuth";
import { prisma } from "@/prisma/lib";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json()
  try {
    const token = checkAuth(req)

    if (token instanceof NextResponse) {
      return token;
    }

    //@ts-expect-error
    const { valorHora } = token

    const horasTotal = (body.horas * 60) + (body.minutos)

    await prisma.extras.create({
      horas: horasTotal,
      valor: (valorHora * 60) / horasTotal
  //     horas          Int
  // valor          Int
  // descontado     Boolean
  // diaReferente   DateTime
  // diasDescontado Int?
  // user           User     @relation(fields: [userId], references: [id])
  // userId         Int
    })

  const user = await prisma.user.update({
    where: {
      //@ts-expect-error
      id: token?.id
    },
    select: {
      diasSemana: true,
      horasDia: true,
      salario: true,
      totalGanho: true,
      totalHoras: true,
    }
  })

  await prisma.$disconnect()

  return NextResponse.json({
    message: 'Usuário encontrado com sucesso',
    user: user
  }, {
    status: 200
  })
} catch (e: any) {
  await prisma.$disconnect()
  return NextResponse.json({ message: "Ocorreu um erro. Tente novamente mais tarde", error: e }, {
    status: 500
  })
}
}
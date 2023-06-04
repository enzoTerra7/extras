import bcrypt from 'bcryptjs';
import { prisma } from "@/prisma/lib";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json()

  const hashedPassword = await bcrypt.hash(body.Senha, 10); 

  try {
    const data = await prisma.user.create({
      data: {
        email: body.Email,
        senha: hashedPassword,
        nome: body.Nome,
        salario: body.Salario,
        horasDia: body.HorasDia,
        diasSemana: body.DiasSemana,
        valorHora: body.Salario / ((body.HorasDia * body.DiasSemana) * 5)
      }
    })

    await prisma.$disconnect()

    return NextResponse.json({ message: 'Usuário criado com sucesso', body: { user: {
      email: data.email,
      salario: data.salario,
      horasDia: data.horasDia,
      diasSemana: data.diasSemana,
      id: data.id
    } } })
  } catch(e: any) {
    await prisma.$disconnect()
    if(e.meta.target.includes("email")) {
      return NextResponse.json({ message: "O email já foi utilizado"}, {
        status: 404
      })
    }
    return NextResponse.json({ message: "Ocorreu um erro. Tente novamente mais tarde", error: e}, {
      status: 500
    })
  }
}
import { prisma } from "@/prisma/lib";
import { NextRequest, NextResponse } from "next/server";
import { createAccessToken } from "@/utils/usualFunction";
// import cookie from 'cookie'

export async function POST(req: NextRequest) {
  const body = await req.json()

  try {
    const data = await prisma.user.findUnique({
      where: {
        email: body.Email
      },
      select: {
        email: true,
        id: true,
        nome: true,
        salario: true,
        senha: true,
      },
    })
    if (!data || !(data.senha == body.Senha)) {
      throw new Error()
    }
    await prisma.$disconnect()

    // sendRefreshToken(req, createRefreshToken(data));
    const accessToken = createAccessToken(data)
    return NextResponse.json({ message: 'Usuário encontrado com sucesso.', body: { user: data, accessToken: accessToken} })
  } catch (e) {
    console.log(e)
    await prisma.$disconnect()
    return NextResponse.json({ message: 'Email e senha inválidas.' }, {
      status: 404
    })
  }
}
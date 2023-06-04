import { prisma } from "@/prisma/lib";
import { NextRequest, NextResponse } from "next/server";
import { createAccessToken } from "@/utils/usualFunction";
import bcrypt from 'bcryptjs';

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
    
    if (!data) {
      throw new Error()
    }
    await prisma.$disconnect()
    
    const isPasswordValid = await bcrypt.compare(body.Senha, data.senha)

    if(!isPasswordValid) {
      return NextResponse.json({ message: 'Email ou senha inválidas.' }, {
        status: 404
      })
    }
    // sendRefreshToken(req, createRefreshToken(data));
    const accessToken = createAccessToken(data)
    return NextResponse.json({ message: 'Usuário encontrado com sucesso.', body: { user: data, accessToken: accessToken} })
  } catch (e) {
    console.log(e)
    await prisma.$disconnect()
    return NextResponse.json({ message: 'Credenciais inválidas', erro: e }, {
      status: 500
    })
  }
}
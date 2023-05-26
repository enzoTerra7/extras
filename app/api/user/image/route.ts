import checkAuth from "@/middleware/checkAuth";
import { prisma } from "@/prisma/lib";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const token = checkAuth(req)

    if (token instanceof NextResponse) {
      return token;
    }

    const user = await prisma.user.findUnique({
      where: {
        //@ts-expect-error
        id: token?.id
      },
      select: {
        imagem: true
      }
    })

    await prisma.$disconnect()

    if (user == null) {
      return NextResponse.json({
        message: 'Usuário não encontrado.'
      }, {
        status: 400
      })
    }

    return NextResponse.json({
      message: 'Imagem encontrada com sucesso',
      imagem: user.imagem
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

export async function PUT(req: NextRequest) {
  const body = await req.json()
  try {
    const token = checkAuth(req)

    if (token instanceof NextResponse) {
      return token;
    }

    const data = await prisma.user.update({
      where: {
        //@ts-expect-error
        id: token?.id
      },
      data: {
        imagem: body.Imagem
      }
    })

    await prisma.$disconnect()

    return NextResponse.json({ message: 'Imagem atualizada com sucesso', body: { user: data } })
  } catch (e: any) {
    await prisma.$disconnect()
    return NextResponse.json({ message: "Ocorreu um erro. Tente novamente mais tarde", error: e }, {
      status: 500
    })
  }
}
import { prisma } from "@/prisma/lib";
import { NextRequest, NextResponse } from "next/server";
import { sign } from 'jsonwebtoken';
// import cookie from 'cookie'

export async function POST(req: NextRequest) {
  const body = await req.json()

  try {
    const data = await prisma.user.findUnique({
      where: {
        email: body.Email
      }
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
    return NextResponse.json({ message: 'Credenciais inválidas.' }, {
      status: 404
    })
  }
}

export const createAccessToken = (user: any) => {
  return sign(
    { ...user },
    process.env.ACCESS_TOKEN_SECRET || 'tokenSecret', {
    expiresIn: '15m'
  });
};

// export const createRefreshToken = (user: any) => {
//   return sign(
//     { ...user },
//     process.env.REFRESH_TOKEN_SECRET || 'refreshTokenSecret', {
//     expiresIn: "7d"
//   }
//   );
// };

// export const sendRefreshToken = (req: NextRequest, token: string) => {
//   req.headers.set('Set-Cookie', cookie.serialize('refreshToken', token, {
//     httpOnly: true,
//     maxAge: 60 * 60 * 24 * 7,
//     path: '/'
//   }))
// };
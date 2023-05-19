import { NextRequest, NextResponse } from "next/server";
import { verify } from 'jsonwebtoken';

const checkAuth = (handler: any) => {
  return async (req: NextRequest, res: NextResponse) => {
    try {
      const authorization = req.headers.get("Authorization")

      if (!authorization) throw new Error("not authenticated")

      console.log(authorization)
      const token = authorization.split(" ")[1]
      verify(token, process.env.ACCESS_TOKEN_SECRET || '');
      return handler(req, res)
    } catch (e) {
      console.log(e)
      return NextResponse.json({ message: 'Token inválido' }, {
        status: 401
      })
    }
  }
}

export default checkAuth
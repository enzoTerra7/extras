import { NextRequest, NextResponse } from "next/server";
import { verify } from 'jsonwebtoken';

const checkAuth = (req: NextRequest) => {
  try {
    const authorization = req.headers.get("Authorization")
    if (!authorization) throw new Error("not authenticated")
    const token = authorization.split(" ")[1]
    const decode = verify(token, process.env.ACCESS_TOKEN_SECRET || '');
    return decode
  } catch(e: any) {
    return NextResponse.json({ message: "Token expirado" }, {
      status: 401
    })
  }
}

export default checkAuth
import { sign } from 'jsonwebtoken';

export function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export const createAccessToken = (user: any) => {
  return sign(
    { ...user },
    process.env.ACCESS_TOKEN_SECRET || 'tokenSecret', {
    expiresIn: '15m'
  });
};

export const createRefreshToken = (user: any) => {
  return sign(
    { ...user },
    process.env.REFRESH_TOKEN_SECRET || 'refreshTokenSecret', {
    expiresIn: "7d"
  }
  );
};

// export const sendRefreshToken = (req: NextRequest, token: string) => {
//   req.headers.set('Set-Cookie', cookie.serialize('refreshToken', token, {
//     httpOnly: true,
//     maxAge: 60 * 60 * 24 * 7,
//     path: '/'
//   }))
// };
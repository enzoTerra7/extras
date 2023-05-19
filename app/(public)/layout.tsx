import './globals.css'
import "toastify-js/src/toastify.css"

import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Teste',
  description: 'Aplicativo criado por enzo',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-br">
      <body className={`bg-sky-200 ${inter.className}`}>
        <div className="flex h-screen w-full items-center justify-center">
          <div className="flex p-6 flex-col w-80 md:w-[40vw] min-h-[300px] justify-center shadow-2xl items-center gap-4 rounded bg-white">
            {children}
          </div>
        </div>
      </body>
    </html>
  )
}

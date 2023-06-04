import './globals.css'
import "toastify-js/src/toastify.css"
import dynamic from 'next/dynamic';

import { Inter } from 'next/font/google'

const Navbar = dynamic(() => import('@/components/Navbar'));
const Sidebar = dynamic(() => import('@/components/Sidebar'));

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
      <body className={`bg-sky-50 ${inter.className}`}>
        <div className="min-h-full flex flex-col">
          <Sidebar />
          <Navbar />
          <main className="flex-1 p-8 flex flex-col w-full gap-4">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}

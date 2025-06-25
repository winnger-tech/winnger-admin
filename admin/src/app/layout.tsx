import React from 'react'
import './globals.css'
import { Inter } from 'next/font/google'
import { AuthProvider } from '@/context/AuthContext'
import ExtensionHandler from '@/components/ExtensionHandler'
import { QueryProvider } from '@/providers/QueryProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Winnger Admin',
  description: 'Admin dashboard for Winnger platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.className}>
      <body className="bg-gray-50">
        <ExtensionHandler />
        <QueryProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </QueryProvider>
        <div id="modal-root" />
      </body>
    </html>
  );
}
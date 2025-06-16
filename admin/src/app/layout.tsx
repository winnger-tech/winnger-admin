import React from 'react'
import './globals.css'
import { Inter } from 'next/font/google'
import { AuthProvider } from '@/context/AuthContext'
import ExtensionHandler from '@/components/ExtensionHandler'

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
        <AuthProvider>
          {children}
        </AuthProvider>
        <div id="modal-root" />
      </body>
    </html>
  );
}
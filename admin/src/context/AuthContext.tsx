'use client'
import React, { createContext, useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface AuthContextType {
  isAuthenticated: boolean
  user: any | null
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<any | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in on mount
    const token = localStorage.getItem('auth_token')
    if (token) {
      setIsAuthenticated(true)
      // TODO: Fetch user data
    }
  }, [])

  const login = async (email: string, password: string) => {
    try {
      // Format the base URL correctly
      const baseUrl = process.env.NEXT_PUBLIC_URL 
        ? process.env.NEXT_PUBLIC_URL.endsWith('/') 
          ? process.env.NEXT_PUBLIC_URL.slice(0, -1) 
          : process.env.NEXT_PUBLIC_URL
        : 'http://localhost:5000';
      
      const response = await fetch(`${baseUrl}/api/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok) {
        console.log('Login successful:', data);
        localStorage.setItem('auth_token', data.token)
        setIsAuthenticated(true)
        setUser(data.user || data.data) // Handle both response formats
        router.push('/dashboard')
        return { success: true }
      } else {
        console.error('Login failed:', data);
        return { success: false, message: data.message || 'Login failed' }
      }
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, message: 'Network error occurred' }
    }
  }

  const logout = () => {
    localStorage.removeItem('auth_token')
    setIsAuthenticated(false)
    setUser(null)
    router.push('/login')
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
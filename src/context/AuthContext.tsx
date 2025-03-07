import React, {createContext, ReactNode, useContext, useEffect, useState } from 'react'
import { Role, User, AuthState } from "./types.ts";
import axios from 'axios'

interface AuthContextTypes extends AuthState {
  login: (userInput: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextTypes | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem("user")
    return savedUser ? JSON.parse(savedUser) : null
  })

  const [userRole, setUserRole] = useState<Role | null>(() => {
    const savedRole = localStorage.getItem("userRole")
    return savedRole ? JSON.parse(savedRole) : null
  })

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem("token")
  })

  useEffect(() => {
    if (user && token) {
      localStorage.setItem("user", JSON.stringify(user))
      localStorage.setItem("userRole", user.role)
      localStorage.setItem("token", token)

      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    }
    else {
      localStorage.removeItem("user")
      localStorage.removeItem("userRole")
      localStorage.removeItem("token")
    }

    delete axios.defaults.headers.common['Authorization']
  }, [user, token])

  const login = async (userInput: string, password: string): Promise<void> => {
    try {
      
    }
    catch (error) {

    }
  }
}


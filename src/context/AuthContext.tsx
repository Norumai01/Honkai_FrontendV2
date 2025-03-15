import React, {createContext, ReactNode, useContext, useEffect, useState } from 'react'
import { Role, User, AuthState } from "./types.ts";
import axios from 'axios'
import {API_URL, getAuthHeader} from "../services/api.ts";

interface AuthContextTypes extends AuthState {
  login: (userInput: string, password: string) => Promise<void>
  logout: () => void
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
    return savedRole ? savedRole as Role : null
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
      const response = await axios.post<{ token: string; user: User }>(
        `${API_URL}/auth/login`,
        {
          userInput,
          password,
        }
      )

      if (response.status === 200) {
        const { user, token } = response.data
        if (token && user) {
          setUser(user)
          setToken(token)
          setUserRole(user.role)
        }
        else {
          throw new Error("Login Failed: Invalid credentials")
        }
      }
      else {
        throw new Error("Login Failed.")
      }
    }
    catch (error) {
      console.error("Login failed", error)
      throw error
    }
  }

  const logout = async (): Promise<void> => {
    try {
      const token: string | null = localStorage.getItem("token")

      if (token) {
        await axios.post(`${API_URL}/auth/logout`, null, {
          headers: {
            ...getAuthHeader(token),
          }
        })
      }
    }
    catch (error) {
      console.error("Logout Failed", error)
    }
    finally {
      localStorage.removeItem("user")
      localStorage.removeItem("userRole")
      localStorage.removeItem("token")

      delete axios.defaults.headers.common['Authorization']
    }
  }

  return (
    <AuthContext.Provider value={{ user, userRole, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = (): AuthContextTypes => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}


import React, {createContext, ReactNode, useContext, useEffect, useState } from 'react'
import { Role, User, AuthState } from "./types.ts";
import axios from 'axios'
import { createAPI } from "../services/api.ts";

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

  // Remove
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem("token")
  })

  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(() => {
    return localStorage.getItem("user") !== null
  })

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user))
      localStorage.setItem("userRole", user.role)

      axios.defaults.withCredentials = true
    }
    else {
      localStorage.removeItem("user")
      localStorage.removeItem("userRole")
    }
  }, [user])

  const login = async (userInput: string, password: string): Promise<void> => {
    try {
      const response = await createAPI.post<{ user: User }>(
        "/auth/login",
        {
          userInput,
          password,
        },
      )

      const { user } = response.data

      if (!user) {
        throw new Error("Login failed: Missing credentials")
      }

      setUser(user)
      setUserRole(user.role)
      setIsAuthenticated(true)

      axios.defaults.withCredentials = true
    }
    catch (error) {
      console.error("Login failed", error)

      if (axios.isAxiosError(error) && error.response) {
        switch (error.response.status) {
          case 401:
            throw new Error("Unauthorized: Invalid credentials.")
          case 400:
            throw new Error("Login failed: Error has occurred.")
          default:
            throw new Error(`Login failed: Error code ${error.response.status}`)
        }
      }

      throw error
    }
  }

  const logout = async (): Promise<void> => {
    try {
      await createAPI.post("/auth/logout", null)
    }
    catch (error) {
      console.error("Logout Failed", error)
    }
    finally {
      localStorage.removeItem("user")
      localStorage.removeItem("userRole")

      setUser(null)
      setUserRole(null)
      setIsAuthenticated(false)
    }
  }

  return (
    <AuthContext.Provider value={{ user, userRole, isAuthenticated, login, logout }}>
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


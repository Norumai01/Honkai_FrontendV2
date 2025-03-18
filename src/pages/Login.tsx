import React, { ChangeEvent, FormEvent, useState } from "react";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.tsx";

interface LoginProps {
  userInput: string;
  password: string;
}

export default function Login(): React.ReactElement {
  const [formData, setFormData] = useState<LoginProps>({
    userInput: "",
    password: "",
  })

  const navigate: NavigateFunction = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth()

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }
  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    try {
      if (formData.userInput === "" || formData.userInput === null) {
        setError("Username or Email is required");
        return;
      }

      if (formData.password === "" || formData.password === null ) {
        setError("Please enter a valid password");
        return;
      }

      await login(formData.userInput, formData.password)

      navigate("/")
    }
    catch (error) {
      console.error("Login failed", error)
    }
  }

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center">
      <div className="w-full max-w-md">
        <form className="flex flex-col space-y-6" onSubmit={handleSubmit}>
          <label className={`text-white text-3xl font-bold text-center ${error ? "mb-10" : "mb-20"}`}>
            Login
          </label>
          {error !== null && (
            <p className="text-red-400 text-sm text-center font-semibold mb-10">
              {error}
            </p>
          )}
          <input
            type="text"
            name="userInput"
            value={formData.userInput}
            onChange={handleChange}
            placeholder="Username"
            required
            className="block w-full bg-white text-black placeholder-gray-300 text-base"
          />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            required
            className="block w-full bg-white text-black placeholder-gray-300 text-base"
          />
          <button
            type="submit"
            className="p-3 bg-green-600 rounded-2xl text-white cursor-pointer hover:bg-green-400 focus:outline-none"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  )
}
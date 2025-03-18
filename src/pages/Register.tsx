import React, {ChangeEvent, FormEvent, useState} from "react";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { createAPI } from "../services/api.ts";

interface RegisterProps {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function Register(): React.ReactElement {
  const [formData, setFormData] = useState<RegisterProps>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const navigate: NavigateFunction = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (formData.username === "" || formData.username === null) {
      setError("Username is required");
      return
    }

    if (formData.email === "" || formData.email === null) {
      setError("Email is required");
      return
    }

    if (formData.password === "" || formData.password === null) {
      setError("Password is not valid");
      return
    }

    if (formData.confirmPassword !== formData.password) {
      setError("Passwords do not match")
      return
    }

    const formDataObj = new FormData()
    formDataObj.append("username", formData.username)
    formDataObj.append("email", formData.email)
    formDataObj.append("password", formData.password)

    createAPI
      .post(`/auth/register`, formDataObj)
      .then(() => {
        navigate("/login");
      })
      .catch((error: Error) => {
        console.log("Registration failed: ", error);
        alert("Registration failed. Please try again later.");
      })
  }

  return (
    <div className="min-h-screen bg-black flex justify-center items-center">
      <div className="w-full max-w-lg mx-auto">
        <form className="flex flex-col space-y-6" onSubmit={handleSubmit}>
          <label className={`text-white text-3xl font-bold text-center ${error ? "mb-10" : "mb-20"}`}>
            Create an Account
          </label>
          {error !== null && (
            <p className="text-red-400 text-sm text-center font-semibold mb-10">
              {error}
            </p>
          )}
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Username"
            required
            className="block w-full bg-white text-black placeholder-gray-300 text-base"
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
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
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm Password"
            required
            className="block w-full bg-white text-black placeholder-gray-300 text-base"
          />
          <button
            type="submit"
            className="p-3 bg-green-600 rounded-2xl text-white cursor-pointer hover:bg-green-400 focus:outline-none"
          >
            Sign-Up
          </button>
        </form>
      </div>
    </div>
  )
}
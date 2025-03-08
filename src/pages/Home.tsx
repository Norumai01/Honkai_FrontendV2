import { useAuth } from "../context/AuthContext.tsx";
import {NavigateFunction, useNavigate} from "react-router-dom";

function Home() {
  const { user, userRole, logout } = useAuth()
  const navigate: NavigateFunction = useNavigate()
  const onClickLogout = (): void => {
    logout()
    navigate("/login")
  }


  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="w-full max-w-lg text-lg text-white">
        {user ? (
          <div className="flex flex-col">
            {`Hi, ${userRole === "ADMIN" ? "Admin" : user.username}`}
            <button
              id="logout"
              onClick={() => onClickLogout()}
              className="p-3 bg-green-600 rounded-2xl text-white cursor-pointer hover:bg-green-400 focus:outline-none"
            >
              Logout
            </button>
          </div>
        ) : (
          <div>
            Log in to continue
          </div>
        )}
      </div>
    </div>
  )
}

export default Home;
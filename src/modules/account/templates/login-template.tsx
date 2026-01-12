"use client"

import { useState } from "react"

import Register from "@modules/account/components/register"
import Login from "@modules/account/components/login"

export enum LOGIN_VIEW {
  SIGN_IN = "sign-in",
  REGISTER = "register",
}

const LoginTemplate = ({ countryCode }: { countryCode: string }) => {
  const [currentView, setCurrentView] = useState("sign-in")

  return (
    <div className="w-full flex justify-center items-center py-24 bg-bronco-gray dark:bg-terminal-black min-h-[calc(100vh-80px)] transition-colors duration-200">
      <div className="bg-terminal-panel p-8 md:p-12 border border-terminal-border w-full max-w-lg transition-all duration-300">
        {currentView === "sign-in" ? (
          <Login setCurrentView={setCurrentView} countryCode={countryCode} />
        ) : (
          <Register setCurrentView={setCurrentView} countryCode={countryCode} />
        )}
      </div>
    </div>
  )
}

export default LoginTemplate

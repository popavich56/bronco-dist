"use client"

import Login from "@modules/account/components/login"

export enum LOGIN_VIEW {
  SIGN_IN = "sign-in",
  REGISTER = "register",
}

const LoginTemplate = ({ countryCode }: { countryCode: string }) => {
  return (
    <div className="w-full flex justify-center items-center py-24 bg-businessx-gray dark:bg-terminal-black min-h-[calc(100vh-80px)] transition-colors duration-200">
      <div className="bg-terminal-panel p-8 md:p-12 border border-terminal-border w-full max-w-lg transition-all duration-300">
        <Login countryCode={countryCode} />
      </div>
    </div>
  )
}

export default LoginTemplate

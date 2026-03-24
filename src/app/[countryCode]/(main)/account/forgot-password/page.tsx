import { Metadata } from "next"
import ForgotPassword from "@modules/account/components/forgot-password"

export const metadata: Metadata = {
  title: "Forgot Password | Bronco Distribution",
  description: "Reset your Bronco Distribution account password.",
}

export default function ForgotPasswordPage() {
  return (
    <div className="w-full flex justify-center items-center py-24 bg-businessx-gray dark:bg-terminal-black min-h-[calc(100vh-80px)] transition-colors duration-200">
      <div className="bg-terminal-panel p-8 md:p-12 border border-terminal-border w-full max-w-lg transition-all duration-300">
        <ForgotPassword />
      </div>
    </div>
  )
}

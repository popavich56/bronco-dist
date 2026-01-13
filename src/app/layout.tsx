import { getBaseURL } from "@lib/util/env"
import { Metadata } from "next"
import "styles/globals.css"
import { ThemeProvider } from "components/providers/theme-provider"
import { Outfit, Nunito } from "next/font/google"

const outfit = Outfit({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["700", "800"], // Bold for display
})

const nunito = Nunito({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "600", "800"], // Regular, SemiBold, ExtraBold
})

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${outfit.variable} ${nunito.variable} antialiased font-body bg-businessx-white text-businessx-black dark:bg-[#0a0a0a] dark:text-[#ededed] transition-colors duration-200`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <main className="relative">{props.children}</main>
        </ThemeProvider>
      </body>
    </html>
  )
}

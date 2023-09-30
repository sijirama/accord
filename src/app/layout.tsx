import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ClerkProvider } from "@clerk/nextjs"
import { ThemeProvider } from '@/components/providers/theme-provider'

const font = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: "Yad - this isn't your usual discord clone",
    description: 'Created by Sijirama!',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <ClerkProvider>
            <html lang="en" suppressHydrationWarning>
                <body className={font.className}>
                    <ThemeProvider
                        attribute='class'
                        defaultTheme='dark'
                        //forcedTheme='light'
                        enableSystem={false}
                        storageKey='discord-theme'
                    >
                        {children}
                    </ThemeProvider>
                </body>
            </html>
        </ClerkProvider>
    )
}

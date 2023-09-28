import '@/app/globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: "Authentication for Yad",
    description: 'Identify yourself boy!',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="bg-slate-400 h-full">{children}</div>
    )
}

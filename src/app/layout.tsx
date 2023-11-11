import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import { cn } from '@/lib/utils';

import { ModalProvider } from '@/components/providers/modal-provider';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { SocketProvider } from '@/components/providers/socket-provider';

import { Toaster } from '@/components/ui/toaster';
import { QueryProvider } from '@/components/providers/query-provider';

const font = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: "Accord - this isn't your usual discord clone",
    description: 'Created by Sijirama!',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ClerkProvider>
            <html lang="en" suppressHydrationWarning>
                <body
                    className={cn(
                        font.className,
                        'bg-slate-300 dark:bg-gray-900'
                    )}
                >
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="dark"
                        //forcedTheme='light'
                        enableSystem={false}
                        storageKey="discord-theme"
                    >
                        <SocketProvider>
                            <ModalProvider />
                            <QueryProvider>{children}</QueryProvider>
                        </SocketProvider>
                    </ThemeProvider>
                    <Toaster />
                </body>
            </html>
        </ClerkProvider>
    );
}

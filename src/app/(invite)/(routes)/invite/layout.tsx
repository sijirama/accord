import '@/app/globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Invite to server',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <div className="h-full">{children}</div>;
}

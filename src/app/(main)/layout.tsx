import '@/app/globals.css'
import NavigationSidebar from '@/components/custom/navigation/NavigationSidebar'
import type { Metadata } from 'next'

// export const metadata: Metadata = {
//     title: "Authentication for Yad",
//     description: 'Identify yourself boy!',
// }

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {

    return (
        <div className='h-full'>
            <div className='hidden md:flex h-full w-[72px] z-30 flex-col fixed inset-y-0'>
                <NavigationSidebar />
            </div>
            <main className='md:pl-[72px] h-full'>
                {children}
            </main>
        </div>
    )
}

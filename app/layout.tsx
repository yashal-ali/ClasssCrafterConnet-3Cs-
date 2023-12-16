import type { Metadata } from 'next'
import { Open_Sans } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { cn } from '@/lib/utils'
const open_san = Open_Sans({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Class Crafter Connect',
  description: 'Generated by create next ap',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={cn(open_san.className,"bg-white dark:bg-[#313338]")}>
        <ThemeProvider
        attribute='class'
        defaultTheme='dark'
        enableSystem={false}
        storageKey='theme'
        >
          {children}
        </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}

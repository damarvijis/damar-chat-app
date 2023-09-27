import './globals.css'
import type { Metadata } from 'next'
import { Open_Sans } from 'next/font/google'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { ClerkProvider } from '@clerk/nextjs';
import { cn } from '@/lib/utils';
import { ModalProvider } from '@/components/providers/modal-provider';
import { SocketProvider } from '@/components/providers/socket-provider';
import { QueryProvider } from '@/components/providers/query-provider';

const font = Open_Sans({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Damar Discord Clone',
  description: 'Damar Discord Clone',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          storageKey="damar-discord-theme"
        >
          <SocketProvider>
            <ModalProvider />
            <QueryProvider>
              <body className={cn(font.className, "bg-white dark:bg-[#313338]")}>{children}</body>
            </QueryProvider>
          </SocketProvider>
        </ThemeProvider>
      </html>
    </ClerkProvider>
  )
}

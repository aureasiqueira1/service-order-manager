import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Pipelore - Gestão de Ordens de Serviço',
  description: 'Sistema de gestão de condomínios para administração de ordens de serviço de reparo',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}

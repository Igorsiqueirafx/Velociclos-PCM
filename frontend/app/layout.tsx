import "./globals.css";

export const metadata = {
  title: "Velociclos PCM - Admin",
  description: "Painel administrativo Velociclos PCM",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>
        {children}
      </body>
    </html>
  );
}

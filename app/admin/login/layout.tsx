import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login - Painel Admin",
  description: "Acesso ao painel de adm da Zona Street.",
  robots: { index: false, follow: false },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

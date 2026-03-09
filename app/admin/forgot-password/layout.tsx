import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Recuperar Senha - Painel Admin",
  description: "Recupere sua senha de acesso ao painel de administração.",
  robots: { index: false, follow: false },
};

export default function ForgotPasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

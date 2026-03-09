import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Redefinir Senha - Painel Admin",
  description: "Redefina sua senha de acesso ao painel de administração.",
  robots: { index: false, follow: false },
};

export default function ResetPasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

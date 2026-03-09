import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Meus Favoritos",
  description: "Seus produtos favoritos da Zona Street salvos localmente.",
  robots: { index: false, follow: false },
};

export default function FavoritosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

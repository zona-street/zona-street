import { cn } from "@/lib/utils";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";

interface PageLayoutProps {
  children: React.ReactNode;
  mainClassName?: string;
}

export function PageLayout({ children, mainClassName }: PageLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Navbar />
      <main
        className={cn(
          "mx-auto flex-grow max-w-7xl w-full px-4 py-12 sm:px-6 lg:px-8",
          mainClassName,
        )}
      >
        {children}
      </main>
      <Footer />
    </div>
  );
}

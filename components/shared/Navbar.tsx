"use client";

import Link from "next/link";
import { Menu, User } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { CartSheet } from "@/components/shared/CartSheet";
import { useFavorites } from "@/lib/hooks/useFavorites";
import { Heart } from "lucide-react";

const categories = [
  { name: "Camisetas", href: "/categorias/camisetas" },
  { name: "Moletons", href: "/categorias/moletons" },
  { name: "Calças", href: "/categorias/calcas" },
  { name: "Acessórios", href: "/categorias/acessorios" },
];

const newDrops = [{ name: "Ver Todos os Lançamentos", href: "/lancamentos" }];

export function Navbar() {
  const { count } = useFavorites();

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white shadow-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <Image
            src="/logo.png"
            alt="Zona Street Logo"
            width={500}
            height={500}
            className="h-28 w-auto  "
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center space-x-6 md:flex">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-sm font-medium uppercase tracking-wide text-gray-900">
                  Categorias
                </NavigationMenuTrigger>
                <NavigationMenuContent className="border border-gray-200 bg-white/40 shadow-lg">
                  <ul className="grid w-100 gap-3 p-4 md:w-125 md:grid-cols-2">
                    {categories.map((category) => (
                      <li key={category.name}>
                        <NavigationMenuLink asChild>
                          <Link
                            href={category.href}
                            className="block select-none border border-gray-200 bg-white p-3 text-sm font-medium uppercase tracking-wide leading-none text-gray-900 transition-colors hover:border-gray-900 hover:bg-gray-50"
                          >
                            {category.name}
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-sm font-medium uppercase tracking-wide text-gray-900">
                  <Badge
                    variant="default"
                    className="mr-1 border border-orange-600 bg-orange-600 px-2 py-0.5 text-xs uppercase text-white hover:bg-orange-700"
                  >
                    New
                  </Badge>
                  Drops
                </NavigationMenuTrigger>
                <NavigationMenuContent className="border border-gray-200 bg-white/40 shadow-lg">
                  <ul className="grid w-75 gap-3 p-4">
                    {newDrops.map((drop) => (
                      <li key={drop.name}>
                        <NavigationMenuLink asChild>
                          <Link
                            href={drop.href}
                            className="block select-none border border-gray-200 bg-white p-3 text-sm font-medium uppercase tracking-wide leading-none text-gray-900 transition-colors hover:border-gray-900 hover:bg-gray-50"
                          >
                            {drop.name}
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link
                  href="/favoritos"
                  className="group inline-flex h-10 w-max items-center justify-center px-4 py-2 text-sm font-medium uppercase tracking-wide text-gray-900 transition-colors hover:text-orange-600 relative"
                >
                  <Heart className="h-4 w-4 mr-1" />
                  Favoritos
                  {count > 0 && (
                    <Badge className="ml-1 h-5 min-w-5 px-1 border border-orange-600 bg-orange-600 text-white text-xs">
                      {count}
                    </Badge>
                  )}
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link
                  href="/sobre"
                  className="group inline-flex h-10 w-max items-center justify-center px-4 py-2 text-sm font-medium uppercase tracking-wide text-gray-900 transition-colors hover:text-orange-600"
                >
                  Sobre
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {/* User Actions */}
          <div className="flex items-center space-x-1">
            {/* WhatsApp Button */}
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-900 hover:bg-gray-100"
              asChild
            >
              <Link
                href="https://wa.me/5524992060913"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaWhatsapp className="h-5 w-5" />
                <span className="sr-only">WhatsApp</span>
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-900 hover:bg-gray-100 mr-2"
              asChild
            >
              {/* <Link href="/admin/login">
                <User className="h-5 w-5" />
                <span className="sr-only">Conta</span>
              </Link> */}
            </Button>
            <CartSheet />
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="flex items-center space-x-2 md:hidden">
          {/* WhatsApp Button */}
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-900 hover:bg-gray-100"
            asChild
          >
            <Link
              href="https://wa.me/5524992060913"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaWhatsapp className="h-5 w-5" />
              <span className="sr-only">WhatsApp</span>
            </Link>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="text-gray-900 hover:bg-gray-100"
            asChild
          >
            <Link href="/admin/login">
              <User className="h-5 w-5" />
            </Link>
          </Button>
          <CartSheet />
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="border-gray-300 text-gray-900 hover:bg-gray-100"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-75 border-l border-gray-200"
            >
              <div className="flex flex-col space-y-4 pt-6">
                <h2 className="text-sm font-bold uppercase tracking-wide text-gray-900">
                  Categorias
                </h2>
                <div className="flex flex-col space-y-2">
                  {categories.map((category) => (
                    <Link
                      key={category.name}
                      href={category.href}
                      className="border border-gray-200 bg-white p-3 text-sm font-medium uppercase tracking-wide text-gray-900 transition-colors hover:border-gray-900 hover:bg-gray-50"
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>

                <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-gray-900">
                  <Badge className="border border-orange-600 bg-orange-600 text-xs uppercase text-white">
                    New
                  </Badge>
                  Drops
                </h2>
                <div className="flex flex-col space-y-2">
                  {newDrops.map((drop) => (
                    <Link
                      key={drop.name}
                      href={drop.href}
                      className="border border-gray-200 bg-white p-3 text-sm font-medium uppercase tracking-wide text-gray-900 transition-colors hover:border-gray-900 hover:bg-gray-50"
                    >
                      {drop.name}
                    </Link>
                  ))}
                </div>

                <Link
                  href="/favoritos"
                  className="border border-gray-200 bg-white p-3 text-sm font-medium uppercase tracking-wide text-gray-900 transition-colors hover:border-gray-900 hover:bg-gray-50"
                >
                  Favoritos
                </Link>

                <Link
                  href="/sobre"
                  className="border border-gray-200 bg-white p-3 text-sm font-medium uppercase tracking-wide text-gray-900 transition-colors hover:border-gray-900 hover:bg-gray-50"
                >
                  Sobre
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}

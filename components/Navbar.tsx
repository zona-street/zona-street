"use client";

import Link from "next/link";
import { Menu, ShoppingCart, User } from "lucide-react";
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

const categories = [
  { name: "Camisetas", href: "/categoria/camisetas" },
  { name: "Moletons", href: "/categoria/moletons" },
  { name: "Calças", href: "/categoria/calcas" },
  { name: "Acessórios", href: "/categoria/acessorios" },
];

const newDrops = [
  { name: "Nova Coleção Y2K", href: "/colecao/y2k" },
  { name: "Oversized Especial", href: "/colecao/oversized" },
];

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b-3 border-black bg-background shadow-brutal">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          {/* TODO: Substituir por logo SVG/PNG da marca */}
          {/* Placeholder: Logo Zona Street (substituir por imagem em /public/logo.png) */}
          <div className="flex h-10 w-10 items-center justify-center rounded-sm border-3 border-black bg-orange-street font-black text-white shadow-brutal-sm">
            ZS
          </div>
          <span className="hidden text-xl font-black tracking-tight sm:inline-block">
            ZONA STREET
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center space-x-6 md:flex">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="font-bold">
                  CATEGORIAS
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2">
                    {categories.map((category) => (
                      <li key={category.name}>
                        <NavigationMenuLink asChild>
                          <Link
                            href={category.href}
                            className="block select-none space-y-1 rounded-sm border-2 border-black bg-card p-3 font-bold leading-none transition-all hover:bg-orange-street hover:text-white hover:shadow-brutal-sm"
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
                <NavigationMenuTrigger className="font-bold">
                  <Badge
                    variant="default"
                    className="mr-1 border-2 border-black bg-orange-street shadow-brutal-sm"
                  >
                    NEW
                  </Badge>
                  DROPS
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[300px] gap-3 p-4">
                    {newDrops.map((drop) => (
                      <li key={drop.name}>
                        <NavigationMenuLink asChild>
                          <Link
                            href={drop.href}
                            className="block select-none space-y-1 rounded-sm border-2 border-black bg-card p-3 font-bold leading-none transition-all hover:bg-blue-street hover:text-white hover:shadow-brutal-sm"
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
                  href="/sobre"
                  className="group inline-flex h-10 w-max items-center justify-center rounded-sm px-4 py-2 font-bold transition-colors hover:text-orange-street"
                >
                  SOBRE
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {/* User Actions */}
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              className="border-2 border-transparent hover:border-black hover:shadow-brutal-sm"
            >
              <User className="h-5 w-5" />
              <span className="sr-only">Conta</span>
            </Button>
            <Button
              variant="default"
              size="icon"
              className="border-3 border-black bg-orange-street font-bold hover:bg-orange-street/90 hover:shadow-brutal"
            >
              <ShoppingCart className="h-5 w-5" />
              <span className="sr-only">Carrinho</span>
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="flex items-center space-x-2 md:hidden">
          <Button
            variant="ghost"
            size="icon"
            className="border-2 border-transparent hover:border-black"
          >
            <User className="h-5 w-5" />
          </Button>
          <Button
            variant="default"
            size="icon"
            className="border-3 border-black bg-orange-street hover:bg-orange-street/90"
          >
            <ShoppingCart className="h-5 w-5" />
          </Button>
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="border-3 border-black shadow-brutal-sm"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[300px] border-l-3 border-black"
            >
              <div className="flex flex-col space-y-4 pt-6">
                <h2 className="text-lg font-black">CATEGORIAS</h2>
                <div className="flex flex-col space-y-2">
                  {categories.map((category) => (
                    <Link
                      key={category.name}
                      href={category.href}
                      className="rounded-sm border-2 border-black bg-card p-3 font-bold transition-all hover:bg-orange-street hover:text-white hover:shadow-brutal-sm"
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>

                <h2 className="flex items-center gap-2 text-lg font-black">
                  <Badge className="border-2 border-black bg-orange-street shadow-brutal-sm">
                    NEW
                  </Badge>
                  DROPS
                </h2>
                <div className="flex flex-col space-y-2">
                  {newDrops.map((drop) => (
                    <Link
                      key={drop.name}
                      href={drop.href}
                      className="rounded-sm border-2 border-black bg-card p-3 font-bold transition-all hover:bg-blue-street hover:text-white hover:shadow-brutal-sm"
                    >
                      {drop.name}
                    </Link>
                  ))}
                </div>

                <Link
                  href="/sobre"
                  className="rounded-sm border-2 border-black bg-card p-3 font-bold transition-all hover:bg-muted"
                >
                  SOBRE
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}

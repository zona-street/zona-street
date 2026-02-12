"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Heart } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCart } from "@/lib/store/useCart";
import { useCartSheet } from "@/lib/store/useCartSheet";
import { useFavorites } from "@/lib/hooks/useFavorites";
import { useState } from "react";
import { toast } from "sonner";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  oldPrice?: number;
  image: string;
  category: string;
  isNewDrop?: boolean;
  slug: string;
  sizes?: string[];
}

export function ProductCard({
  id,
  name,
  price,
  oldPrice,
  image,
  category,
  isNewDrop = false,
  slug,
  sizes = [],
}: ProductCardProps) {
  const [selectedSize, setSelectedSize] = useState<string>("");
  const { isFavorite, toggleFavorite: toggleFav } = useFavorites();
  const addItem = useCart((state) => state.addItem);
  const openCart = useCartSheet((state) => state.openCart);

  // Verificaes de segurana
  const safeImage = image || "/placeholder-product.png";
  const safeName = name || "Produto sem nome";
  const safePrice =
    typeof price === "string"
      ? parseFloat(price)
      : typeof price === "number"
        ? price
        : 0;
  const safeOldPrice = oldPrice
    ? typeof oldPrice === "string"
      ? parseFloat(oldPrice)
      : oldPrice
    : undefined;
  const safeSizes =
    Array.isArray(sizes) && sizes.length > 0 ? sizes : ["P", "M", "G"];

  const discountPercentage = safeOldPrice
    ? Math.round(((safeOldPrice - safePrice) / safeOldPrice) * 100)
    : 0;

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault(); // Impede navegao ao clicar
    const isAdded = toggleFav(id);

    if (isAdded) {
      toast.success("Adicionado aos favoritos!");
    } else {
      toast.info("Removido dos favoritos");
    }
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error("Selecione um tamanho", {
        description:
          "Por favor, escolha o tamanho desejado antes de adicionar ao carrinho.",
      });
      return;
    }

    addItem({
      id,
      name,
      price,
      size: selectedSize,
      image,
      slug,
    });

    toast.success("Adicionado ao carrinho!", {
      description: `${name} - Tamanho ${selectedSize}`,
    });

    setSelectedSize("");

    // Abre o carrinho automaticamente
    setTimeout(() => openCart(), 300);
  };

  return (
    <Card className="group relative overflow-hidden border-2 border-gray-900 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none py-0 gap-0 rounded-none">
      <CardHeader className="p-0">
        <Link
          href={`/produtos/${slug}`}
          className="relative block aspect-square"
        >
          {/* Imagem do produto */}
          {safeImage ? (
            <Image
              src={safeImage}
              alt={safeName}
              fill
              className="object-cover transition-transform group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gray-50 text-4xl sm:text-6xl font-black text-gray-200">
              {safeName.charAt(0)}
            </div>
          )}

          {/* Badge de novidade */}
          {isNewDrop && (
            <Badge className="absolute left-2 sm:left-3 top-2 sm:top-3 border-2 border-orange-600 bg-orange-600 px-2 sm:px-3 py-0.5 sm:py-1 text-xs font-bold uppercase tracking-wide text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              New
            </Badge>
          )}

          {/* Badge de desconto */}
          {discountPercentage > 0 && (
            <Badge className="absolute right-2 sm:right-3 top-2 sm:top-3 border-2 border-gray-900 bg-gray-900 px-2 sm:px-3 py-0.5 sm:py-1 text-xs font-bold uppercase tracking-wide text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              -{discountPercentage}%
            </Badge>
          )}

          {/* Botão de favoritar - sempre visível no mobile, hover no desktop */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleToggleFavorite}
            className={`cursor-pointer absolute right-2 sm:right-3 bottom-2 sm:bottom-3 h-9 w-9 sm:h-10 sm:w-10 border bg-white opacity-100 sm:opacity-0 transition-all hover:border-gray-900 sm:group-hover:opacity-100 active:scale-95 ${
              isFavorite(id)
                ? "text-red-600 border-red-600"
                : "border-gray-200 text-gray-600"
            }`}
          >
            <Heart
              className={`h-4 w-4 sm:h-5 sm:w-5 ${isFavorite(id) ? "fill-current" : ""}`}
            />
          </Button>
        </Link>
      </CardHeader>

      <CardContent className="p-3 sm:p-4">
        {/* Categoria */}
        <p className="mb-1.5 sm:mb-2 text-xs font-medium uppercase tracking-wider text-gray-500">
          {category || "Categoria"}
        </p>

        {/* Nome do produto */}
        <Link href={`/produtos/${slug || ""}`}>
          <h3 className="mb-2 sm:mb-3 line-clamp-2 text-sm sm:text-base font-bold leading-tight text-gray-900 transition-colors hover:text-orange-600">
            {safeName}
          </h3>
        </Link>

        {/* Preos */}
        <div className="flex items-baseline gap-2">
          <span className="text-lg sm:text-xl font-bold text-gray-900">
            R$ {safePrice.toFixed(2)}
          </span>
          {safeOldPrice && (
            <span className="text-xs sm:text-sm font-medium text-gray-400 line-through">
              R$ {safeOldPrice.toFixed(2)}
            </span>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex-col gap-2 p-3 sm:p-4 pt-0">
        <Select value={selectedSize} onValueChange={setSelectedSize}>
          <SelectTrigger className="cursor-pointer w-full h-10 sm:h-11 border-2 border-gray-900 bg-white text-sm sm:text-base font-bold hover:border-gray-900">
            <SelectValue placeholder="Selecione o tamanho" />
          </SelectTrigger>
          <SelectContent>
            {safeSizes.map((size) => (
              <SelectItem
                key={size}
                value={size}
                className="text-sm sm:text-base"
              >
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          className="cursor-pointer w-full border-2 border-gray-900 bg-gray-900 py-2.5 sm:py-2 text-xs sm:text-xs font-bold uppercase tracking-wide text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none active:scale-[0.98]"
          onClick={handleAddToCart}
        >
          <ShoppingCart className="mr-1.5 sm:mr-2 h-4 w-4" />
          Adicionar
        </Button>
      </CardFooter>
    </Card>
  );
}

// Variante alternativa com destaque especial (para hero/featured products)
export function ProductCardFeatured({
  id,
  name,
  price,
  oldPrice,
  image,
  category,
  slug,
  sizes = [],
}: ProductCardProps) {
  const [selectedSize, setSelectedSize] = useState<string>("");
  const addItem = useCart((state) => state.addItem);
  const openCart = useCartSheet((state) => state.openCart);
  const safeSizes =
    Array.isArray(sizes) && sizes.length > 0 ? sizes : ["P", "M", "G"];
  const safePrice = typeof price === "string" ? parseFloat(price) : price;
  const safeOldPrice = oldPrice
    ? typeof oldPrice === "string"
      ? parseFloat(oldPrice)
      : oldPrice
    : undefined;

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error("Selecione um tamanho", {
        description:
          "Por favor, escolha o tamanho desejado antes de adicionar ao carrinho.",
      });
      return;
    }

    addItem({
      id,
      name,
      price: safePrice,
      size: selectedSize,
      image,
      slug,
    });

    toast.success("Adicionado ao carrinho!", {
      description: `${name} - Tamanho ${selectedSize}`,
    });

    setSelectedSize("");

    // Abre o carrinho automaticamente
    setTimeout(() => openCart(), 300);
  };
  return (
    <Card className="group pt-0 relative overflow-hidden border-2 border-gray-900 bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[6px] hover:translate-y-[6px] hover:shadow-none gap-0 rounded-none">
      <CardHeader className="p-0">
        <Link
          href={`/produtos/${slug}`}
          className="relative block aspect-square"
        >
          {/* Imagem do produto em destaque */}
          {image ? (
            <Image
              src={image}
              alt={name}
              fill
              className="object-cover transition-transform group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gray-50 text-6xl sm:text-8xl font-black text-gray-200">
              {name.charAt(0)}
            </div>
          )}

          {/* Badge especial para featured */}
          <Badge className="absolute left-3 sm:left-4 top-3 sm:top-4 border-2 border-gray-900 bg-gray-900 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-bold uppercase tracking-wide text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            Destaque
          </Badge>
        </Link>
      </CardHeader>

      <CardContent className="p-4 sm:p-8 pb-4 sm:pb-6 pt-2">
        <p className="mb-2 sm:mb-3 text-xs sm:text-sm font-bold uppercase tracking-wider text-gray-500">
          {category}
        </p>

        <Link href={`/produtos/${slug}`}>
          <h3 className="mb-3 sm:mb-4 text-xl sm:text-3xl font-bold leading-tight text-gray-900 transition-colors hover:text-orange-600">
            {name}
          </h3>
        </Link>

        <div className="flex items-baseline gap-2 sm:gap-3">
          <span className="text-2xl sm:text-4xl font-bold text-gray-900">
            R$ {safePrice.toFixed(2)}
          </span>
          {safeOldPrice && (
            <span className="text-base sm:text-lg font-medium text-gray-400 line-through">
              R$ {safeOldPrice.toFixed(2)}
            </span>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex-col gap-2.5 sm:gap-3 p-4 sm:p-8 pt-0 pb-4 sm:pb-2">
        <Select value={selectedSize} onValueChange={setSelectedSize}>
          <SelectTrigger className="w-full border-2 border-gray-900 bg-white py-5 sm:py-6 text-sm sm:text-base font-bold hover:border-gray-900">
            <SelectValue placeholder="Selecione o tamanho" />
          </SelectTrigger>
          <SelectContent>
            {safeSizes.map((size) => (
              <SelectItem
                key={size}
                value={size}
                className="text-sm sm:text-base"
              >
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          className="w-full border-2 border-gray-900 bg-gray-900 py-5 sm:py-6 text-sm sm:text-base font-bold uppercase tracking-wide text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none active:scale-[0.98]"
          onClick={handleAddToCart}
        >
          <ShoppingCart className="mr-2 sm:mr-3 h-5 w-5 sm:h-6 sm:w-6" />
          Comprar Agora
        </Button>
      </CardFooter>
    </Card>
  );
}

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
}: ProductCardProps) {
  const [selectedSize, setSelectedSize] = useState<string>("");
  const addItem = useCart((state) => state.addItem);
  const openCart = useCartSheet((state) => state.openCart);

  // Verificações de segurança
  const safeImage = image || "/placeholder-product.png";
  const safeName = name || "Produto sem nome";
  const safePrice = typeof price === "number" ? price : 0;
  const safeOldPrice = typeof oldPrice === "number" ? oldPrice : undefined;

  const discountPercentage = safeOldPrice
    ? Math.round(((safeOldPrice - safePrice) / safeOldPrice) * 100)
    : 0;

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
    <Card className="group relative overflow-hidden border border-gray-200 bg-white transition-all hover:border-gray-900">
      <CardHeader className="p-0">
        <Link
          href={`/produto/${slug}`}
          className="relative block aspect-square"
        >
          {/* TODO: Substituir placeholder por imagens reais dos produtos */}
          {/* Placeholder: Imagem do produto (substituir por imagens em /public/products/) */}
          <div className="flex h-full w-full items-center justify-center bg-gray-50 text-6xl font-black text-gray-200">
            {safeName.charAt(0)}
          </div>

          {/* Badge de novidade */}
          {isNewDrop && (
            <Badge className="absolute left-3 top-3 border border-orange-600 bg-orange-600 px-3 py-1 text-xs font-medium uppercase tracking-wide text-white hover:bg-orange-700">
              New
            </Badge>
          )}

          {/* Badge de desconto */}
          {discountPercentage > 0 && (
            <Badge className="absolute right-3 top-3 border border-gray-900 bg-gray-900 px-3 py-1 text-xs font-medium uppercase tracking-wide text-white hover:bg-gray-800">
              -{discountPercentage}%
            </Badge>
          )}

          {/* Botão de favoritar - aparece no hover */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-3 bottom-3 border border-gray-200 bg-white opacity-0 transition-opacity hover:border-gray-900 group-hover:opacity-100"
          >
            <Heart className="h-5 w-5" />
          </Button>
        </Link>
      </CardHeader>

      <CardContent className="p-4">
        {/* Categoria */}
        <p className="mb-2 text-xs font-medium uppercase tracking-wider text-gray-500">
          {category || "Categoria"}
        </p>

        {/* Nome do produto */}
        <Link href={`/produto/${slug || ""}`}>
          <h3 className="mb-3 line-clamp-2 text-base font-bold leading-tight text-gray-900 transition-colors hover:text-orange-600">
            {safeName}
          </h3>
        </Link>

        {/* Preços */}
        <div className="flex items-baseline gap-2">
          <span className="text-xl font-bold text-gray-900">
            R$ {safePrice.toFixed(2)}
          </span>
          {safeOldPrice && (
            <span className="text-sm font-medium text-gray-400 line-through">
              R$ {safeOldPrice.toFixed(2)}
            </span>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex-col gap-2 p-4 pt-0">
        <Select value={selectedSize} onValueChange={setSelectedSize}>
          <SelectTrigger className="w-full border-2 border-gray-300 bg-white font-medium hover:border-gray-900">
            <SelectValue placeholder="Selecione o tamanho" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="PP">PP</SelectItem>
            <SelectItem value="P">P</SelectItem>
            <SelectItem value="M">M</SelectItem>
            <SelectItem value="G">G</SelectItem>
            <SelectItem value="GG">GG</SelectItem>
            <SelectItem value="XG">XG</SelectItem>
          </SelectContent>
        </Select>

        <Button
          className="w-full border-2 border-gray-900 bg-gray-900 py-2 text-xs font-bold uppercase tracking-wide text-white transition-colors hover:bg-transparent hover:text-gray-900"
          onClick={handleAddToCart}
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
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
}: ProductCardProps) {
  const [selectedSize, setSelectedSize] = useState<string>("");
  const addItem = useCart((state) => state.addItem);
  const openCart = useCartSheet((state) => state.openCart);

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
    <Card className="group relative overflow-hidden border-2 border-gray-900 bg-white transition-all hover:shadow-xl">
      <CardHeader className="p-0">
        <Link
          href={`/produto/${slug}`}
          className="relative block aspect-square"
        >
          {/* TODO: Substituir placeholder por imagens reais dos produtos featured */}
          {/* Placeholder: Imagem do produto em destaque (substituir por imagens em /public/products/featured/) */}
          <div className="flex h-full w-full items-center justify-center bg-gray-50 text-8xl font-black text-gray-200">
            {name.charAt(0)}
          </div>

          {/* Badge especial para featured */}
          <Badge className="absolute left-4 top-4 border border-gray-900 bg-gray-900 px-4 py-2 text-sm font-bold uppercase tracking-wide text-white">
            Destaque
          </Badge>
        </Link>
      </CardHeader>

      <CardContent className="p-8 pb-6">
        <p className="mb-3 text-sm font-medium uppercase tracking-wider text-gray-500">
          {category}
        </p>

        <Link href={`/produto/${slug}`}>
          <h3 className="mb-4 text-3xl font-bold leading-tight text-gray-900 transition-colors hover:text-orange-600">
            {name}
          </h3>
        </Link>

        <div className="flex items-baseline gap-3">
          <span className="text-4xl font-bold text-gray-900">
            R$ {price.toFixed(2)}
          </span>
          {oldPrice && (
            <span className="text-lg font-medium text-gray-400 line-through">
              R$ {oldPrice.toFixed(2)}
            </span>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex-col gap-3 p-8 pt-0">
        <Select value={selectedSize} onValueChange={setSelectedSize}>
          <SelectTrigger className="w-full border-2 border-gray-300 bg-white py-6 text-base font-medium hover:border-gray-900">
            <SelectValue placeholder="Selecione o tamanho" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="PP">PP</SelectItem>
            <SelectItem value="P">P</SelectItem>
            <SelectItem value="M">M</SelectItem>
            <SelectItem value="G">G</SelectItem>
            <SelectItem value="GG">GG</SelectItem>
            <SelectItem value="XG">XG</SelectItem>
          </SelectContent>
        </Select>

        <Button
          className="w-full border-2 border-gray-900 bg-gray-900 py-6 text-base font-bold uppercase tracking-wide text-white transition-colors hover:bg-orange-600 hover:border-orange-600"
          onClick={handleAddToCart}
        >
          <ShoppingCart className="mr-3 h-6 w-6" />
          Comprar Agora
        </Button>
      </CardFooter>
    </Card>
  );
}

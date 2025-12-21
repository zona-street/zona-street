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
  const discountPercentage = oldPrice
    ? Math.round(((oldPrice - price) / oldPrice) * 100)
    : 0;

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
            {name.charAt(0)}
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
          {category}
        </p>

        {/* Nome do produto */}
        <Link href={`/produto/${slug}`}>
          <h3 className="mb-3 line-clamp-2 text-base font-bold leading-tight text-gray-900 transition-colors hover:text-orange-600">
            {name}
          </h3>
        </Link>

        {/* Preços */}
        <div className="flex items-baseline gap-2">
          <span className="text-xl font-bold text-gray-900">
            R$ {price.toFixed(2)}
          </span>
          {oldPrice && (
            <span className="text-sm font-medium text-gray-400 line-through">
              R$ {oldPrice.toFixed(2)}
            </span>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button className="w-full border-2 border-gray-900 bg-gray-900 py-2 text-xs font-bold uppercase tracking-wide text-white transition-colors hover:bg-transparent hover:text-gray-900">
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

      <CardFooter className="p-8 pt-0">
        <Button className="w-full border-2 border-gray-900 bg-gray-900 py-6 text-base font-bold uppercase tracking-wide text-white transition-colors hover:bg-orange-600 hover:border-orange-600">
          <ShoppingCart className="mr-3 h-6 w-6" />
          Comprar Agora
        </Button>
      </CardFooter>
    </Card>
  );
}

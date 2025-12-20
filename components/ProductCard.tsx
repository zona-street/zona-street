import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Heart } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
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
    <Card className="group relative overflow-hidden border-3 border-black shadow-brutal transition-all hover:shadow-brutal-lg hover:-translate-y-1">
      <CardHeader className="p-0">
        <Link href={`/produto/${slug}`} className="relative block aspect-square">
          {/* TODO: Substituir placeholder por imagens reais dos produtos */}
          {/* Placeholder: Imagem do produto (substituir por imagens em /public/products/) */}
          <div className="flex h-full w-full items-center justify-center bg-off-white text-6xl font-black text-muted-foreground/20">
            {name.charAt(0)}
          </div>
          
          {/* Badge de novidade */}
          {isNewDrop && (
            <Badge className="absolute left-3 top-3 border-2 border-black bg-orange-street px-3 py-1 text-xs font-extrabold shadow-brutal-sm">
              NEW DROP
            </Badge>
          )}

          {/* Badge de desconto */}
          {discountPercentage > 0 && (
            <Badge className="absolute right-3 top-3 border-2 border-black bg-blue-street px-3 py-1 text-xs font-extrabold shadow-brutal-sm">
              -{discountPercentage}%
            </Badge>
          )}

          {/* Botão de favoritar - aparece no hover */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-3 bottom-3 border-2 border-black bg-white opacity-0 shadow-brutal-sm transition-opacity group-hover:opacity-100"
          >
            <Heart className="h-5 w-5" />
          </Button>
        </Link>
      </CardHeader>

      <CardContent className="p-6 pb-4">
        {/* Categoria */}
        <p className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
          {category}
        </p>

        {/* Nome do produto - estilo oversized */}
        <Link href={`/produto/${slug}`}>
          <h3 className="mb-3 line-clamp-2 text-xl font-extrabold leading-tight transition-colors hover:text-orange-street">
            {name}
          </h3>
        </Link>

        {/* Preços */}
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-black text-foreground">
            R$ {price.toFixed(2)}
          </span>
          {oldPrice && (
            <span className="text-sm font-bold text-muted-foreground line-through">
              R$ {oldPrice.toFixed(2)}
            </span>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-6 pt-0">
        <Button
          className="w-full border-3 border-black bg-orange-street font-extrabold text-white shadow-brutal-sm transition-all hover:bg-orange-street/90 hover:shadow-brutal"
          size="lg"
        >
          <ShoppingCart className="mr-2 h-5 w-5" />
          ADICIONAR AO CARRINHO
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
    <Card className="group relative overflow-hidden border-5 border-black bg-gradient-to-br from-orange-street/10 to-blue-street/10 shadow-brutal-xl transition-all hover:shadow-brutal-orange hover:scale-[1.02]">
      <CardHeader className="p-0">
        <Link href={`/produto/${slug}`} className="relative block aspect-square">
          {/* TODO: Substituir placeholder por imagens reais dos produtos featured */}
          {/* Placeholder: Imagem do produto em destaque (substituir por imagens em /public/products/featured/) */}
          <div className="flex h-full w-full items-center justify-center bg-off-white text-8xl font-black text-muted-foreground/20">
            {name.charAt(0)}
          </div>
          
          {/* Badge especial para featured */}
          <Badge className="absolute left-4 top-4 border-3 border-black bg-blue-street px-4 py-2 text-sm font-black shadow-brutal">
            🔥 DESTAQUE
          </Badge>
        </Link>
      </CardHeader>

      <CardContent className="p-8 pb-6">
        <p className="mb-3 text-sm font-extrabold uppercase tracking-wider text-orange-street">
          {category}
        </p>

        <Link href={`/produto/${slug}`}>
          <h3 className="mb-4 text-3xl font-black leading-tight transition-colors hover:text-orange-street">
            {name}
          </h3>
        </Link>

        <div className="flex items-baseline gap-3">
          <span className="text-4xl font-black text-foreground">
            R$ {price.toFixed(2)}
          </span>
          {oldPrice && (
            <span className="text-lg font-bold text-muted-foreground line-through">
              R$ {oldPrice.toFixed(2)}
            </span>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-8 pt-0">
        <Button
          className="w-full border-5 border-black bg-orange-street py-6 text-lg font-black text-white shadow-brutal transition-all hover:bg-orange-street/90 hover:shadow-brutal-xl"
        >
          <ShoppingCart className="mr-3 h-6 w-6" />
          COMPRAR AGORA
        </Button>
      </CardFooter>
    </Card>
  );
}

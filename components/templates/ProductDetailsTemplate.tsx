"use client";

import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { ProductCard } from "@/components/shared/ProductCard";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/lib/store/useCart";
import { useCartSheet } from "@/lib/store/useCartSheet";
import { useState, useEffect, useRef } from "react";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import { Product } from "@/lib/types/product";

interface ProductDetailsTemplateProps {
  product: Product;
  relatedProducts: Product[];
}

export function ProductDetailsTemplate({
  product,
  relatedProducts,
}: ProductDetailsTemplateProps) {
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [isFavorite, setIsFavorite] = useState(false);
  const [transformOrigin, setTransformOrigin] = useState("center center");
  const [isZoomed, setIsZoomed] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  const addItem = useCart((state) => state.addItem);
  const { openCart } = useCartSheet();

  // Verificar se o produto tem dados essenciais
  if (!product || !product.id) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Produto não encontrado
            </h1>
            <p className="text-gray-600">
              O produto que você está procurando não existe ou foi removido.
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Gerenciar favoritos no localStorage
  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    setIsFavorite(favorites.includes(product.id));
  }, [product.id]);

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error("Selecione um tamanho", {
        description:
          "Por favor, escolha o tamanho desejado antes de adicionar ao carrinho.",
      });
      return;
    }

    const itemPrice =
      typeof product.price === "string"
        ? parseFloat(product.price)
        : product.price || 0;

    if (itemPrice <= 0) {
      toast.error("Produto indisponível", {
        description: "Este produto não possui preço definido.",
      });
      return;
    }

    addItem({
      id: product.id,
      name: product.name,
      price: itemPrice,
      size: selectedSize,
      image: product.images?.[0] || "/placeholder.jpg",
      slug: product.slug,
    });

    toast.success("Adicionado ao carrinho!", {
      description: `${product.name} - Tamanho ${selectedSize}`,
    });

    openCart();
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setTransformOrigin(`${x}% ${y}%`);
    setIsZoomed(true);
  };

  const handleMouseLeave = () => {
    setTransformOrigin("center center");
    setIsZoomed(false);
  };

  const toggleFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");

    if (isFavorite) {
      const newFavorites = favorites.filter((id: string) => id !== product.id);
      localStorage.setItem("favorites", JSON.stringify(newFavorites));
      setIsFavorite(false);
      toast.info("Removido dos favoritos");
    } else {
      const newFavorites = [...favorites, product.id];
      localStorage.setItem("favorites", JSON.stringify(newFavorites));
      setIsFavorite(true);
      toast.success("Adicionado aos favoritos!");
    }
  };

  const price =
    typeof product.price === "string"
      ? parseFloat(product.price)
      : typeof product.price === "number"
        ? product.price
        : 0;
  const oldPrice =
    product.oldPrice && typeof product.oldPrice === "string"
      ? parseFloat(product.oldPrice)
      : typeof product.oldPrice === "number"
        ? product.oldPrice
        : undefined;

  const discount = oldPrice
    ? Math.round(((oldPrice - price) / oldPrice) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Produto */}
        <div className="mb-16 grid gap-8 lg:grid-cols-2">
          {/* Imagens */}
          <div className="space-y-4">
            <div
              className="relative aspect-square overflow-hidden border-2 border-gray-900 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] cursor-zoom-in"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <Image
                ref={imageRef}
                src={product.images?.[0] || "/placeholder.jpg"}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-300"
                style={{
                  transformOrigin,
                  transform: isZoomed ? "scale(2)" : "scale(1)",
                }}
              />
              {product.isNewDrop && (
                <Badge className="absolute left-4 top-4 border-2 border-orange-600 bg-orange-600 text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  NOVO
                </Badge>
              )}
              {discount > 0 && (
                <Badge className="absolute right-4 top-4 border-2 border-gray-900 bg-gray-900 text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  -{discount}%
                </Badge>
              )}
            </div>
          </div>

          {/* Informaes */}
          <div>
            <div className="mb-4 flex items-start justify-between">
              <h1 className="text-4xl font-bold uppercase tracking-tight text-gray-900">
                {product.name}
              </h1>
              <Button
                variant="outline"
                size="icon"
                onClick={toggleFavorite}
                className={`border-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none ${
                  isFavorite
                    ? "border-red-600 bg-red-600 text-white hover:bg-red-700"
                    : "border-gray-900 bg-white hover:bg-gray-50"
                }`}
              >
                <Heart
                  className={`h-5 w-5 ${isFavorite ? "fill-current" : ""}`}
                />
              </Button>
            </div>

            <div className="mb-6 flex items-center gap-3">
              <span className="text-3xl font-bold text-gray-900">
                R$ {price > 0 ? price.toFixed(2) : "Preço não disponível"}
              </span>
              {oldPrice && oldPrice > 0 && (
                <span className="text-xl text-gray-400 line-through">
                  R$ {oldPrice.toFixed(2)}
                </span>
              )}
            </div>

            <p className="mb-6 text-gray-700">{product.description}</p>

            <div className="mb-6">
              <h3 className="mb-3 text-sm font-bold uppercase text-gray-900">
                Selecione o tamanho
              </h3>
              <div className="flex flex-wrap gap-2">
                {product.sizes?.map((size: string) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`border-2 px-6 py-3 font-bold uppercase transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none ${
                      selectedSize === size
                        ? "border-gray-900 bg-gray-900 text-white"
                        : "border-gray-900 bg-white text-gray-900"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <p className="text-sm text-gray-600">
                Estoque: {product.stock} unidades disponíveis
              </p>
            </div>

            <Button
              onClick={handleAddToCart}
              disabled={!selectedSize || price <= 0}
              className="w-full border-2 border-gray-900 bg-gray-900 py-6 text-sm font-bold uppercase tracking-wide text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none disabled:opacity-50 disabled:cursor-not-allowed"
              size="lg"
            >
              {!selectedSize
                ? "Selecione um tamanho"
                : price <= 0
                  ? "Produto indisponível"
                  : "Adicionar ao Carrinho"}
            </Button>

            <div className="mt-8 border-t-2 border-gray-200 pt-8">
              <h3 className="mb-4 text-sm font-bold uppercase text-gray-900">
                Informações do Produto
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>Envio para Resende/RJ e região</li>
                <li>10% OFF no pagamento via PIX</li>
                <li>Parcelamento em até 10x sem juros</li>
                <li>Troca grátis em até 30 dias</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Produtos Relacionados */}
        {relatedProducts.length > 0 && (
          <section className="border-t-2 border-gray-900 pt-16">
            <h2 className="mb-8 text-3xl font-bold uppercase tracking-tight text-gray-900">
              Produtos Relacionados
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {relatedProducts.map((relatedProduct: Product) => (
                <ProductCard
                  key={relatedProduct.id}
                  id={relatedProduct.id}
                  name={relatedProduct.name}
                  price={relatedProduct.price}
                  oldPrice={relatedProduct.oldPrice}
                  image={relatedProduct.images?.[0] || "/placeholder.jpg"}
                  category={relatedProduct.category}
                  slug={relatedProduct.slug}
                  isNewDrop={relatedProduct.isNewDrop}
                  sizes={relatedProduct.sizes}
                />
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}

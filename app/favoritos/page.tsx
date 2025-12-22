"use client";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { ProductCard } from "@/components/shared/ProductCard";
import { productsApi } from "@/lib/api/products";
import { useFavorites } from "@/lib/hooks/useFavorites";
import { Product } from "@/lib/types/product";
import Link from "next/link";
import { useState, useEffect, useMemo } from "react";

export default function FavoritosPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold uppercase tracking-tight text-gray-900 mb-8">
            Meus Favoritos
          </h1>
          <FavoritosClient />
        </div>
      </main>
      <Footer />
    </div>
  );
}

function FavoritosClient() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { favorites } = useFavorites();

  useEffect(() => {
    let isMounted = true;

    const fetchProducts = async () => {
      try {
        const prods = await productsApi.getAll();
        if (isMounted) {
          setProducts(prods);
        }
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  const favoriteProducts = useMemo(() => {
    return products.filter((p) => favorites.includes(p.id));
  }, [products, favorites]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-gray-900 border-r-transparent"></div>
          <p className="mt-4 text-gray-600">Carregando favoritos...</p>
        </div>
      </div>
    );
  }

  if (favoriteProducts.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Nenhum favorito ainda
        </h2>
        <p className="text-gray-600 mb-8">
          Explore nossos produtos e clique no coração para adicionar aos
          favoritos.
        </p>
        <Link
          href="/"
          className="inline-block bg-gray-900 text-white px-6 py-3 font-bold uppercase tracking-wide hover:bg-gray-800 transition-colors"
        >
          Explorar Produtos
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="mb-4 text-sm text-gray-600">
        {favoriteProducts.length}{" "}
        {favoriteProducts.length === 1 ? "produto" : "produtos"} favorito
        {favoriteProducts.length !== 1 ? "s" : ""}
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {favoriteProducts.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            name={product.name}
            price={product.price}
            oldPrice={product.oldPrice}
            image={product.images?.[0] || "/placeholder.jpg"}
            category={product.category}
            isNewDrop={product.isNewDrop}
            slug={product.slug}
            sizes={product.sizes}
          />
        ))}
      </div>
    </>
  );
}

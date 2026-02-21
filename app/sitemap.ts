import { MetadataRoute } from "next";

interface Product {
  id: string;
  slug: string;
  updatedAt: string;
  isActive: boolean;
}

async function getProducts(): Promise<Product[]> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333/api/v1";
    const url = `${apiUrl}/products`;
    
    const response = await fetch(url, {
      next: { revalidate: 3600 }, // Revalidar a cada 1 hora
    });

    if (!response.ok) {
      console.warn("Erro ao buscar produtos para sitemap:", response.statusText);
      return [];
    }

    const data = await response.json();
    return Array.isArray(data?.data) ? data.data : [];
  } catch (error) {
    console.warn("Erro ao buscar produtos para sitemap:", error);
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://zonastreet.com.br";

  // Páginas estáticas
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/produtos`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/lancamentos`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/favoritos`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/sobre`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    },
  ];

  // Categorias
  const categories = ["camisetas", "moletons", "calcas", "acessorios", "jaquetas"];
  const categoryPages = categories.map((category) => ({
    url: `${baseUrl}/categorias/${category}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.8,
  }));

  // Produtos dinâmicos
  const products = await getProducts();
  const productPages = products
    .filter((product) => product.isActive) // Apenas produtos ativos
    .map((product) => ({
      url: `${baseUrl}/produtos/${product.slug}`,
      lastModified: new Date(product.updatedAt),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

  return [...staticPages, ...categoryPages, ...productPages];
}

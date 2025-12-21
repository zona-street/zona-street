"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { productsApi, CreateProductData } from "@/lib/api/products";
import { useAuth } from "@/lib/store/useAuth";
import { toast } from "sonner";
import { Product } from "@/lib/types/product";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Pencil, Trash2, Loader2, Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Schema de validação
const productSchema = z.object({
  name: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  description: z.string().min(10, "Descrição deve ter no mínimo 10 caracteres"),
  price: z.number().min(0.01, "Preço deve ser maior que 0"),
  oldPrice: z.number().optional(),
  category: z.enum([
    "camisetas",
    "moletons",
    "calcas",
    "acessorios",
    "calcados",
  ]),
  stock: z.number().min(0, "Estoque não pode ser negativo"),
  slug: z.string().min(3, "Slug deve ter no mínimo 3 caracteres"),
  sizes: z.array(z.string()).min(1, "Selecione pelo menos um tamanho"),
  images: z.array(z.string()).min(1, "Adicione pelo menos uma imagem"),
  isNewDrop: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
});

type ProductFormData = z.infer<typeof productSchema>;

export default function AdminProductsPage() {
  const { token } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      sizes: [],
      images: [],
      isNewDrop: false,
      isFeatured: false,
    },
  });

  const selectedCategory = watch("category");
  const selectedSizes = watch("sizes");
  const imageUrls = watch("images");
  const isNewDrop = watch("isNewDrop");
  const isFeatured = watch("isFeatured");

  // Carregar produtos
  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    try {
      setLoading(true);
      const data = await productsApi.getAll();
      setProducts(data);
    } catch (error) {
      toast.error("Erro ao carregar produtos");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  // Abrir modal para criar/editar
  function openDialog(product?: Product) {
    if (product) {
      setEditingProduct(product);
      // Preencher formulário com dados do produto
      reset({
        name: product.name,
        description: product.description,
        price: product.price,
        oldPrice: product.oldPrice,
        category: product.category,
        stock: product.stock,
        slug: product.slug,
        sizes: product.sizes,
        images: product.images,
        isNewDrop: product.isNewDrop,
        isFeatured: product.isFeatured,
      });
    } else {
      setEditingProduct(null);
      reset({
        sizes: [],
        images: [],
        isNewDrop: false,
        isFeatured: false,
      });
    }
    setDialogOpen(true);
  }

  // Submeter formulário
  async function onSubmit(data: ProductFormData) {
    if (!token) {
      toast.error("Você precisa estar autenticado");
      return;
    }

    try {
      if (editingProduct) {
        // Atualizar produto
        await productsApi.update(editingProduct.id, data, token);
        toast.success("Produto atualizado com sucesso!");
      } else {
        // Criar produto
        await productsApi.create(data, token);
        toast.success("Produto criado com sucesso!");
      }

      // Recarregar lista e fechar dialog
      await loadProducts();
      setDialogOpen(false);
      reset();
    } catch (error: any) {
      toast.error(error.message || "Erro ao salvar produto");
      console.error(error);
    }
  }

  // Deletar produto
  async function handleDelete(productId: string) {
    if (!token) {
      toast.error("Você precisa estar autenticado");
      return;
    }

    if (deleteConfirm !== productId) {
      setDeleteConfirm(productId);
      toast.warning("Clique novamente para confirmar a exclusão");
      setTimeout(() => setDeleteConfirm(null), 3000);
      return;
    }

    try {
      await productsApi.delete(productId, token);
      toast.success("Produto deletado com sucesso!");
      await loadProducts();
      setDeleteConfirm(null);
    } catch (error: any) {
      toast.error(error.message || "Erro ao deletar produto");
      console.error(error);
    }
  }

  // Toggle tamanho
  function toggleSize(size: string) {
    const current = selectedSizes || [];
    if (current.includes(size)) {
      setValue(
        "sizes",
        current.filter((s) => s !== size)
      );
    } else {
      setValue("sizes", [...current, size]);
    }
  }

  // Adicionar URL de imagem
  function addImageUrl(url: string) {
    const current = imageUrls || [];
    if (!current.includes(url) && url.trim()) {
      setValue("images", [...current, url.trim()]);
    }
  }

  // Remover URL de imagem
  function removeImageUrl(url: string) {
    const current = imageUrls || [];
    setValue(
      "images",
      current.filter((u) => u !== url)
    );
  }

  const availableSizes = ["PP", "P", "M", "G", "GG", "XG", "XGG"];
  const categories = [
    { value: "camisetas", label: "Camisetas" },
    { value: "moletons", label: "Moletons" },
    { value: "calcas", label: "Calças" },
    { value: "acessorios", label: "Acessórios" },
    { value: "calcados", label: "Calçados" },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between border-b-2 border-gray-900 pb-6">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tight text-gray-900">
            Produtos
          </h1>
          <p className="mt-2 text-lg font-medium text-gray-600">
            Gerencie o catálogo de produtos da loja
          </p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => openDialog()}
              className="border-2 border-gray-900 bg-gray-900 px-6 py-3 font-bold uppercase tracking-wide text-white hover:bg-orange-street hover:border-orange-street shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
            >
              <Plus className="mr-2 h-5 w-5" />
              Novo Produto
            </Button>
          </DialogTrigger>
          <DialogContent className=" max-w-3xl max-h-[90vh] overflow-y-auto border-2 border-gray-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black uppercase">
                {editingProduct ? "Editar Produto" : "Novo Produto"}
              </DialogTitle>
              <DialogDescription>
                {editingProduct
                  ? "Atualize as informações do produto"
                  : "Preencha os dados para criar um novo produto"}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Nome */}
              <div>
                <Label htmlFor="name" className="font-bold uppercase text-xs">
                  Nome do Produto *
                </Label>
                <Input
                  id="name"
                  {...register("name")}
                  className="mt-1 border-2 border-gray-900"
                  placeholder="Ex: Camiseta Oversized Básica"
                />
                {errors.name && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Descrição */}
              <div>
                <Label
                  htmlFor="description"
                  className="font-bold uppercase text-xs"
                >
                  Descrição *
                </Label>
                <textarea
                  id="description"
                  {...register("description")}
                  className="mt-1 w-full border-2 border-gray-900 p-2 min-h-[100px]"
                  placeholder="Descrição detalhada do produto..."
                />
                {errors.description && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.description.message}
                  </p>
                )}
              </div>

              {/* Preço e Preço Antigo */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label
                    htmlFor="price"
                    className="font-bold uppercase text-xs"
                  >
                    Preço (R$) *
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    {...register("price", { valueAsNumber: true })}
                    className="mt-1 border-2 border-gray-900"
                    placeholder="149.90"
                  />
                  {errors.price && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.price.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label
                    htmlFor="oldPrice"
                    className="font-bold uppercase text-xs"
                  >
                    Preço Antigo (R$)
                  </Label>
                  <Input
                    id="oldPrice"
                    type="number"
                    step="0.01"
                    {...register("oldPrice", { valueAsNumber: true })}
                    className="mt-1 border-2 border-gray-900"
                    placeholder="199.90"
                  />
                  {errors.oldPrice && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.oldPrice.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Categoria e Estoque */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label
                    htmlFor="category"
                    className="font-bold uppercase text-xs"
                  >
                    Categoria *
                  </Label>
                  <Select
                    value={selectedCategory}
                    onValueChange={(value) =>
                      setValue("category", value as any)
                    }
                  >
                    <SelectTrigger className="mt-1 border-2 border-gray-900">
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.category && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.category.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label
                    htmlFor="stock"
                    className="font-bold uppercase text-xs"
                  >
                    Estoque *
                  </Label>
                  <Input
                    id="stock"
                    type="number"
                    {...register("stock", { valueAsNumber: true })}
                    className="mt-1 border-2 border-gray-900"
                    placeholder="100"
                  />
                  {errors.stock && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.stock.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Slug */}
              <div>
                <Label htmlFor="slug" className="font-bold uppercase text-xs">
                  Slug (URL) *
                </Label>
                <Input
                  id="slug"
                  {...register("slug")}
                  className="mt-1 border-2 border-gray-900"
                  placeholder="camiseta-oversized-basica"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Use apenas letras minúsculas, números e hífens
                </p>
                {errors.slug && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.slug.message}
                  </p>
                )}
              </div>

              {/* Tamanhos */}
              <div>
                <Label className="font-bold uppercase text-xs">
                  Tamanhos Disponíveis *
                </Label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {availableSizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => toggleSize(size)}
                      className={`border-2 px-4 py-2 font-bold uppercase text-xs transition-colors ${
                        selectedSizes?.includes(size)
                          ? "border-orange-street bg-orange-street text-white"
                          : "border-gray-900 bg-white text-gray-900 hover:bg-gray-100"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                {errors.sizes && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.sizes.message}
                  </p>
                )}
              </div>

              {/* Imagens */}
              <div>
                <Label className="font-bold uppercase text-xs">Imagens *</Label>
                <div className="mt-2 space-y-2">
                  <div className="flex gap-2">
                    <Input
                      id="image-url-input"
                      type="url"
                      className="border-2 border-gray-900"
                      placeholder="https://exemplo.com/imagem.jpg"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          const input = e.currentTarget;
                          addImageUrl(input.value);
                          input.value = "";
                        }
                      }}
                    />
                    <Button
                      type="button"
                      onClick={() => {
                        const input = document.getElementById(
                          "image-url-input"
                        ) as HTMLInputElement;
                        if (input?.value) {
                          addImageUrl(input.value);
                          input.value = "";
                        }
                      }}
                      className="border-2 border-gray-900 bg-gray-900 text-white hover:bg-orange-street"
                    >
                      Adicionar
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500">
                    Cole a URL da imagem e pressione Enter ou clique em
                    Adicionar
                  </p>

                  {/* Lista de imagens */}
                  {imageUrls && imageUrls.length > 0 && (
                    <div className="space-y-2 border-2 border-gray-200 p-4">
                      {imageUrls.map((url, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between border border-gray-200 p-2"
                        >
                          <span className="text-xs truncate flex-1">{url}</span>
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={() => removeImageUrl(url)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {errors.images && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.images.message}
                  </p>
                )}
              </div>

              {/* Flags */}
              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isNewDrop}
                    onChange={(e) => setValue("isNewDrop", e.target.checked)}
                    className="h-4 w-4 border-2 border-gray-900"
                  />
                  <span className="font-bold uppercase text-xs">
                    Novo Lançamento
                  </span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setValue("isFeatured", e.target.checked)}
                    className="h-4 w-4 border-2 border-gray-900"
                  />
                  <span className="font-bold uppercase text-xs">
                    Produto em Destaque
                  </span>
                </label>
              </div>

              {/* Botões */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 border-2 border-gray-900 bg-gray-900 font-bold uppercase text-white hover:bg-orange-street shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Salvando...
                    </>
                  ) : editingProduct ? (
                    "Atualizar Produto"
                  ) : (
                    "Criar Produto"
                  )}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                  className="border-2 border-gray-900 font-bold uppercase"
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Tabela de produtos */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-orange-street" />
        </div>
      ) : products.length === 0 ? (
        <div className="border-2 border-gray-200 bg-white p-12 text-center">
          <Package className="mx-auto h-16 w-16 text-gray-400" />
          <h3 className="mt-4 text-lg font-bold uppercase text-gray-900">
            Nenhum produto cadastrado
          </h3>
          <p className="mt-2 text-sm text-gray-600">
            Clique em "Novo Produto" para começar
          </p>
        </div>
      ) : (
        <div className="border-2 border-gray-900 bg-white overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b-2 border-gray-900 bg-gray-900">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-white">
                    Produto
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-white">
                    Categoria
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-white">
                    Preço
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-white">
                    Estoque
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-white">
                    Status
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-bold uppercase tracking-wide text-white">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="h-12 w-12 border border-gray-200 object-cover"
                        />
                        <div>
                          <p className="font-bold text-sm text-gray-900">
                            {product.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {product.slug}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-xs font-medium uppercase text-gray-700">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div>
                        <p className="font-bold text-sm text-gray-900">
                          R$ {product.price.toFixed(2)}
                        </p>
                        {product.oldPrice && (
                          <p className="text-xs text-gray-500 line-through">
                            R$ {product.oldPrice.toFixed(2)}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`font-bold text-sm ${
                          product.stock > 10
                            ? "text-green-600"
                            : product.stock > 0
                            ? "text-orange-600"
                            : "text-red-600"
                        }`}
                      >
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-wrap gap-1">
                        {product.isNewDrop && (
                          <Badge className="border border-orange-600 bg-orange-600 text-xs uppercase text-white">
                            New
                          </Badge>
                        )}
                        {product.isFeatured && (
                          <Badge className="border border-blue-600 bg-blue-600 text-xs uppercase text-white">
                            Destaque
                          </Badge>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openDialog(product)}
                          className="border-2 border-gray-900 hover:bg-gray-100"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(product.id)}
                          className={`border-2 ${
                            deleteConfirm === product.id
                              ? "border-red-600 bg-red-600 text-white"
                              : "border-gray-900 text-red-600 hover:bg-red-50"
                          }`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

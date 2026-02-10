"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { productsApi, CreateProductData } from "@/lib/api/products";
import { useAuth } from "@/lib/store/useAuth";
import { toast } from "sonner";
import { Product } from "@/lib/types/product";
import { useUploadThing } from "@/lib/uploadthing";
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
import {
  PRODUCT_CATEGORIES,
  PRODUCT_SIZES,
  type ProductCategory,
  type ProductSize,
} from "@/lib/constants/product";

// Schema de validação
const productSchema = z.object({
  name: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  description: z.string().min(10, "Descrição deve ter no mínimo 10 caracteres"),
  price: z.number().min(0.01, "Preço deve ser maior que 0"),
  oldPrice: z.number().optional(),
  category: z.enum(PRODUCT_CATEGORIES),
  stock: z.number().min(0, "Estoque não pode ser negativo"),
  slug: z.string().min(3, "Slug deve ter no mínimo 3 caracteres"),
  sizes: z
    .array(z.enum(PRODUCT_SIZES))
    .min(1, "Selecione pelo menos um tamanho"),
  images: z.array(z.string()).min(1, "Adicione pelo menos uma imagem"),
  isNewDrop: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

export function AdminProductsTemplate() {
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
    getValues,
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

  const MAX_IMAGES = 4;
  const { startUpload, isUploading: isUploadingImages } = useUploadThing(
    "productImage",
    {
      headers: () => ({
        Authorization: token ? `Bearer ${token}` : "",
      }),
      onClientUploadComplete: (files) => {
        const urls = files
          .map((file) => file.url || file.ufsUrl || file.appUrl)
          .filter((url): url is string => Boolean(url));

        if (urls.length === 0) {
          toast.error("Upload concluído, mas nenhuma URL foi retornada");
          return;
        }

        const current = getValues("images") || [];
        const merged = [...current, ...urls].slice(0, MAX_IMAGES);
        setValue("images", merged);
        toast.success("Imagens enviadas com sucesso");
      },
      onUploadError: (error) => {
        toast.error("Erro no upload", {
          description: error.message,
        });
      },
    },
  );

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
        await productsApi.update(editingProduct.id, data, token);
        toast.success("Produto atualizado com sucesso!");
      } else {
        await productsApi.create(data, token);
        toast.success("Produto criado com sucesso!");
      }

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
  function toggleSize(size: ProductSize) {
    const current = selectedSizes || [];
    if (current.includes(size)) {
      setValue(
        "sizes",
        current.filter((s) => s !== size),
      );
    } else {
      setValue("sizes", [...current, size]);
    }
  }

  // Remover URL de imagem
  function removeImageUrl(url: string) {
    const current = imageUrls || [];
    setValue(
      "images",
      current.filter((u) => u !== url),
    );
  }

  function handleImageFiles(files: FileList | null) {
    if (!files || files.length === 0) return;

    if (!token) {
      toast.error("Você precisa estar autenticado");
      return;
    }

    const current = getValues("images") || [];
    const remaining = MAX_IMAGES - current.length;

    if (remaining <= 0) {
      toast.error("Limite de imagens atingido (4)");
      return;
    }

    const selected = Array.from(files).slice(0, remaining);
    startUpload(selected);
  }

  const availableSizes = PRODUCT_SIZES;
  const categories: { value: ProductCategory; label: string }[] = [
    { value: "camisetas", label: "Camisetas" },
    { value: "moletons", label: "Moletons" },
    { value: "calcas", label: "Calças" },
    { value: "jaquetas", label: "Jaquetas" },
    { value: "acessorios", label: "Acessórios" },
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
          <DialogContent className="min-w-130 max-h-[90vh] overflow-y-auto overflow-x-hidden border-2 border-gray-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
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

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-6 w-full max-w-full box-border"
            >
              {/* Nome */}
              <div>
                <Label htmlFor="name" className="font-bold uppercase text-xs">
                  Nome do Produto *
                </Label>
                <Input
                  id="name"
                  {...register("name")}
                  className="mt-1 w-full border-2 border-gray-900"
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
                  className="mt-1 w-full max-w-full border-2 border-gray-900 p-2 min-h-25 box-border"
                  placeholder="Descrição detalhada do produto..."
                />
                {errors.description && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.description.message}
                  </p>
                )}
              </div>

              {/* Preço e Preço Antigo */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
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
                    className="mt-1 w-full border-2 border-gray-900"
                    placeholder="149.90"
                  />
                  {errors.price && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.price.message}
                    </p>
                  )}
                </div>

                <div className="flex-1">
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
                    className="mt-1 w-full border-2 border-gray-900"
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
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
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
                    <SelectTrigger className="mt-1 w-full border-2 border-gray-900">
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

                <div className="flex-1">
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
                    className="mt-1 w-full border-2 border-gray-900"
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
                  className="mt-1 w-full border-2 border-gray-900"
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
                <div className="mt-2 flex flex-wrap gap-2 max-w-full">
                  {availableSizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => toggleSize(size)}
                      className={`border-2 px-2 py-1 font-bold uppercase text-xs transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${
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
                <div className="mt-2 space-y-3">
                  <Input
                    id="image-upload-input"
                    type="file"
                    accept="image/*"
                    multiple
                    disabled={
                      isUploadingImages ||
                      (imageUrls?.length ?? 0) >= MAX_IMAGES
                    }
                    className="w-full border-2 border-gray-900"
                    onChange={(e) => {
                      handleImageFiles(e.currentTarget.files);
                      e.currentTarget.value = "";
                    }}
                  />
                  <p className="text-xs text-gray-500">
                    Até 4 imagens (4MB cada). Apenas admins podem fazer upload.
                  </p>

                  {/* Preview das imagens */}
                  {imageUrls && imageUrls.length > 0 && (
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                      {imageUrls.map((url, index) => (
                        <div
                          key={`${url}-${index}`}
                          className="relative overflow-hidden border-2 border-gray-900"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={url}
                            alt={`Imagem ${index + 1}`}
                            className="h-24 w-full object-cover"
                          />
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={() => removeImageUrl(url)}
                            className="absolute right-1 top-1 h-7 w-7 border border-gray-900 bg-white p-0 text-red-600 hover:bg-red-600 hover:text-white"
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
              <div className="flex flex-col gap-4">
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

              {/* Botµes */}
              <div className="flex flex-col gap-3 pt-4">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full border-2 border-gray-900 bg-gray-900 font-bold uppercase text-white hover:bg-orange-street shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
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
        <div className="border-2 border-gray-200 bg-white p-12 text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
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
                        {/* eslint-disable-next-line @next/next/no-img-element */}
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
                          R${" "}
                          {typeof product.price === "string"
                            ? parseFloat(product.price).toFixed(2)
                            : product.price.toFixed(2)}
                        </p>
                        {product.oldPrice && (
                          <p className="text-xs text-gray-500 line-through">
                            R${" "}
                            {typeof product.oldPrice === "string"
                              ? parseFloat(product.oldPrice).toFixed(2)
                              : product.oldPrice.toFixed(2)}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`font-bold text-sm ${
                          Number(product.stock) > 10
                            ? "text-green-600"
                            : Number(product.stock) > 0
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
                          className="border-2 cursor-pointer border-gray-900 hover:bg-gray-900 hover:text-background"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(product.id)}
                          className={`border-2 cursor-pointer ${
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

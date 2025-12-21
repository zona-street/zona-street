import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

// Função de autenticação (verificar se é admin)
const auth = (req: Request) => {
  // Extrair token do header Authorization
  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new UploadThingError("Unauthorized");
  }

  const token = authHeader.split(" ")[1];

  // TODO: Verificar token JWT e validar se é admin
  // Por enquanto, apenas verificar se o token existe
  if (!token) {
    throw new UploadThingError("Unauthorized");
  }

  return { userId: "admin" };
};

// FileRouter para a aplicação
export const ourFileRouter = {
  // Rota para upload de imagens de produtos
  productImage: f({ image: { maxFileSize: "4MB", maxFileCount: 4 } })
    .middleware(async ({ req }) => {
      // Verificar autenticação
      const user = auth(req);
      return { userId: user.userId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId);
      console.log("file url", file.url);

      // Retornar URL para o cliente
      return { uploadedBy: metadata.userId, url: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;

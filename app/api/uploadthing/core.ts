import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import crypto from "crypto";

const f = createUploadthing();

const JWT_SECRET =
  process.env.JWT_SECRET || "zona-street-super-secret-key-change-in-production";

type JwtPayload = {
  id?: string;
  email?: string;
  role?: string;
  exp?: number;
};

function decodeBase64Url(input: string): string {
  return Buffer.from(input, "base64url").toString("utf8");
}

function verifyJwt(token: string): JwtPayload {
  const parts = token.split(".");
  if (parts.length !== 3) {
    throw new UploadThingError({ code: "FORBIDDEN", message: "Forbidden" });
  }

  const [encodedHeader, encodedPayload, signature] = parts;
  if (!encodedHeader || !encodedPayload || !signature) {
    throw new UploadThingError({ code: "FORBIDDEN", message: "Forbidden" });
  }

  const header = JSON.parse(decodeBase64Url(encodedHeader)) as {
    alg?: string;
    typ?: string;
  };

  if (header.alg !== "HS256") {
    throw new UploadThingError({ code: "FORBIDDEN", message: "Forbidden" });
  }

  const data = `${encodedHeader}.${encodedPayload}`;
  const expected = crypto
    .createHmac("sha256", JWT_SECRET)
    .update(data)
    .digest("base64url");

  const sigOk =
    expected.length === signature.length &&
    crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));

  if (!sigOk) {
    throw new UploadThingError({ code: "FORBIDDEN", message: "Forbidden" });
  }

  const payload = JSON.parse(decodeBase64Url(encodedPayload)) as JwtPayload;

  if (typeof payload.exp !== "number") {
    throw new UploadThingError({ code: "FORBIDDEN", message: "Forbidden" });
  }

  const now = Math.floor(Date.now() / 1000);
  if (payload.exp <= now) {
    throw new UploadThingError({ code: "FORBIDDEN", message: "Forbidden" });
  }

  return payload;
}

// Funo de autenticao (verificar se  admin)
const auth = (req: Request) => {
  if (!JWT_SECRET) {
    throw new UploadThingError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Server misconfigured",
    });
  }

  // Extrair token do header Authorization
  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new UploadThingError({ code: "FORBIDDEN", message: "Forbidden" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    throw new UploadThingError({ code: "FORBIDDEN", message: "Forbidden" });
  }

  const payload = verifyJwt(token);
  if (payload.role !== "admin") {
    throw new UploadThingError({ code: "FORBIDDEN", message: "Forbidden" });
  }

  return { userId: payload.id ?? "admin" };
};

// FileRouter para a aplicao
export const ourFileRouter = {
  // Rota para upload de imagens de produtos
  productImage: f({ image: { maxFileSize: "4MB", maxFileCount: 4 } })
    .middleware(async ({ req }) => {
      // Verificar autenticao
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

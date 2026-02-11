/**
 * Normaliza a URL da API para garantir que tenha protocolo e path correto
 */
export function getApiUrl(): string {
  let url = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333/api/v1";

  // Se não tem protocolo, adiciona https://
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    url = `https://${url}`;
  }

  // Remove trailing slash
  url = url.replace(/\/$/, "");

  // Se não tem /api/v1 no final, adiciona
  if (!url.endsWith("/api/v1")) {
    // Remove /api/v1 duplicado se existir
    url = url.replace(/\/api\/v1.*$/, "");
    url = `${url}/api/v1`;
  }

  return url;
}

/**
 * Faz fetch com timeout
 */
export async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  timeoutMs: number = 10000
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

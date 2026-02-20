import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FRONTEND_URL =
  process.env.FRONTEND_URL || "https://www.zonastreet.com.br";

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL
  ? `Zona Street <${process.env.RESEND_FROM_EMAIL}>`
  : "onboarding@resend.dev";

interface NewProductEmailData {
  productName: string;
  productDescription: string;
  productPrice: number;
  productImage: string;
  productSlug: string;
}

/**
 * Email Service - Envio de emails transacionais
 */
export class EmailService {
  /**
   * Envia email de novo produto para um assinante
   */
  async sendNewProductEmail(
    to: string,
    productData: NewProductEmailData,
  ): Promise<void> {
    const {
      productName,
      productDescription,
      productPrice,
      productImage,
      productSlug,
    } = productData;

    // Garante que a imagem é uma URL absoluta
    const imageUrl = productImage.startsWith("http")
      ? productImage
      : `${FRONTEND_URL}${productImage}`;

    // Query param para fácil desinscrita
    const unsubscribeLink = `${FRONTEND_URL}/unsubscribe?email=${encodeURIComponent(to)}`;

    const priceFormatted = `R$ ${productPrice.toFixed(2).replace(".", ",")}`;
    const productUrl = `${FRONTEND_URL}/produtos/${productSlug}`;

    // Versão plain-text (reduz spam score significativamente)
    const plainText = [
      `ZONA STREET - Novo Lançamento`,
      ``,
      `${productName}`,
      `${priceFormatted}`,
      ``,
      productDescription,
      ``,
      `Ver produto: ${productUrl}`,
      ``,
      `---`,
      `Você recebeu este e-mail porque se inscreveu na newsletter da Zona Street.`,
      `Para cancelar inscrição: ${unsubscribeLink}`,
      `© ${new Date().getFullYear()} Zona Street. Todos os direitos reservados.`,
    ].join("\n");

    console.log("📧 Enviando email de novo produto:", {
      to,
      productName,
      imageUrl,
      unsubscribeLink,
    });

    try {
      await resend.emails.send({
        from: FROM_EMAIL,
        replyTo: process.env.RESEND_FROM_EMAIL || FROM_EMAIL,
        to,
        subject: `Novo Lançamento: ${productName} | Zona Street`,
        text: plainText,
        headers: {
          // RFC 2369 - sinaliza email legítimo para Gmail/Outlook
          "List-Unsubscribe": `<${unsubscribeLink}>, <mailto:${process.env.RESEND_FROM_EMAIL || "contato@zonastreet.com.br"}?subject=unsubscribe>`,
          "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
          Precedence: "bulk",
          "X-Entity-Ref-ID": `zona-street-newsletter-${Date.now()}`,
        },
        html: `
          <!DOCTYPE html>
          <html lang="pt-BR" xmlns="http://www.w3.org/1999/xhtml">
            <head>
              <meta charset="utf-8">
              <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <meta name="x-apple-disable-message-reformatting">
              <meta name="format-detection" content="telephone=no, date=no, address=no, email=no">
              <title>Novo Lançamento: ${productName} | Zona Street</title>
              <style>
                body {
                  font-family: Arial, sans-serif;
                  line-height: 1.6;
                  color: #171717;
                  background-color: #F5F5F5;
                  margin: 0;
                  padding: 0;
                }
                .container {
                  max-width: 600px;
                  margin: 20px auto;
                  background-color: #FFFFFF;
                  border: 2px solid #171717;
                }
                .header {
                  background-color: #171717;
                  color: #FFFFFF;
                  padding: 30px 20px;
                  text-align: center;
                  border-bottom: 2px solid #171717;
                }
                .header h1 {
                  margin: 0;
                  font-size: 28px;
                  font-weight: 900;
                  text-transform: uppercase;
                  letter-spacing: 2px;
                }
                .content {
                  padding: 40px 20px;
                }
                .product-image {
                  width: 100%;
                  max-width: 400px;
                  height: auto;
                  border: 2px solid #171717;
                  margin: 0 auto 20px;
                  display: block;
                  border-radius: 0;
                }
                .product-name {
                  font-size: 24px;
                  font-weight: 900;
                  text-transform: uppercase;
                  margin: 0 0 10px 0;
                  color: #171717;
                }
                .product-price {
                  font-size: 32px;
                  font-weight: 900;
                  color: #F57C00;
                  margin: 10px 0 20px 0;
                }
                .product-description {
                  font-size: 16px;
                  color: #4D4D4D;
                  margin: 0 0 30px 0;
                  line-height: 1.8;
                }
                .cta-button {
                  display: inline-block;
                  background-color: #F57C00;
                  color: #FFFFFF;
                  padding: 16px 40px;
                  text-decoration: none;
                  font-weight: 900;
                  text-transform: uppercase;
                  border: 2px solid #171717;
                  box-shadow: 4px 4px 0px 0px rgba(0, 0, 0, 1);
                  transition: all 0.3s;
                  font-size: 14px;
                  letter-spacing: 1px;
                }
                .cta-button:hover {
                  box-shadow: 6px 6px 0px 0px rgba(0, 0, 0, 1);
                  transform: translate(-2px, -2px);
                }
                .footer {
                  background-color: #F5F5F5;
                  padding: 20px;
                  text-align: center;
                  font-size: 12px;
                  color: #737373;
                  border-top: 2px solid #E3E3E3;
                }
                .unsubscribe {
                  color: #737373;
                  text-decoration: underline;
                }
              </style>
            </head>
            <body style="font-family: Arial, sans-serif; background-color: #F5F5F5; margin: 0; padding: 0;">
              <!-- preheader oculto: aparece no preview do cliente de email -->
              <div style="display: none; max-height: 0; overflow: hidden; mso-hide: all;">
                Novo lançamento exclusivo disponível agora na Zona Street — ${productName} por ${priceFormatted}
              </div>
              <div class="container" style="max-width: 600px; margin: 20px auto; background-color: #FFFFFF; border: 2px solid #171717;">
                <div class="header" style="background-color: #171717; color: #FFFFFF; padding: 30px 20px; text-align: center;">
                  <h1 style="margin: 0; font-size: 28px; font-weight: 900; text-transform: uppercase; letter-spacing: 2px; color: #FFFFFF;">ZONA STREET</h1>
                  <p style="margin: 5px 0 0 0; font-size: 14px; font-weight: 600; letter-spacing: 1px; color: #FFFFFF;">NOVO LANÇAMENTO 🔥</p>
                </div>
                <div class="content" style="padding: 40px 20px;">
                  <img 
                    src="${imageUrl}" 
                    alt="${productName}" 
                    class="product-image"
                    width="400"
                    height="400"
                    style="border: 2px solid #171717; margin: 0 auto 20px; display: block; max-width: 100%; height: auto; width: 100%;"
                  />
                  <h2 class="product-name" style="font-size: 24px; font-weight: 900; text-transform: uppercase; margin: 0 0 10px 0; color: #171717;">${productName}</h2>
                  <div class="product-price" style="font-size: 32px; font-weight: 900; color: #F57C00; margin: 10px 0 20px 0;">${priceFormatted}</div>
                  <p class="product-description" style="font-size: 16px; color: #4D4D4D; margin: 0 0 30px 0; line-height: 1.8;">${productDescription}</p>
                  <center>
                    <a href="${productUrl}" class="cta-button" style="display: inline-block; background-color: #F57C00; color: #FFFFFF; padding: 16px 40px; text-decoration: none; font-weight: 900; text-transform: uppercase; border: 2px solid #171717; box-shadow: 4px 4px 0px 0px rgba(0,0,0,1); font-size: 14px; letter-spacing: 1px;">
                      VER PRODUTO
                    </a>
                  </center>
                </div>
                <div class="footer" style="background-color: #F5F5F5; padding: 20px; text-align: center; font-size: 12px; color: #737373; border-top: 2px solid #E3E3E3;">
                  <p style="margin: 0 0 8px 0;">Você está recebendo este e-mail porque se inscreveu na newsletter da Zona Street.</p>
                  <p style="margin: 0 0 8px 0;">
                    <a href="${unsubscribeLink}" class="unsubscribe" style="color: #737373; text-decoration: underline;">Cancelar inscrição</a>
                  </p>
                  <p style="margin-top: 10px;">© ${new Date().getFullYear()} Zona Street. Todos os direitos reservados.</p>
                </div>
              </div>
            </body>
          </html>
        `,
      });
    } catch (error) {
      console.error("Erro ao enviar email:", error);
      throw error;
    }
  }

  /**
   * Envia emails em lote para todos os assinantes
   */
  async sendBulkNewProductEmails(
    emails: string[],
    productData: NewProductEmailData,
  ): Promise<void> {
    const promises = emails.map((email) =>
      this.sendNewProductEmail(email, productData).catch((error) => {
        console.error(`Erro ao enviar email para ${email}:`, error);
        return null;
      }),
    );

    await Promise.allSettled(promises);
  }

  /**
   * Envia email de reset de senha
   */
  async sendPasswordResetEmail(to: string, resetToken: string): Promise<void> {
    const resetUrl = `${process.env.FRONTEND_URL || "http://localhost:3000"}/admin/reset-password?token=${resetToken}`;

    try {
      await resend.emails.send({
        from: FROM_EMAIL,
        to,
        subject: "Redefinição de senha - Zona Street",
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <style>
                body {
                  font-family: Arial, sans-serif;
                  line-height: 1.6;
                  color: #171717;
                  background-color: #F5F5F5;
                  margin: 0;
                  padding: 0;
                }
                .container {
                  max-width: 600px;
                  margin: 20px auto;
                  background-color: #FFFFFF;
                  border: 2px solid #171717;
                }
                .header {
                  background-color: #171717;
                  color: #FFFFFF;
                  padding: 30px 20px;
                  text-align: center;
                  border-bottom: 2px solid #171717;
                }
                .header h1 {
                  margin: 0;
                  font-size: 28px;
                  font-weight: 900;
                  text-transform: uppercase;
                  letter-spacing: 2px;
                }
                .content {
                  padding: 40px 20px;
                }
                .button {
                  display: inline-block;
                  padding: 16px 40px;
                  background-color: #ea580c;
                  color: #FFFFFF !important;
                  text-decoration: none;
                  font-weight: 900;
                  text-transform: uppercase;
                  border: 2px solid #171717;
                  box-shadow: 4px 4px 0px #171717;
                  transition: all 0.2s;
                  margin: 20px 0;
                }
                .reset-link {
                  word-break: break-all;
                  background: #F5F5F5;
                  padding: 15px;
                  border: 2px solid #171717;
                  font-size: 14px;
                  color: #171717;
                  margin: 20px 0;
                }
                .warning {
                  background-color: #fef3c7;
                  border: 2px solid #171717;
                  padding: 15px;
                  margin: 20px 0;
                }
                .warning-text {
                  color: #dc2626;
                  font-weight: 900;
                  margin: 0;
                }
                .footer {
                  background-color: #F5F5F5;
                  border-top: 2px solid #171717;
                  padding: 20px;
                  text-align: center;
                  font-size: 14px;
                  color: #4D4D4D;
                }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>Zona Street</h1>
                </div>
                <div class="content">
                  <h2 style="font-size: 22px; font-weight: 900; text-transform: uppercase; margin: 0 0 20px 0;">
                    Redefinição de Senha
                  </h2>
                  <p style="font-size: 16px; margin: 0 0 15px 0;">
                    Você solicitou a redefinição de senha da sua conta de administrador.
                  </p>
                  <p style="font-size: 16px; margin: 0 0 20px 0;">
                    Clique no botão abaixo para criar uma nova senha:
                  </p>
                  <center>
                    <a href="${resetUrl}" class="button">
                      Redefinir Senha
                    </a>
                  </center>
                  <p style="font-size: 14px; margin: 30px 0 10px 0; color: #4D4D4D;">
                    Ou copie e cole este link no navegador:
                  </p>
                  <div class="reset-link">${resetUrl}</div>
                  <div class="warning">
                    <p class="warning-text">⚠️ Este link expira em 15 minutos.</p>
                  </div>
                  <p style="font-size: 14px; margin: 30px 0 0 0; color: #4D4D4D;">
                    Se você não solicitou esta redefinição, ignore este email. Sua senha permanecerá inalterada.
                  </p>
                </div>
                <div class="footer">
                  <p style="margin: 0;">© ${new Date().getFullYear()} Zona Street. Todos os direitos reservados.</p>
                </div>
              </div>
            </body>
          </html>
        `,
      });
    } catch (error) {
      console.error("Erro ao enviar email de reset de senha:", error);
      throw new Error("Falha ao enviar email de reset de senha");
    }
  }
}

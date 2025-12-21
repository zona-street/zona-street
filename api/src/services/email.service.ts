import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

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
    productData: NewProductEmailData
  ): Promise<void> {
    const { productName, productDescription, productPrice, productImage, productSlug } = productData;

    try {
      await resend.emails.send({
        from: "Zona Street <noreply@zonastreet.com>",
        to,
        subject: `🔥 Novo Lançamento: ${productName}`,
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
                .product-image {
                  width: 100%;
                  max-width: 400px;
                  height: auto;
                  border: 2px solid #171717;
                  margin: 0 auto 20px;
                  display: block;
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
            <body>
              <div class="container">
                <div class="header">
                  <h1>🔥 ZONA STREET</h1>
                  <p style="margin: 5px 0 0 0; font-size: 14px; font-weight: 600; letter-spacing: 1px;">NOVO LANÇAMENTO</p>
                </div>
                <div class="content">
                  <img src="${productImage}" alt="${productName}" class="product-image" />
                  <h2 class="product-name">${productName}</h2>
                  <div class="product-price">R$ ${productPrice.toFixed(2).replace('.', ',')}</div>
                  <p class="product-description">${productDescription}</p>
                  <center>
                    <a href="https://zonastreet.com/produto/${productSlug}" class="cta-button">
                      VER PRODUTO
                    </a>
                  </center>
                </div>
                <div class="footer">
                  <p>Você está recebendo este e-mail porque se inscreveu na newsletter da Zona Street.</p>
                  <p>
                    <a href="https://zonastreet.com/unsubscribe" class="unsubscribe">Cancelar inscrição</a>
                  </p>
                  <p style="margin-top: 10px;">© 2025 Zona Street. Todos os direitos reservados.</p>
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
    productData: NewProductEmailData
  ): Promise<void> {
    const promises = emails.map((email) =>
      this.sendNewProductEmail(email, productData).catch((error) => {
        console.error(`Erro ao enviar email para ${email}:`, error);
        return null;
      })
    );

    await Promise.allSettled(promises);
  }
}

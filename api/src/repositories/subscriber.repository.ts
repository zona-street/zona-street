import { eq } from "drizzle-orm";
import { db } from "../db";
import { subscribers, type Subscriber } from "../db/schema";

/**
 * Subscriber Repository - Camada de acesso a dados
 */
export class SubscriberRepository {
  /**
   * Busca um assinante por email
   */
  async findByEmail(email: string): Promise<Subscriber | null> {
    const [subscriber] = await db
      .select()
      .from(subscribers)
      .where(eq(subscribers.email, email));
    return subscriber || null;
  }

  /**
   * Cria um novo assinante
   */
  async create(email: string): Promise<Subscriber> {
    const [newSubscriber] = await db
      .insert(subscribers)
      .values({ email })
      .returning();

    return newSubscriber;
  }

  /**
   * Lista todos os assinantes
   */
  async findAll(): Promise<Subscriber[]> {
    return db.select().from(subscribers);
  }

  /**
   * Remove um assinante
   */
  async delete(email: string): Promise<boolean> {
    const result = await db
      .delete(subscribers)
      .where(eq(subscribers.email, email))
      .returning();

    return result.length > 0;
  }
}

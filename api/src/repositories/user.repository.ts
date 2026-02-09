import { eq, isNotNull } from "drizzle-orm";
import { db } from "../db";
import { users, type User, type NewUser } from "../db/schema";

/**
 * User Repository - Camada de acesso a dados
 * Responsável por todas as operações de banco relacionadas a usuários
 */
export class UserRepository {
  /**
   * Busca um usuário por email
   */
  async findByEmail(email: string): Promise<User | null> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || null;
  }

  /**
   * Busca um usuário por ID
   */
  async findById(id: string): Promise<User | null> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || null;
  }

  /**
   * Cria um novo usuário
   */
  async create(userData: NewUser): Promise<User> {
    const [newUser] = await db.insert(users).values(userData).returning();

    return newUser;
  }

  /**
   * Lista todos os usuários (apenas para admins)
   */
  async findAll(): Promise<User[]> {
    return db.select().from(users);
  }

  /**
   * Atualiza o role de um usuário
   */
  async updateRole(
    id: string,
    role: "admin" | "customer"
  ): Promise<User | null> {
    const [updatedUser] = await db
      .update(users)
      .set({ role, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();

    return updatedUser || null;
  }

  /**
   * Atualiza a senha de um usuário
   */
  async updatePassword(id: string, hashedPassword: string): Promise<void> {
    await db
      .update(users)
      .set({ password: hashedPassword, updatedAt: new Date() })
      .where(eq(users.id, id));
  }

  /**
   * Atualiza o token de reset de senha
   */
  async updateResetToken(
    id: string,
    resetTokenHash: string,
    resetTokenExpiresAt: Date
  ): Promise<void> {
    await db
      .update(users)
      .set({
        resetTokenHash,
        resetTokenExpiresAt,
        updatedAt: new Date(),
      })
      .where(eq(users.id, id));
  }

  /**
   * Busca usuários com token de reset válido
   */
  async findUsersWithResetToken(): Promise<User[]> {
    return db
      .select()
      .from(users)
      .where(isNotNull(users.resetTokenHash));
  }

  /**
   * Atualiza senha e limpa token de reset
   */
  async updatePasswordAndClearResetToken(
    id: string,
    hashedPassword: string
  ): Promise<void> {
    await db
      .update(users)
      .set({
        password: hashedPassword,
        resetTokenHash: null,
        resetTokenExpiresAt: null,
        updatedAt: new Date(),
      })
      .where(eq(users.id, id));
  }
}

import bcrypt from "bcryptjs";
import crypto from "crypto";
import { UserRepository } from "../repositories/user.repository";
import { EmailService } from "./email.service";
import type { NewUser, User } from "../db/schema";

/**
 * Auth Service - Regras de negócio de autenticação
 */
export class AuthService {
  private userRepository: UserRepository;
  private emailService: EmailService;

  constructor() {
    this.userRepository = new UserRepository();
    this.emailService = new EmailService();
  }

  /**
   * Registra um novo usuário
   */
  async register(
    email: string,
    password: string,
    role: "admin" | "customer" = "customer",
  ): Promise<Omit<User, "password">> {
    // Verifica se o email já existe
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new Error("Email já cadastrado");
    }

    // Valida a senha (mínimo 6 caracteres)
    if (password.length < 6) {
      throw new Error("Senha deve ter no mínimo 6 caracteres");
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Cria o usuário
    const newUser: NewUser = {
      email,
      password: hashedPassword,
      role,
    };

    const user = await this.userRepository.create(newUser);

    // Retorna sem a senha
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  /**
   * Autentica um usuário
   */
  async login(
    email: string,
    password: string,
  ): Promise<Omit<User, "password">> {
    // Busca o usuário
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error("Email ou senha incorretos");
    }

    // Verifica a senha
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Email ou senha incorretos");
    }

    // Retorna sem a senha
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  /**
   * Busca um usuário por ID (sem a senha)
   */
  async getUserById(id: string): Promise<Omit<User, "password"> | null> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      return null;
    }

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  /**
   * Troca a senha de um usuário autenticado
   */
  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
  ): Promise<void> {
    // Busca o usuário
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error("Usuário não encontrado");
    }

    // Verifica a senha atual
    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password,
    );
    if (!isPasswordValid) {
      throw new Error("Senha atual incorreta");
    }

    // Valida a nova senha
    if (newPassword.length < 6) {
      throw new Error("Nova senha deve ter no mínimo 6 caracteres");
    }

    // Gera hash da nova senha
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Atualiza a senha
    await this.userRepository.updatePassword(userId, hashedPassword);
  }

  /**
   * Solicita reset de senha via email
   */
  async requestPasswordReset(email: string): Promise<void> {
    // Busca o usuário (apenas admin pode resetar)
    const user = await this.userRepository.findByEmail(email);

    // Sempre retorna sucesso para evitar enumeração de emails
    // Mas só envia email se o usuário existir e for admin
    if (!user || user.role !== "admin") {
      return;
    }

    // Gera token aleatório seguro
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Gera hash do token para salvar no banco
    const resetTokenHash = await bcrypt.hash(resetToken, 10);

    // Define expiração de 15 minutos
    const resetTokenExpiresAt = new Date(Date.now() + 15 * 60 * 1000);

    // Salva o hash do token e a expiração no banco
    await this.userRepository.updateResetToken(
      user.id,
      resetTokenHash,
      resetTokenExpiresAt,
    );

    // Envia email com o token (não o hash)
    await this.emailService.sendPasswordResetEmail(email, resetToken);
  }

  /**
   * Redefine a senha usando o token de reset
   */
  async resetPassword(token: string, newPassword: string): Promise<void> {
    // Valida a nova senha
    if (newPassword.length < 6) {
      throw new Error("Nova senha deve ter no mínimo 6 caracteres");
    }

    // Busca todos os usuários admin (só deve haver um)
    const users = await this.userRepository.findUsersWithResetToken();

    // Busca o usuário com token válido
    let validUser: User | null = null;

    for (const user of users) {
      // Verifica se o token ainda é válido (não expirou)
      if (
        user.resetTokenHash &&
        user.resetTokenExpiresAt &&
        user.resetTokenExpiresAt > new Date()
      ) {
        // Compara o token fornecido com o hash salvo
        const isTokenValid = await bcrypt.compare(token, user.resetTokenHash);
        if (isTokenValid) {
          validUser = user;
          break;
        }
      }
    }

    if (!validUser) {
      throw new Error("Token inválido ou expirado");
    }

    // Gera hash da nova senha
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Atualiza a senha e limpa o token de reset
    await this.userRepository.updatePasswordAndClearResetToken(
      validUser.id,
      hashedPassword,
    );
  }
}

import bcrypt from "bcryptjs";
import { UserRepository } from "../repositories/user.repository";
import type { NewUser, User } from "../db/schema";

/**
 * Auth Service - Regras de negócio de autenticação
 */
export class AuthService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  /**
   * Registra um novo usuário
   */
  async register(
    email: string,
    password: string,
    role: "admin" | "customer" = "customer"
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
    password: string
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
}

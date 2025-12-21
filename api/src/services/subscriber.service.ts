import { SubscriberRepository } from "../repositories/subscriber.repository";
import type { Subscriber } from "../db/schema";

/**
 * Subscriber Service - Regras de negócio de assinantes
 */
export class SubscriberService {
  private subscriberRepository: SubscriberRepository;

  constructor() {
    this.subscriberRepository = new SubscriberRepository();
  }

  /**
   * Cadastra um novo assinante
   */
  async subscribe(email: string): Promise<Subscriber> {
    // Valida o email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error("Email inválido");
    }

    // Verifica se já existe
    const existingSubscriber = await this.subscriberRepository.findByEmail(email);
    if (existingSubscriber) {
      throw new Error("Email já cadastrado na newsletter");
    }

    // Cria o assinante
    return this.subscriberRepository.create(email);
  }

  /**
   * Lista todos os assinantes
   */
  async getAllSubscribers(): Promise<Subscriber[]> {
    return this.subscriberRepository.findAll();
  }

  /**
   * Remove um assinante
   */
  async unsubscribe(email: string): Promise<boolean> {
    const subscriber = await this.subscriberRepository.findByEmail(email);
    if (!subscriber) {
      throw new Error("Email não encontrado");
    }

    return this.subscriberRepository.delete(email);
  }
}

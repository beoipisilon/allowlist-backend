import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class UptimeService {
  private readonly siteUrl = 'https://seusite.com'; // URL do site que você quer monitorar

  async checkUptime(): Promise<{ status: string; responseTime: number }> {
    try {
      const startTime = Date.now(); // Inicia o timer para calcular o tempo de resposta

      // Faz a requisição HTTP para o site
      const response = await axios.get(this.siteUrl, {
        timeout: 5000, // Timeout de 5 segundos
      });

      const responseTime = Date.now() - startTime; // Calcula o tempo de resposta

      // Verifica se o status HTTP está entre 200 e 299 (sucesso)
      if (response.status >= 200 && response.status < 300) {
        return { status: 'up', responseTime };
      } else {
        return { status: 'down', responseTime };
      }
    } catch (error) {
      // Se houver erro (timeout, conexão recusada, etc.), o site está offline
      return { status: 'down', responseTime: -1 };
    }
  }
}
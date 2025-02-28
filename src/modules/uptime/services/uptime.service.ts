import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class UptimeService {
  private readonly siteUrl = 'https://seusite.com'; // URL do site que você quer monitorar
  private history: boolean[] = []; // Array para armazenar histórico de status (true = up, false = down)
  private readonly maxHistory = 100; // Número máximo de verificações armazenadas

  async checkUptime(): Promise<{ uptime: number; responseTime: number }> {
    try {
      const startTime = Date.now(); // Inicia o timer para calcular o tempo de resposta

      // Faz a requisição HTTP para o site
      const response = await axios.get(this.siteUrl, {
        timeout: 5000, // Timeout de 5 segundos
      });

      const responseTime = Date.now() - startTime; // Calcula o tempo de resposta

      // Verifica se o status HTTP está entre 200 e 299 (sucesso)
      const isUp = response.status >= 200 && response.status < 300;

      // Atualiza o histórico
      this.updateHistory(isUp);

      return { uptime: this.calculateUptime(), responseTime };
    } catch (error) {
      // Se houver erro (timeout, conexão recusada, etc.), considera como "down"
      this.updateHistory(false);
      return { uptime: this.calculateUptime(), responseTime: -1 };
    }
  }

  private updateHistory(isUp: boolean) {
    this.history.push(isUp);
    if (this.history.length > this.maxHistory) {
      this.history.shift(); // Remove o mais antigo para manter o limite
    }
  }

  private calculateUptime(): number {
    if (this.history.length === 0) return 0; 
    const upCount = this.history.filter(status => status).length; 
    return (upCount / this.history.length) * 100; 
  }
}
